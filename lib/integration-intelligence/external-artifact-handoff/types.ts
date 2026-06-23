import type { CompanionArtifactCategory } from "@/lib/companion-runtime/artifact-context/types";

export type ExternalArtifactHandoffProviderReadiness =
  | "adapter_available"
  | "partial"
  | "adapter_missing";

export type ExternalArtifactHandoffExecutionStatus =
  | "success"
  | "failed"
  | "partial"
  | "consent_required"
  | "adapter_missing"
  | "permission_denied"
  | "connection_missing"
  | "unsupported_artifact";

export type ExternalArtifactHandoffPreview = {
  provider_key: string;
  attachment_id: string;
  conversation_id: string;
  filename: string;
  mime_type: string;
  category: CompanionArtifactCategory;
  byte_size: number;
  handoff_action: string;
  recipient_label_key: string;
  access_scope_label_key: string;
  expected_action_label_key: string;
  adapter_readiness: ExternalArtifactHandoffProviderReadiness;
  requires_explicit_consent: true;
};

export type ExternalArtifactHandoffResult = {
  ok: boolean;
  status: ExternalArtifactHandoffExecutionStatus;
  provider_key: string;
  attachment_id: string;
  external_reference: string | null;
  open_url: string | null;
  failure_code: string | null;
  audited: boolean;
};

export type ExternalArtifactHandoffExecuteInput = {
  provider_key: string;
  attachment_id: string;
  conversation_id: string;
  consent_granted: boolean;
  user_id: string;
  tenant_id: string;
  company_id: string;
};

export type ExternalArtifactHandoffAdapter = {
  provider_key: string;
  readiness: ExternalArtifactHandoffProviderReadiness;
  capabilities: readonly string[];
  buildPreview: (input: {
    attachment_id: string;
    conversation_id: string;
    filename: string;
    mime_type: string;
    category: CompanionArtifactCategory;
    byte_size: number;
    connection_connected: boolean;
  }) => ExternalArtifactHandoffPreview;
  execute: (input: ExternalArtifactHandoffExecuteInput & {
    filename: string;
    mime_type: string;
    file_bytes: Buffer;
    access_token: string | null;
  }) => Promise<ExternalArtifactHandoffResult>;
};
