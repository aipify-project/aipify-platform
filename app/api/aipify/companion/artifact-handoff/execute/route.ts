import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getExternalArtifactHandoffAdapter } from "@/lib/integration-intelligence/external-artifact-handoff/registry";
import {
  downloadCompanionHandoffAttachmentBytes,
  loadCanvaHandoffConnectionMaterial,
  loadCompanionHandoffAttachmentAccess,
  recordCompanionArtifactHandoffAudit,
} from "@/lib/integration-intelligence/external-artifact-handoff/server";
import { assertCanvaHandoffPermissionForRole } from "@/lib/integration-intelligence/providers/canva/permissions";
import { classifyExternalProviderHandoff } from "@/lib/companion-runtime/artifact-context/external-handoff";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import type { UserRole } from "@/lib/tenant/types";

type ExecuteBody = {
  provider_key?: string;
  attachment_id?: string;
  conversation_id?: string;
  consent_granted?: boolean;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ExecuteBody;
    const providerKey = (body.provider_key ?? "canva").trim().toLowerCase();
    const attachmentId = body.attachment_id?.trim();
    const conversationId = body.conversation_id?.trim();
    const consentGranted = body.consent_granted === true;

    if (!attachmentId || !conversationId) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const adapter = getExternalArtifactHandoffAdapter(providerKey);
    if (!adapter) {
      return NextResponse.json({ ok: false, error: "adapter_missing" }, { status: 404 });
    }

    const profile = await getDashboardProfile(supabase);
    if (!profile) {
      return NextResponse.json({ ok: false, error: "no_profile" }, { status: 403 });
    }

    const { data: customerRow } = await supabase
      .from("customers")
      .select("id")
      .eq("company_id", profile.company.id)
      .maybeSingle();

    const attachment = await loadCompanionHandoffAttachmentAccess(supabase, attachmentId);
    if (!attachment.ok || attachment.conversation_id !== conversationId) {
      return NextResponse.json({ ok: false, error: attachment.error ?? "forbidden" }, { status: 403 });
    }

    if (attachment.security_status !== "approved") {
      return NextResponse.json({ ok: false, error: "attachment_not_approved" }, { status: 400 });
    }

    const permissionGranted = assertCanvaHandoffPermissionForRole(profile.user.role as UserRole);

    const connection = await loadCanvaHandoffConnectionMaterial(supabase);
    const handoffClass = classifyExternalProviderHandoff({
      provider_key: providerKey,
      consent_granted: consentGranted,
      permission_granted: permissionGranted,
      connection_connected: connection.connected,
    });

    if (handoffClass.status === "permission_denied") {
      return NextResponse.json({ ok: false, status: "permission_denied", handoff: handoffClass }, { status: 403 });
    }

    if (handoffClass.status === "consent_required") {
      return NextResponse.json({ ok: false, status: "consent_required", handoff: handoffClass }, { status: 400 });
    }

    if (handoffClass.status === "partial" || handoffClass.status === "adapter_missing") {
      return NextResponse.json({ ok: false, status: handoffClass.status, handoff: handoffClass }, { status: 409 });
    }

    if (!attachment.storage_path) {
      return NextResponse.json({ ok: false, error: "storage_missing" }, { status: 400 });
    }

    const fileBytes = await downloadCompanionHandoffAttachmentBytes(supabase, attachment.storage_path);
    if (!fileBytes) {
      return NextResponse.json({ ok: false, error: "download_failed" }, { status: 500 });
    }

    const result = await adapter.execute({
      provider_key: providerKey,
      attachment_id: attachmentId,
      conversation_id: conversationId,
      consent_granted: consentGranted,
      user_id: profile.user.id,
      tenant_id: customerRow?.id ?? "",
      company_id: profile.company.id,
      filename: attachment.original_filename ?? "attachment",
      mime_type: attachment.mime_type ?? "application/octet-stream",
      file_bytes: fileBytes,
      access_token: connection.access_token,
    });

    const audited = await recordCompanionArtifactHandoffAudit(supabase, {
      conversation_id: conversationId,
      attachment_id: attachmentId,
      provider_key: providerKey,
      consent_granted: consentGranted,
      status: result.status,
      external_reference: result.external_reference,
      open_url: result.open_url,
      failure_code: result.failure_code,
      metadata: { ok: result.ok },
    });

    return NextResponse.json({
      ...result,
      audited,
      handoff: handoffClass,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "execute_failed" }, { status: 500 });
  }
}
