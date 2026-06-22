import type {
  CommunityProviderImplementationStatus,
  CommunityProviderManifest,
} from "@/lib/integration-intelligence/community/types";
import type { CommunityExternalProviderAdapterOverlay } from "@/lib/integration-intelligence/community/provider-adapter-types";
import {
  buildCommunityCapabilityId,
  isCommunityCapabilityBlocked,
} from "@/lib/integration-intelligence/community/types";

export type CommunityProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: CommunityProviderImplementationStatus;
  community_network_center_enabled: boolean;
  moderation_engine_enabled: boolean;
  client_relationship_loyalty_enabled: boolean;
  community_collective_intelligence_enabled: boolean;
  community_engagement_services_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type CommunityCapabilityRuntimeRef = {
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
  runtime_status: CommunityProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type CommunityCommandBriefSignal = {
  signal_key: string;
  count: number | null;
};

export type CompanionCommunityContext = {
  community_network_center_enabled: boolean;
  moderation_engine_enabled: boolean;
  client_relationship_loyalty_enabled: boolean;
  community_collective_intelligence_enabled: boolean;
  member_deletion_blocked: boolean;
  permanent_ban_blocked: boolean;
  verification_auto_approve_blocked: boolean;
  irreversible_points_blocked: boolean;
  financial_transaction_blocked: boolean;
  moderation_without_policy_blocked: boolean;
  role_based_access_active: boolean;
  private_profile_data_filtered: boolean;
  birthday_data_limited: boolean;
  moderation_data_permission_gated: boolean;
  least_privilege_enforced: boolean;
  new_members_count: number | null;
  pending_moderation_count: number | null;
  pending_verification_count: number | null;
  reports_attention_count: number | null;
  listing_review_count: number | null;
  command_brief_signals: CommunityCommandBriefSignal[];
  command_brief_events_linked: boolean;
  external_provider_adapters?: CommunityExternalProviderAdapterOverlay[];
  providers: CommunityProviderRuntimeStatus[];
  capabilities: CommunityCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_community: string;
  cross_link_moderation: string;
  cross_link_loyalty: string;
  cross_link_memberships: string;
};

export function createEmptyCompanionCommunityContext(
  overrides?: Partial<CompanionCommunityContext>,
): CompanionCommunityContext {
  return {
    community_network_center_enabled: false,
    moderation_engine_enabled: false,
    client_relationship_loyalty_enabled: false,
    community_collective_intelligence_enabled: false,
    member_deletion_blocked: true,
    permanent_ban_blocked: true,
    verification_auto_approve_blocked: true,
    irreversible_points_blocked: true,
    financial_transaction_blocked: true,
    moderation_without_policy_blocked: true,
    role_based_access_active: true,
    private_profile_data_filtered: true,
    birthday_data_limited: true,
    moderation_data_permission_gated: true,
    least_privilege_enforced: true,
    new_members_count: null,
    pending_moderation_count: null,
    pending_verification_count: null,
    reports_attention_count: null,
    listing_review_count: null,
    command_brief_signals: [],
    command_brief_events_linked: false,
    external_provider_adapters: [],
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_community: "/app/community",
    cross_link_moderation: "/app/aipify-moderation",
    cross_link_loyalty: "/app/client-relationships/loyalty",
    cross_link_memberships: "/app/client-relationships/memberships",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: CommunityProviderManifest,
  providerStatus: CommunityProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "community_network_center":
      return providerStatus.community_network_center_enabled;
    case "moderation_engine":
      return providerStatus.moderation_engine_enabled;
    case "client_relationship_loyalty":
      return providerStatus.client_relationship_loyalty_enabled;
    case "community_collective_intelligence":
      return providerStatus.community_collective_intelligence_enabled;
    case "community_engagement_services":
      return false;
    case "community_pack_adapter":
      return false;
    default:
      return false;
  }
}

export function buildCommunityCapabilityRuntimeRef(input: {
  manifest: CommunityProviderManifest;
  providerStatus: CommunityProviderRuntimeStatus;
  capability: CommunityProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): CommunityCapabilityRuntimeRef | null {
  if (isCommunityCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildCommunityCapabilityId(
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

export function filterCommunityCapabilitiesForPrivacy(
  context: CompanionCommunityContext,
): CommunityCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledCommunityCapabilities(
  context: CompanionCommunityContext,
): CommunityCapabilityRuntimeRef[] {
  return filterCommunityCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findCommunityProviderStatus(
  context: CompanionCommunityContext,
  providerKey: string,
): CommunityProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
