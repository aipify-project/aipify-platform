import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { classifyExternalApplicationHandoffFromRegistry } from "@/lib/integration-intelligence/external-applications/handoff-bridge";
import {
  assertHandoffPermissionForRole,
  loadHandoffConnectionMaterial,
} from "@/lib/integration-intelligence/external-artifact-handoff/connection-loader";
import {
  downloadCompanionHandoffAttachmentBytes,
  loadCompanionHandoffAttachmentAccess,
  recordCompanionArtifactHandoffAudit,
} from "@/lib/integration-intelligence/external-artifact-handoff/server";
import {
  executeMicrosoft365Action,
  isMicrosoft365ApplicationKey,
} from "@/lib/integration-intelligence/providers/microsoft365";
import {
  assertExternalApplicationActionMayProceed,
  finalizeExternalApplicationActionResult,
  type ExternalApplicationOperation,
} from "@/lib/companion-runtime/external-application-orchestration";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import type { UserRole } from "@/lib/tenant/types";

type ExecuteBody = {
  application_key?: string;
  operation?: ExternalApplicationOperation;
  consent_granted?: boolean;
  attachment_id?: string;
  conversation_id?: string;
  external_file_id?: string;
  filename?: string;
  mime_type?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ExecuteBody;
    const applicationKey = body.application_key?.trim().toLowerCase() ?? "";
    const operation = (body.operation ?? "create") as ExternalApplicationOperation;
    const consentGranted = body.consent_granted === true;

    if (!isMicrosoft365ApplicationKey(applicationKey)) {
      return NextResponse.json({ ok: false, error: "application_not_supported" }, { status: 404 });
    }

    const profile = await getDashboardProfile(supabase);
    if (!profile) {
      return NextResponse.json({ ok: false, error: "no_profile" }, { status: 403 });
    }

    const permissionGranted = assertHandoffPermissionForRole(applicationKey, profile.user.role as UserRole);
    const connection = await loadHandoffConnectionMaterial(supabase, applicationKey);
    const handoffClass = classifyExternalApplicationHandoffFromRegistry({
      application_key: applicationKey,
      consent_granted: consentGranted,
      permission_granted: permissionGranted,
      connection_connected: connection.connected,
      operation,
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

    let fileBytes: Buffer | undefined;
    let filename = body.filename?.trim();
    let mimeType = body.mime_type?.trim();
    const attachmentId = body.attachment_id?.trim();
    const conversationId = body.conversation_id?.trim();

    if (
      operation === "save" ||
      operation === "export" ||
      operation === "handoff"
    ) {
      if (!attachmentId || !conversationId) {
        return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
      }

      const attachment = await loadCompanionHandoffAttachmentAccess(supabase, attachmentId);
      if (!attachment.ok || attachment.conversation_id !== conversationId) {
        return NextResponse.json({ ok: false, error: attachment.error ?? "forbidden" }, { status: 403 });
      }
      if (attachment.security_status !== "approved") {
        return NextResponse.json({ ok: false, error: "attachment_not_approved" }, { status: 400 });
      }
      if (!attachment.storage_path) {
        return NextResponse.json({ ok: false, error: "storage_missing" }, { status: 400 });
      }

      const bytes = await downloadCompanionHandoffAttachmentBytes(supabase, attachment.storage_path);
      if (!bytes) {
        return NextResponse.json({ ok: false, error: "download_failed" }, { status: 500 });
      }

      fileBytes = bytes;
      filename = filename ?? attachment.original_filename ?? "attachment";
      mimeType = mimeType ?? attachment.mime_type ?? "application/octet-stream";
    }

    const adapterResult = await executeMicrosoft365Action({
      application_key: applicationKey,
      operation,
      consent_granted: consentGranted,
      access_token: connection.access_token,
      filename,
      mime_type: mimeType,
      file_bytes: fileBytes,
      external_file_id: body.external_file_id ?? null,
      artifact_id: attachmentId,
      conversation_id: conversationId,
    });

    const result = finalizeExternalApplicationActionResult(adapterResult);

    if (attachmentId && conversationId) {
      await recordCompanionArtifactHandoffAudit(supabase, {
        conversation_id: conversationId,
        attachment_id: attachmentId,
        provider_key: applicationKey,
        consent_granted: consentGranted,
        status: result.ok ? result.capability_status : (adapterResult.failure_code ?? "failed"),
        external_reference: result.external_reference,
        open_url: result.open_url,
        failure_code: result.failure_code,
        metadata: { operation, ok: result.ok, reported_as_executed: result.reported_as_executed },
      });
    }

    return NextResponse.json({
      ok: result.ok,
      status: result.ok ? "success" : (adapterResult.failure_code ?? "failed"),
      reported_as_executed: result.reported_as_executed,
      external_reference: result.external_reference,
      open_url: result.open_url,
      edit_url: result.edit_url,
      failure_code: result.failure_code,
      handoff: handoffClass,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "execute_failed" }, { status: 500 });
  }
}
