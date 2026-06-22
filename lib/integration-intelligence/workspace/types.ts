export type WorkspaceProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type WorkspaceCapabilityOperation = "read" | "write";

export type WorkspaceCapabilityKey =
  | "email.read"
  | "email.draft"
  | "email.send"
  | "calendar.read"
  | "calendar.event.create"
  | "calendar.event.update"
  | "task.read"
  | "task.create"
  | "contact.read"
  | "document.read"
  | "document.create"
  | "file.search"
  | "file.export"
  | "notification.read"
  | "notification.send"
  | "print.execute";

export type WorkspaceCapabilityManifest = {
  capability_key: WorkspaceCapabilityKey;
  operation: WorkspaceCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type WorkspaceProviderSourceEngine =
  | "calendar_scheduling"
  | "context_engine"
  | "task_management"
  | "business_dna"
  | "document_knowledge"
  | "universal_search"
  | "notification_orchestration"
  | "print_output";

export type WorkspaceProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: WorkspaceProviderSourceEngine;
  implementation_status: WorkspaceProviderImplementationStatus;
  capabilities: readonly WorkspaceCapabilityManifest[];
  search_terms_key: string;
};

export function buildWorkspaceCapabilityId(
  providerKey: string,
  capabilityKey: WorkspaceCapabilityKey,
  operation: WorkspaceCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}
