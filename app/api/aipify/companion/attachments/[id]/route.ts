import { NextResponse } from "next/server";
import { COMPANION_ATTACHMENT_STORAGE_BUCKET } from "@/lib/companion-runtime/artifact-context";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: accessRaw, error } = await supabase.rpc(
      "get_companion_conversation_attachment_access",
      { p_attachment_id: id },
    );

    if (error) {
      return NextResponse.json({ ok: false, error: "access_failed" }, { status: 500 });
    }

    const access = (accessRaw ?? {}) as {
      ok?: boolean;
      error?: string;
      storage_path?: string;
      preview_available?: boolean;
      category?: string;
      original_filename?: string;
      mime_type?: string;
      byte_size?: number;
      security_status?: string;
    };

    if (!access.ok) {
      const status = access.error === "forbidden" ? 403 : 404;
      return NextResponse.json({ ok: false, error: access.error ?? "not_found" }, { status });
    }

    let previewUrl: string | undefined;
    if (access.preview_available && access.storage_path) {
      const { data: signed } = await supabase.storage
        .from(COMPANION_ATTACHMENT_STORAGE_BUCKET)
        .createSignedUrl(access.storage_path, 300);
      previewUrl = signed?.signedUrl;
    }

    return NextResponse.json({
      ok: true,
      attachment_id: id,
      original_filename: access.original_filename,
      mime_type: access.mime_type,
      byte_size: access.byte_size,
      category: access.category,
      security_status: access.security_status,
      preview_url: previewUrl,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "access_failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: accessRaw } = await supabase.rpc("get_companion_conversation_attachment_access", {
      p_attachment_id: id,
    });
    const access = (accessRaw ?? {}) as { ok?: boolean; storage_path?: string };

    const { data: deleteRaw, error } = await supabase.rpc(
      "soft_delete_companion_conversation_attachment",
      { p_attachment_id: id },
    );

    if (error) {
      return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
    }

    const deleteResult = (deleteRaw ?? {}) as { ok?: boolean };
    if (!deleteResult.ok) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    if (access.ok && access.storage_path) {
      await supabase.storage.from(COMPANION_ATTACHMENT_STORAGE_BUCKET).remove([access.storage_path]);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }
}
