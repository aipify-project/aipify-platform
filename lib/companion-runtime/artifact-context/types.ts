/** Generic Core artifact contracts — customer-neutral, provider-agnostic. */

export type CompanionArtifactCategory = "image" | "pdf" | "document" | "text" | "other";

export type CompanionArtifactSecurityStatus = "pending" | "approved" | "rejected";

export type CompanionArtifactProvenanceSource =
  | "user_upload"
  | "clipboard_paste"
  | "drag_drop"
  | "file_picker";

export type CompanionConversationAttachment = {
  attachment_id: string;
  conversation_id: string;
  original_filename: string;
  mime_type: string;
  category: CompanionArtifactCategory;
  byte_size: number;
  security_status: CompanionArtifactSecurityStatus;
  provenance_source: CompanionArtifactProvenanceSource;
  created_at: string;
  preview_available: boolean;
};

export type CompanionActiveArtifact = {
  attachment_id: string;
  conversation_id: string;
  label: string;
  category: CompanionArtifactCategory;
  mime_type: string;
  byte_size: number;
  selected_at: string;
};

export type CompanionArtifactReferenceKind =
  | "this_file"
  | "this_image"
  | "this_logo"
  | "this_document"
  | "latest_upload"
  | "explicit_id";

export type CompanionArtifactReference = {
  kind: CompanionArtifactReferenceKind;
  attachment_id: string | null;
  confidence: "high" | "moderate" | "low";
  matched_phrase: string | null;
};

export type CompanionArtifactContextPayload = {
  conversation_id: string;
  active_artifact: CompanionActiveArtifact | null;
  attachment_ids: readonly string[];
  references: readonly CompanionArtifactReference[];
};

export type CompanionExternalProviderHandoffStatus =
  | "consent_required"
  | "adapter_available"
  | "adapter_missing"
  | "permission_denied"
  | "blocked_by_policy";

export type CompanionExternalProviderHandoff = {
  provider_key: string;
  status: CompanionExternalProviderHandoffStatus;
  requires_explicit_consent: boolean;
  message_key: string;
};

export type CompanionAttachmentValidationResult =
  | { ok: true; category: CompanionArtifactCategory; mime_type: string }
  | { ok: false; code: string; message_key: string };
