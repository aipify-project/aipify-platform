/** Generic external application orchestration contracts — no provider-specific logic in Core. */

import type { CompanionArtifactCategory } from "../artifact-context/types";

export type ExternalApplicationAdapterType = "api_oauth" | "desktop_bridge" | "file_handoff";

export type ExternalApplicationWorkspace =
  | "graphic_design"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "pdf"
  | "audio_video"
  | "general";

export type ExternalApplicationOperation =
  | "discover"
  | "create"
  | "open"
  | "edit"
  | "export"
  | "save"
  | "handoff";

export type ExternalApplicationCapabilityStatus =
  | "connected"
  | "partial"
  | "adapter_missing"
  | "permission_required"
  | "unsupported";

/** Max certified readiness for external application adapters. */
export type ExternalApplicationReadiness =
  | "production_ready_candidate"
  | "partial"
  | "adapter_missing"
  | "specification_only";

export type ExternalApplicationCapabilityManifest = {
  operation: ExternalApplicationOperation;
  capability_key: string;
  adapter_registered: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  required_permission: string | null;
};

export type ExternalApplicationManifest = {
  application_key: string;
  display_name_key: string;
  adapter_type: ExternalApplicationAdapterType;
  workspaces: readonly ExternalApplicationWorkspace[];
  readiness: ExternalApplicationReadiness;
  capabilities: readonly ExternalApplicationCapabilityManifest[];
};

export type ExternalApplicationRuntimeEntry = {
  application_key: string;
  display_name_key: string;
  adapter_type: ExternalApplicationAdapterType;
  capability_status: ExternalApplicationCapabilityStatus;
  connection_connected: boolean;
  permission_granted: boolean;
  supported_operations: readonly ExternalApplicationOperation[];
  readiness: ExternalApplicationReadiness;
  workspaces: readonly ExternalApplicationWorkspace[];
};

export type ExternalApplicationDiscoveryResult = {
  workspace: ExternalApplicationWorkspace;
  operation: ExternalApplicationOperation;
  applications: readonly ExternalApplicationRuntimeEntry[];
  requires_selection: boolean;
};

export type ExternalApplicationActionPreview = {
  application_key: string;
  operation: ExternalApplicationOperation;
  artifact_id: string;
  conversation_id: string;
  filename: string;
  mime_type: string;
  category: CompanionArtifactCategory;
  byte_size: number;
  capability_status: ExternalApplicationCapabilityStatus;
  adapter_type: ExternalApplicationAdapterType;
  recipient_label_key: string;
  access_scope_label_key: string;
  expected_action_label_key: string;
  consequence_label_key: string;
  requires_explicit_consent: true;
};

export type ExternalApplicationActionResult = {
  ok: boolean;
  /** Must remain false unless a registered adapter returned a verified provider response. */
  reported_as_executed: boolean;
  capability_status: ExternalApplicationCapabilityStatus;
  application_key: string;
  operation: ExternalApplicationOperation;
  external_reference: string | null;
  open_url: string | null;
  edit_url: string | null;
  failure_code: string | null;
  audited: boolean;
};

export type ExternalApplicationTaskProgress = {
  task_id: string;
  application_key: string;
  status: "queued" | "in_progress" | "success" | "failed";
  progress_percent: number | null;
  external_reference: string | null;
  failure_code: string | null;
};

export type ExternalApplicationHandoffStatus =
  | "consent_required"
  | "adapter_available"
  | "adapter_missing"
  | "partial"
  | "permission_denied"
  | "blocked_by_policy"
  | "unsupported";

export type ExternalApplicationHandoffClassification = {
  application_key: string;
  status: ExternalApplicationHandoffStatus;
  requires_explicit_consent: boolean;
  message_key: string;
};

export type ExternalApplicationArtifactInput = {
  attachment_id: string;
  conversation_id: string;
  filename: string;
  mime_type: string;
  category: CompanionArtifactCategory;
  byte_size: number;
};
