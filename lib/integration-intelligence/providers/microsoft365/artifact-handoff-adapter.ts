import type {
  ExternalArtifactHandoffAdapter,
  ExternalArtifactHandoffExecuteInput,
  ExternalArtifactHandoffResult,
} from "@/lib/integration-intelligence/external-artifact-handoff/types";
import {
  MICROSOFT365_HANDOFF_CAPABILITIES,
  MICROSOFT365_HANDOFF_READINESS,
  resolveMicrosoft365HandoffAction,
  type Microsoft365ApplicationKey,
} from "./connect-capabilities-audit";
import { uploadMicrosoft365DriveContent } from "./graph-client";

function buildFailure(
  input: ExternalArtifactHandoffExecuteInput,
  status: ExternalArtifactHandoffResult["status"],
  failureCode: string,
): ExternalArtifactHandoffResult {
  return {
    ok: false,
    status,
    provider_key: input.provider_key,
    attachment_id: input.attachment_id,
    external_reference: null,
    open_url: null,
    failure_code: failureCode,
    audited: false,
  };
}

function previewLabelKeyForAction(action: string | null): string {
  if (action === "artifact.handoff.onedrive_upload") {
    return "customerApp.companionExperience.attachments.microsoft365Handoff.expectedUpload";
  }
  return "customerApp.companionExperience.attachments.microsoft365Handoff.expectedUnsupported";
}

export function createMicrosoft365ArtifactHandoffAdapter(
  applicationKey: Microsoft365ApplicationKey,
): ExternalArtifactHandoffAdapter {
  return {
    provider_key: applicationKey,
    readiness: MICROSOFT365_HANDOFF_READINESS,
    capabilities: MICROSOFT365_HANDOFF_CAPABILITIES,
    buildPreview(input) {
      const action = resolveMicrosoft365HandoffAction(applicationKey, input.mime_type);
      const readiness =
        !action
          ? "partial"
          : input.connection_connected
            ? "adapter_available"
            : "partial";

      return {
        provider_key: applicationKey,
        attachment_id: input.attachment_id,
        conversation_id: input.conversation_id,
        filename: input.filename,
        mime_type: input.mime_type,
        category: input.category,
        byte_size: input.byte_size,
        handoff_action: action ?? "unsupported",
        recipient_label_key:
          "customerApp.companionExperience.attachments.microsoft365Handoff.recipient",
        access_scope_label_key:
          "customerApp.companionExperience.attachments.microsoft365Handoff.accessScope",
        expected_action_label_key: previewLabelKeyForAction(action),
        adapter_readiness: readiness,
        requires_explicit_consent: true,
      };
    },
    async execute(input) {
      if (!input.consent_granted) {
        return buildFailure(input, "consent_required", "consent_required");
      }

      if (!input.access_token) {
        return buildFailure(input, "connection_missing", "microsoft365_not_connected");
      }

      const action = resolveMicrosoft365HandoffAction(applicationKey, input.mime_type);
      if (!action) {
        return buildFailure(input, "unsupported_artifact", "mime_not_supported_by_microsoft365");
      }

      const upload = await uploadMicrosoft365DriveContent({
        access_token: input.access_token,
        filename: input.filename,
        mime_type: input.mime_type,
        file_bytes: input.file_bytes,
        folder: "Aipify Companion",
      });

      if (!upload.ok || !upload.item_id || !upload.web_url) {
        return {
          ok: false,
          status: "failed",
          provider_key: input.provider_key,
          attachment_id: input.attachment_id,
          external_reference: upload.item_id,
          open_url: null,
          failure_code: upload.failure_code ?? "microsoft365_upload_failed",
          audited: false,
        };
      }

      return {
        ok: true,
        status: "success",
        provider_key: input.provider_key,
        attachment_id: input.attachment_id,
        external_reference: upload.item_id,
        open_url: upload.web_url,
        failure_code: null,
        audited: false,
      };
    },
  };
}

export const microsoftWordArtifactHandoffAdapter =
  createMicrosoft365ArtifactHandoffAdapter("microsoft_word");
export const microsoftExcelArtifactHandoffAdapter =
  createMicrosoft365ArtifactHandoffAdapter("microsoft_excel");
export const microsoftPowerpointArtifactHandoffAdapter =
  createMicrosoft365ArtifactHandoffAdapter("microsoft_powerpoint");
