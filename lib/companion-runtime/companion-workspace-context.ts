import type { WorkspaceProviderImplementationStatus } from "@/lib/integration-intelligence/workspace/types";
import type { WorkspaceProviderManifest } from "@/lib/integration-intelligence/workspace/types";
import { buildWorkspaceCapabilityId } from "@/lib/integration-intelligence/workspace/types";

export type WorkspaceProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: WorkspaceProviderImplementationStatus;
  calendar_enabled: boolean;
  context_calendar_enabled: boolean;
  tasks_enabled: boolean;
  documents_enabled: boolean;
  search_enabled: boolean;
  notifications_enabled: boolean;
  print_enabled: boolean;
  support_email_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
};

export type WorkspaceCapabilityRuntimeRef = {
  capability_id: string;
  provider_key: string;
  capability_key: string;
  operation: "read" | "write";
  entity: string;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: number;
  required_permission: string | null;
  runtime_status: WorkspaceProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type CompanionWorkspaceContext = {
  calendar_enabled: boolean;
  context_calendar_enabled: boolean;
  tasks_enabled: boolean;
  documents_enabled: boolean;
  search_enabled: boolean;
  notifications_enabled: boolean;
  print_enabled: boolean;
  support_email_enabled: boolean;
  human_oversight_required: boolean;
  providers: WorkspaceProviderRuntimeStatus[];
  capabilities: WorkspaceCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_calendar: string;
  cross_link_tasks: string;
  cross_link_documents: string;
  cross_link_search: string;
  cross_link_support_email: string;
  cross_link_context: string;
};

export function createEmptyCompanionWorkspaceContext(
  overrides?: Partial<CompanionWorkspaceContext>,
): CompanionWorkspaceContext {
  return {
    calendar_enabled: false,
    context_calendar_enabled: false,
    tasks_enabled: false,
    documents_enabled: false,
    search_enabled: false,
    notifications_enabled: false,
    print_enabled: false,
    support_email_enabled: false,
    human_oversight_required: true,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_calendar: "/app/calendar",
    cross_link_tasks: "/app/tasks",
    cross_link_documents: "/app/documents",
    cross_link_search: "/app/universal-search",
    cross_link_support_email: "/app/settings/business-dna",
    cross_link_context: "/app/assistant/context",
    ...overrides,
  };
}

export function buildWorkspaceCapabilityRuntimeRef(input: {
  manifest: WorkspaceProviderManifest;
  providerStatus: WorkspaceProviderRuntimeStatus;
  capability: WorkspaceProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): WorkspaceCapabilityRuntimeRef {
  const capabilityId = buildWorkspaceCapabilityId(
    input.manifest.provider_key,
    input.capability.capability_key,
    input.capability.operation,
  );

  const enabled =
    input.providerStatus.entitlement_active &&
    input.hasPermission &&
    input.providerStatus.implementation_status !== "placeholder" &&
    (input.capability.operation === "read"
      ? true
      : input.capability.approval_required &&
        input.capability.reversible &&
        input.capability.risk_level <= 2);

  return {
    capability_id: capabilityId,
    provider_key: input.manifest.provider_key,
    capability_key: input.capability.capability_key,
    operation: input.capability.operation,
    entity: input.capability.entity,
    adapter_available: input.capability.adapter_available && input.providerStatus.adapter_available,
    approval_required: input.capability.approval_required,
    reversible: input.capability.reversible,
    risk_level: input.capability.risk_level,
    required_permission: input.capability.required_permission,
    runtime_status: input.providerStatus.implementation_status,
    privacy_sensitive: input.capability.privacy_sensitive,
    enabled: enabled && input.providerStatus.entitlement_active,
  };
}

export function filterWorkspaceCapabilitiesForPrivacy(
  context: CompanionWorkspaceContext,
): WorkspaceCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledWorkspaceCapabilities(
  context: CompanionWorkspaceContext,
): WorkspaceCapabilityRuntimeRef[] {
  return filterWorkspaceCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findWorkspaceProviderStatus(
  context: CompanionWorkspaceContext,
  providerKey: string,
): WorkspaceProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
