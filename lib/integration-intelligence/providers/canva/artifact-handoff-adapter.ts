import type {
  ExternalArtifactHandoffAdapter,
  ExternalArtifactHandoffExecuteInput,
  ExternalArtifactHandoffResult,
} from "@/lib/integration-intelligence/external-artifact-handoff/types";
import {
  CANVA_ARTIFACT_HANDOFF_PROVIDER_KEY,
  CANVA_HANDOFF_CAPABILITIES,
  CANVA_HANDOFF_READINESS,
  resolveCanvaHandoffAction,
} from "./connect-capabilities-audit";
import {
  buildCanvaAssetLibraryUrl,
  buildCanvaDesignEditUrl,
  importCanvaDesign,
  uploadCanvaAsset,
} from "./connect-client";

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

export const canvaArtifactHandoffAdapter: ExternalArtifactHandoffAdapter = {
  provider_key: CANVA_ARTIFACT_HANDOFF_PROVIDER_KEY,
  readiness: CANVA_HANDOFF_READINESS,
  capabilities: CANVA_HANDOFF_CAPABILITIES,
  buildPreview(input) {
    const action = resolveCanvaHandoffAction(input.mime_type);
    const readiness =
      !action
        ? "partial"
        : input.connection_connected
          ? "adapter_available"
          : "partial";

    return {
      provider_key: CANVA_ARTIFACT_HANDOFF_PROVIDER_KEY,
      attachment_id: input.attachment_id,
      conversation_id: input.conversation_id,
      filename: input.filename,
      mime_type: input.mime_type,
      category: input.category,
      byte_size: input.byte_size,
      handoff_action: action ?? "unsupported",
      recipient_label_key: "customerApp.companionExperience.attachments.canvaHandoff.recipient",
      access_scope_label_key: "customerApp.companionExperience.attachments.canvaHandoff.accessScope",
      expected_action_label_key:
        action === "artifact.handoff.design_import"
          ? "customerApp.companionExperience.attachments.canvaHandoff.expectedImport"
          : action === "artifact.handoff.asset_upload"
            ? "customerApp.companionExperience.attachments.canvaHandoff.expectedUpload"
            : "customerApp.companionExperience.attachments.canvaHandoff.expectedUnsupported",
      adapter_readiness: readiness,
      requires_explicit_consent: true,
    };
  },
  async execute(input) {
    if (!input.consent_granted) {
      return buildFailure(input, "consent_required", "consent_required");
    }

    if (!input.access_token) {
      return buildFailure(input, "connection_missing", "canva_not_connected");
    }

    const action = resolveCanvaHandoffAction(input.mime_type);
    if (!action) {
      return buildFailure(input, "unsupported_artifact", "mime_not_supported_by_canva");
    }

    if (action === "artifact.handoff.asset_upload") {
      const job = await uploadCanvaAsset({
        access_token: input.access_token,
        filename: input.filename,
        mime_type: input.mime_type,
        file_bytes: input.file_bytes,
      });

      if (job.status !== "success" || !job.asset_id) {
        return {
          ok: false,
          status: "failed",
          provider_key: input.provider_key,
          attachment_id: input.attachment_id,
          external_reference: job.job_id || null,
          open_url: null,
          failure_code: job.error?.code ?? "canva_asset_upload_failed",
          audited: false,
        };
      }

      return {
        ok: true,
        status: "success",
        provider_key: input.provider_key,
        attachment_id: input.attachment_id,
        external_reference: job.asset_id,
        open_url: buildCanvaAssetLibraryUrl(job.asset_id),
        failure_code: null,
        audited: false,
      };
    }

    const importJob = await importCanvaDesign({
      access_token: input.access_token,
      title: input.filename,
      mime_type: input.mime_type,
      file_bytes: input.file_bytes,
    });

    if (importJob.status !== "success" || !importJob.designs?.[0]?.id) {
      return {
        ok: false,
        status: "failed",
        provider_key: input.provider_key,
        attachment_id: input.attachment_id,
        external_reference: importJob.job_id || null,
        open_url: null,
        failure_code: importJob.error?.code ?? "canva_design_import_failed",
        audited: false,
      };
    }

    const design = importJob.designs[0]!;
    const openUrl =
      design.urls?.edit_url ??
      design.urls?.view_url ??
      buildCanvaDesignEditUrl(design.id);

    return {
      ok: true,
      status: "success",
      provider_key: input.provider_key,
      attachment_id: input.attachment_id,
      external_reference: design.id,
      open_url: openUrl,
      failure_code: null,
      audited: false,
    };
  },
};
