import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getExternalArtifactHandoffAdapter } from "@/lib/integration-intelligence/external-artifact-handoff/registry";
import {
  downloadCompanionHandoffAttachmentBytes,
  loadCompanionHandoffAttachmentAccess,
  recordCompanionArtifactHandoffAudit,
} from "@/lib/integration-intelligence/external-artifact-handoff/server";
import {
  assertHandoffPermissionForRole,
  loadHandoffConnectionMaterial,
} from "@/lib/integration-intelligence/external-artifact-handoff/connection-loader";
import { classifyExternalProviderHandoffFromRegistry } from "@/lib/integration-intelligence/external-applications/handoff-bridge";
import {
  assertExternalApplicationActionMayProceed,
  finalizeExternalApplicationActionResult,
} from "@/lib/companion-runtime/external-application-orchestration";
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

    const permissionGranted = assertHandoffPermissionForRole(providerKey, profile.user.role as UserRole);

    const connection = await loadHandoffConnectionMaterial(supabase, providerKey);
    const handoffClass = classifyExternalProviderHandoffFromRegistry({
      provider_key: providerKey,
      consent_granted: consentGranted,
      permission_granted: permissionGranted,
      connection_connected: connection.connected,
    });

    const blocked = assertExternalApplicationActionMayProceed({ handoff: handoffClass });
    if (blocked) {
      return NextResponse.json(
        {
          ok: false,
          status: blocked.failure_code ?? handoffClass.status,
          reported_as_executed: false,
          handoff: handoffClass,
        },
        { status: handoffClass.status === "permission_denied" ? 403 : 409 },
      );
    }

    if (!attachment.storage_path) {
      return NextResponse.json({ ok: false, error: "storage_missing" }, { status: 400 });
    }

    const fileBytes = await downloadCompanionHandoffAttachmentBytes(supabase, attachment.storage_path);
    if (!fileBytes) {
      return NextResponse.json({ ok: false, error: "download_failed" }, { status: 500 });
    }

    const adapterResult = await adapter.execute({
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

    const result = finalizeExternalApplicationActionResult({
      ok: adapterResult.ok,
      reported_as_executed: adapterResult.ok,
      capability_status: adapterResult.ok ? "connected" : "partial",
      application_key: providerKey,
      operation: "handoff",
      external_reference: adapterResult.external_reference,
      open_url: adapterResult.open_url,
      edit_url: adapterResult.open_url,
      failure_code: adapterResult.failure_code,
      audited: false,
    });

    const audited = await recordCompanionArtifactHandoffAudit(supabase, {
      conversation_id: conversationId,
      attachment_id: attachmentId,
      provider_key: providerKey,
      consent_granted: consentGranted,
      status: result.ok ? result.capability_status : (adapterResult.status ?? "failed"),
      external_reference: result.external_reference,
      open_url: result.open_url,
      failure_code: result.failure_code,
      metadata: { ok: result.ok, reported_as_executed: result.reported_as_executed },
    });

    return NextResponse.json({
      ok: result.ok,
      status: adapterResult.status,
      reported_as_executed: result.reported_as_executed,
      external_reference: result.external_reference,
      open_url: result.open_url,
      failure_code: result.failure_code,
      audited,
      handoff: handoffClass,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "execute_failed" }, { status: 500 });
  }
}
