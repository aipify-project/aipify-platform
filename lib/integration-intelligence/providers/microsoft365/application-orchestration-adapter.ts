import type {
  ExternalApplicationActionResult,
  ExternalApplicationOperation,
} from "@/lib/companion-runtime/external-application-orchestration";
import type { CompanionArtifactCategory } from "@/lib/companion-runtime/artifact-context/types";
import {
  defaultMicrosoft365CreateFilename,
  resolveMicrosoft365CreateCapability,
  resolveMicrosoft365OpenCapability,
  type Microsoft365ApplicationKey,
} from "./connect-capabilities-audit";
import {
  createMicrosoft365OfficeFile,
  openMicrosoft365DriveItem,
  uploadMicrosoft365DriveContent,
} from "./graph-client";

export type Microsoft365ActionPreview = {
  application_key: Microsoft365ApplicationKey;
  operation: ExternalApplicationOperation;
  artifact_id: string;
  conversation_id: string;
  filename: string;
  mime_type: string;
  category: CompanionArtifactCategory;
  byte_size: number;
  capability_status: "connected" | "partial" | "permission_required" | "unsupported";
  recipient_label_key: string;
  access_scope_label_key: string;
  expected_action_label_key: string;
  consequence_label_key: string;
  requires_explicit_consent: true;
  account_label: string | null;
  external_file_id: string | null;
};

export type Microsoft365ActionExecuteInput = {
  application_key: Microsoft365ApplicationKey;
  operation: ExternalApplicationOperation;
  consent_granted: boolean;
  access_token: string | null;
  filename?: string;
  mime_type?: string;
  file_bytes?: Buffer;
  external_file_id?: string | null;
  artifact_id?: string;
  conversation_id?: string;
};

function previewLabelKey(
  applicationKey: Microsoft365ApplicationKey,
  operation: ExternalApplicationOperation,
): string {
  if (operation === "create") {
    if (applicationKey === "microsoft_excel") {
      return "customerApp.companionExperience.attachments.microsoft365Handoff.expectedCreateSpreadsheet";
    }
    if (applicationKey === "microsoft_powerpoint") {
      return "customerApp.companionExperience.attachments.microsoft365Handoff.expectedCreatePresentation";
    }
    return "customerApp.companionExperience.attachments.microsoft365Handoff.expectedCreateDocument";
  }
  if (operation === "open" || operation === "edit") {
    return "customerApp.companionExperience.attachments.microsoft365Handoff.expectedOpen";
  }
  if (operation === "save" || operation === "export" || operation === "handoff") {
    return "customerApp.companionExperience.attachments.microsoft365Handoff.expectedSave";
  }
  return "customerApp.companionExperience.attachments.microsoft365Handoff.expectedUnsupported";
}

export function buildMicrosoft365ActionPreview(input: {
  application_key: Microsoft365ApplicationKey;
  operation: ExternalApplicationOperation;
  artifact_id: string;
  conversation_id: string;
  filename: string;
  mime_type: string;
  category: CompanionArtifactCategory;
  byte_size: number;
  connection_connected: boolean;
  permission_granted: boolean;
  account_label?: string | null;
  external_file_id?: string | null;
}): Microsoft365ActionPreview {
  const capabilityStatus = !input.permission_granted
    ? "permission_required"
    : input.connection_connected
      ? "connected"
      : "partial";

  return {
    application_key: input.application_key,
    operation: input.operation,
    artifact_id: input.artifact_id,
    conversation_id: input.conversation_id,
    filename: input.filename,
    mime_type: input.mime_type,
    category: input.category,
    byte_size: input.byte_size,
    capability_status: capabilityStatus,
    recipient_label_key:
      "customerApp.companionExperience.attachments.microsoft365Handoff.recipient",
    access_scope_label_key:
      "customerApp.companionExperience.attachments.microsoft365Handoff.accessScope",
    expected_action_label_key: previewLabelKey(input.application_key, input.operation),
    consequence_label_key:
      "customerApp.companionExperience.attachments.microsoft365Handoff.consequence",
    requires_explicit_consent: true,
    account_label: input.account_label ?? null,
    external_file_id: input.external_file_id ?? null,
  };
}

export async function executeMicrosoft365Action(
  input: Microsoft365ActionExecuteInput,
): Promise<ExternalApplicationActionResult> {
  const baseFailure = (
    failureCode: string,
    capabilityStatus: ExternalApplicationActionResult["capability_status"] = "partial",
  ): ExternalApplicationActionResult => ({
    ok: false,
    reported_as_executed: false,
    capability_status: capabilityStatus,
    application_key: input.application_key,
    operation: input.operation,
    external_reference: input.external_file_id ?? null,
    open_url: null,
    edit_url: null,
    failure_code: failureCode,
    audited: false,
  });

  if (!input.consent_granted) {
    return baseFailure("consent_required");
  }

  if (!input.access_token) {
    return baseFailure("microsoft365_not_connected");
  }

  if (input.operation === "create") {
    const result = await createMicrosoft365OfficeFile({
      access_token: input.access_token,
      application_key: input.application_key,
      filename: input.filename,
    });
    if (!result.ok || !result.item_id || !result.web_url) {
      return baseFailure(result.failure_code ?? "microsoft365_create_failed");
    }
    return {
      ok: true,
      reported_as_executed: true,
      capability_status: "connected",
      application_key: input.application_key,
      operation: input.operation,
      external_reference: result.item_id,
      open_url: result.web_url,
      edit_url: result.edit_url,
      failure_code: null,
      audited: false,
    };
  }

  if (input.operation === "open" || input.operation === "edit") {
    const itemId = input.external_file_id?.trim();
    if (!itemId) {
      return baseFailure("external_file_id_required", "unsupported");
    }
    const result = await openMicrosoft365DriveItem({
      access_token: input.access_token,
      item_id: itemId,
    });
    if (!result.ok || !result.item_id || !result.web_url) {
      return baseFailure(result.failure_code ?? "microsoft365_open_failed");
    }
    return {
      ok: true,
      reported_as_executed: true,
      capability_status: "connected",
      application_key: input.application_key,
      operation: input.operation,
      external_reference: result.item_id,
      open_url: result.web_url,
      edit_url: result.edit_url,
      failure_code: null,
      audited: false,
    };
  }

  if (input.operation === "save" || input.operation === "export" || input.operation === "handoff") {
    if (!input.file_bytes || !input.filename || !input.mime_type) {
      return baseFailure("artifact_payload_required", "unsupported");
    }
    const result = await uploadMicrosoft365DriveContent({
      access_token: input.access_token,
      filename: input.filename,
      mime_type: input.mime_type,
      file_bytes: input.file_bytes,
      folder: "Aipify Companion",
    });
    if (!result.ok || !result.item_id || !result.web_url) {
      return baseFailure(result.failure_code ?? "microsoft365_save_failed");
    }
    return {
      ok: true,
      reported_as_executed: true,
      capability_status: "connected",
      application_key: input.application_key,
      operation: input.operation,
      external_reference: result.item_id,
      open_url: result.web_url,
      edit_url: result.edit_url,
      failure_code: null,
      audited: false,
    };
  }

  return baseFailure("operation_unsupported", "unsupported");
}

export {
  resolveMicrosoft365CreateCapability,
  resolveMicrosoft365OpenCapability,
};
