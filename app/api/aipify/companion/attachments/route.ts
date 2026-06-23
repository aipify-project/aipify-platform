import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  COMPANION_ATTACHMENT_STORAGE_BUCKET,
  classifyAttachmentCategory,
  sanitizeAttachmentFilename,
  validateCompanionAttachmentFile,
} from "@/lib/companion-runtime/artifact-context";
import {
  buildCompanionAttachmentStoragePath,
  resolveCompanionAttachmentStorageContext,
} from "@/lib/companion-runtime/artifact-context/storage-path";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await request.formData();
    const file = form.get("file");
    const conversationId = String(form.get("conversation_id") ?? "").trim();
    const provenanceSource = String(form.get("provenance_source") ?? "user_upload").trim();

    if (!(file instanceof File) || !conversationId) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const validation = validateCompanionAttachmentFile({
      filename: file.name,
      mime_type: file.type || "application/octet-stream",
      byte_size: file.size,
    });

    if (!validation.ok) {
      return NextResponse.json(
        { ok: false, error: validation.code, message_key: validation.message_key },
        { status: 400 },
      );
    }

    const storageCtx = await resolveCompanionAttachmentStorageContext(supabase);
    if (!storageCtx) {
      return NextResponse.json({ ok: false, error: "no_tenant" }, { status: 403 });
    }

    const attachmentId = randomUUID();
    const safeName = sanitizeAttachmentFilename(file.name);
    const storagePath = buildCompanionAttachmentStoragePath({
      tenantId: storageCtx.tenantId,
      userId: storageCtx.userId,
      conversationId,
      attachmentId,
      filename: safeName,
    });
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(COMPANION_ATTACHMENT_STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: validation.mime_type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ ok: false, error: "storage_upload_failed" }, { status: 500 });
    }

    const { data: registerRaw, error: registerError } = await supabase.rpc(
      "register_companion_conversation_attachment",
      {
        p_conversation_id: conversationId,
        p_storage_path: storagePath,
        p_original_filename: safeName,
        p_mime_type: validation.mime_type,
        p_category: validation.category,
        p_byte_size: file.size,
        p_provenance_source: provenanceSource,
        p_metadata: {},
      },
    );

    if (registerError) {
      await supabase.storage.from(COMPANION_ATTACHMENT_STORAGE_BUCKET).remove([storagePath]);
      return NextResponse.json({ ok: false, error: "register_failed" }, { status: 500 });
    }

    const registerResult = (registerRaw ?? {}) as { ok?: boolean; attachment_id?: string };
    if (!registerResult.ok || !registerResult.attachment_id) {
      await supabase.storage.from(COMPANION_ATTACHMENT_STORAGE_BUCKET).remove([storagePath]);
      return NextResponse.json({ ok: false, error: "register_failed" }, { status: 500 });
    }

    const category = classifyAttachmentCategory(validation.mime_type);
    const previewAvailable = category === "image" || category === "text" || category === "pdf";

    let previewUrl: string | undefined;
    if (previewAvailable && category === "image") {
      const { data: signed } = await supabase.storage
        .from(COMPANION_ATTACHMENT_STORAGE_BUCKET)
        .createSignedUrl(storagePath, 300);
      previewUrl = signed?.signedUrl;
    }

    return NextResponse.json({
      ok: true,
      attachment: {
        attachment_id: registerResult.attachment_id,
        conversation_id: conversationId,
        original_filename: safeName,
        mime_type: validation.mime_type,
        category: validation.category,
        byte_size: file.size,
        security_status: "approved",
        provenance_source: provenanceSource,
        created_at: new Date().toISOString(),
        preview_available: previewAvailable,
        preview_url: previewUrl,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const conversationId = new URL(request.url).searchParams.get("conversation_id")?.trim();
    if (!conversationId) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("list_companion_conversation_attachments", {
      p_conversation_id: conversationId,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: "list_failed" }, { status: 500 });
    }

    return NextResponse.json(data ?? { ok: true, attachments: [] });
  } catch {
    return NextResponse.json({ ok: false, error: "list_failed" }, { status: 500 });
  }
}
