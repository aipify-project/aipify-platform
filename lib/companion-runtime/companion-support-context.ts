import type { SupportProviderImplementationStatus } from "@/lib/integration-intelligence/support/types";
import type { SupportProviderManifest } from "@/lib/integration-intelligence/support/types";
import {
  buildSupportCapabilityId,
  isSupportCapabilityBlocked,
} from "@/lib/integration-intelligence/support/types";

export type SupportProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: SupportProviderImplementationStatus;
  support_ai_enabled: boolean;
  autonomous_support_enabled: boolean;
  self_support_enabled: boolean;
  app_portal_support_enabled: boolean;
  proactive_support_enabled: boolean;
  business_dna_knowledge_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type SupportCapabilityRuntimeRef = {
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
  runtime_status: SupportProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type CompanionSupportContext = {
  support_ai_enabled: boolean;
  autonomous_support_enabled: boolean;
  self_support_enabled: boolean;
  app_portal_support_enabled: boolean;
  proactive_support_enabled: boolean;
  business_dna_knowledge_enabled: boolean;
  human_oversight_required: boolean;
  draft_only_mode: boolean;
  auto_send_blocked: boolean;
  case_close_blocked: boolean;
  autonomy_level: number | null;
  proactive_support_flag: boolean;
  self_healing_enabled: boolean;
  knowledge_gap_detection_enabled: boolean;
  open_cases_count: number | null;
  pending_drafts_count: number | null;
  queue_summary: import("@/lib/integration-intelligence/support/types").SupportQueueSummary | null;
  case_summaries: readonly import("@/lib/integration-intelligence/support/types").SupportCaseSummary[];
  command_brief_signals: readonly { signal_key: string; count: number | null }[];
  command_brief_events_linked: boolean;
  support_source_exact: boolean;
  providers: SupportProviderRuntimeStatus[];
  capabilities: SupportCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_support_ai: string;
  cross_link_support_operations: string;
  cross_link_self_support: string;
  cross_link_app_portal: string;
  cross_link_proactive: string;
  cross_link_business_dna: string;
};

export function createEmptyCompanionSupportContext(
  overrides?: Partial<CompanionSupportContext>,
): CompanionSupportContext {
  return {
    support_ai_enabled: false,
    autonomous_support_enabled: false,
    self_support_enabled: false,
    app_portal_support_enabled: false,
    proactive_support_enabled: false,
    business_dna_knowledge_enabled: false,
    human_oversight_required: true,
    draft_only_mode: true,
    auto_send_blocked: true,
    case_close_blocked: true,
    autonomy_level: null,
    proactive_support_flag: false,
    self_healing_enabled: false,
    knowledge_gap_detection_enabled: false,
    open_cases_count: null,
    pending_drafts_count: null,
    queue_summary: null,
    case_summaries: [],
    command_brief_signals: [],
    command_brief_events_linked: false,
    support_source_exact: false,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_support_ai: "/app/support-ai-engine",
    cross_link_support_operations: "/app/settings/support-operations",
    cross_link_self_support: "/app/self-support-engine",
    cross_link_app_portal: "/app/support/requests",
    cross_link_proactive: "/app/proactive-organization-engine",
    cross_link_business_dna: "/app/settings/business-dna",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: SupportProviderManifest,
  providerStatus: SupportProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "support_ai_engine":
      return providerStatus.support_ai_enabled;
    case "autonomous_support_operations":
      return providerStatus.autonomous_support_enabled;
    case "self_support_engine":
      return providerStatus.self_support_enabled;
    case "app_portal_support":
      return providerStatus.app_portal_support_enabled;
    case "proactive_organization_support":
      return providerStatus.proactive_support_enabled;
    case "business_dna_knowledge":
      return providerStatus.business_dna_knowledge_enabled;
    case "support_adapter":
      return false;
    default:
      return false;
  }
}

export function buildSupportCapabilityRuntimeRef(input: {
  manifest: SupportProviderManifest;
  providerStatus: SupportProviderRuntimeStatus;
  capability: SupportProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): SupportCapabilityRuntimeRef | null {
  if (isSupportCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildSupportCapabilityId(
    input.manifest.provider_key,
    input.capability.capability_key,
    input.capability.operation,
  );

  const engineEnabled = engineEnabledForProvider(input.manifest, input.providerStatus);
  const packOk =
    !input.manifest.business_pack_key ||
    input.providerStatus.business_pack_active ||
    input.manifest.business_pack_key === null;

  const enabled =
    engineEnabled &&
    packOk &&
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

export function filterSupportCapabilitiesForPrivacy(
  context: CompanionSupportContext,
): SupportCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledSupportCapabilities(
  context: CompanionSupportContext,
): SupportCapabilityRuntimeRef[] {
  return filterSupportCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findSupportProviderStatus(
  context: CompanionSupportContext,
  providerKey: string,
): SupportProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
