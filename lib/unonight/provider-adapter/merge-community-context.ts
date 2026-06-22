import type { CompanionCommunityContext } from "@/lib/companion-runtime/companion-community-context";
import type { CommunityExternalProviderAdapterOverlay } from "@/lib/integration-intelligence/community/provider-adapter-types";
import { registerCommunityProviderManifest } from "@/lib/integration-intelligence/community/registry";
import {
  buildCommunityCapabilityId,
  isCommunityCapabilityBlocked,
} from "@/lib/integration-intelligence/community/types";
import type { CommunityCapabilityRuntimeRef } from "@/lib/companion-runtime/companion-community-context";
import { evaluateUnonightProviderAdapterActivationGate } from "./activation-gate";
import { recordUnonightProviderAdapterAudit } from "./audit-log";
import {
  UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY,
  UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
} from "./constants";
import { UNONIGHT_COMMUNITY_ADAPTER_MANIFEST } from "./manifest";
import {
  buildUnonightCommandBriefSignals,
  normalizeUnonightProviderAdapterRecords,
} from "./normalize";

registerCommunityProviderManifest(UNONIGHT_COMMUNITY_ADAPTER_MANIFEST);

import type { UnonightMemberStatisticsSnapshot } from "./member-statistics";

export type ApplyUnonightProviderAdapterInput = {
  organizationId: string | null;
  subscriptionStatus: string | null;
  connectedProviders: readonly string[];
  activeBusinessPacks: readonly string[];
  effectivePermissions: readonly string[];
  authenticatedE2eVerifiedCapabilities?: readonly string[];
  memberStatistics?: UnonightMemberStatisticsSnapshot | null;
};

function mergeCommandBriefSignals(
  existing: CompanionCommunityContext["command_brief_signals"],
  adapterSignals: Array<{ signal_key: string; count: number | null }>,
): CompanionCommunityContext["command_brief_signals"] {
  const merged = new Map<string, number | null>();
  for (const signal of existing) {
    merged.set(signal.signal_key, signal.count);
  }
  for (const signal of adapterSignals) {
    if (!merged.has(signal.signal_key)) {
      merged.set(signal.signal_key, signal.count);
    }
  }
  return [...merged.entries()].map(([signal_key, count]) => ({ signal_key, count }));
}

function buildAdapterCapabilities(
  context: CompanionCommunityContext,
  overlay: CommunityExternalProviderAdapterOverlay,
  effectivePermissions: readonly string[],
): CommunityCapabilityRuntimeRef[] {
  const capabilities: CommunityCapabilityRuntimeRef[] = [];

  for (const capability of UNONIGHT_COMMUNITY_ADAPTER_MANIFEST.capabilities) {
    if (isCommunityCapabilityBlocked(capability.capability_key)) continue;

    const capabilityId = buildCommunityCapabilityId(
      UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
      capability.capability_key,
      capability.operation,
    );

    const readiness =
      overlay.capability_readiness.find((entry) => entry.capability_id === capabilityId) ?? null;

    const hasPermission =
      !capability.required_permission ||
      effectivePermissions.includes(capability.required_permission);

    const adapterReady =
      overlay.activation.status === "active" &&
      readiness !== null &&
      readiness.status !== "disabled" &&
      readiness.status !== "adapter_missing";

    const enabled =
      adapterReady &&
      hasPermission &&
      overlay.activation.status === "active" &&
      readiness?.status !== "disabled" &&
      (readiness?.status === "production_ready" ||
        readiness?.status === "production_ready_candidate" ||
        readiness?.status === "connected_but_partial");

    capabilities.push({
      capability_id: capabilityId,
      provider_key: UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
      capability_key: capability.capability_key,
      operation: capability.operation,
      entity: capability.entity,
      adapter_available: adapterReady,
      approval_required: capability.approval_required,
      reversible: capability.reversible,
      risk_level: capability.risk_level,
      required_permission: capability.required_permission,
      runtime_status:
        readiness?.status === "production_ready"
          ? "connected"
          : readiness?.status === "production_ready_candidate"
            ? "partial"
            : readiness?.status === "connected_but_partial"
              ? "partial"
              : overlay.activation.status === "activating"
                ? "partial"
                : "implemented_disconnected",
      privacy_sensitive: capability.privacy_sensitive,
      enabled,
    });
  }

  return capabilities;
}

export function applyUnonightProviderAdapterToCommunityContext(
  context: CompanionCommunityContext,
  input: ApplyUnonightProviderAdapterInput,
): CompanionCommunityContext {
  if (!input.connectedProviders.includes(UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY)) {
    return context;
  }

  const smokeTestPassed =
    !context.permission_denied &&
    (context.community_network_center_enabled || context.moderation_engine_enabled);

  const activation = evaluateUnonightProviderAdapterActivationGate({
    subscriptionStatus: input.subscriptionStatus,
    connectedProviders: input.connectedProviders,
    activeBusinessPacks: input.activeBusinessPacks,
    effectivePermissions: input.effectivePermissions,
    communityNetworkEnabled: context.community_network_center_enabled,
    moderationEngineEnabled: context.moderation_engine_enabled,
    permissionDenied: context.permission_denied,
    appEntitlementBlocked: context.app_entitlement_blocked,
    smokeTestPassed,
  });

  const fetchedAt = new Date().toISOString();
  const gateActive = activation.status === "active";

  const { records, capability_readiness } = normalizeUnonightProviderAdapterRecords({
    organizationId: input.organizationId,
    fetchedAt,
    counts: {
      group_count: context.group_count,
      discussion_count: context.discussion_count,
      pending_moderation_count: context.pending_moderation_count,
      pending_verification_count: context.pending_verification_count,
      reports_attention_count: context.reports_attention_count,
      listing_review_count: context.listing_review_count,
      member_statistics: input.memberStatistics ?? null,
    },
    effectivePermissions: input.effectivePermissions,
    gateActive,
    authenticatedE2eVerifiedCapabilities: input.authenticatedE2eVerifiedCapabilities,
  });

  const adapterSignals =
    gateActive && records.length > 0
      ? buildUnonightCommandBriefSignals({
          group_count: context.group_count,
          discussion_count: context.discussion_count,
          pending_moderation_count: context.pending_moderation_count,
          pending_verification_count: context.pending_verification_count,
          reports_attention_count: context.reports_attention_count,
          listing_review_count: context.listing_review_count,
          member_statistics: input.memberStatistics ?? null,
        })
      : [];

  const audit_reference = recordUnonightProviderAdapterAudit({
    adapter: "unonight_community_adapter",
    organization_id: input.organizationId,
    ok: activation.status === "active",
    activation_status: activation.status,
    capability_count: capability_readiness.length,
    record_count: records.length,
    fetched_at: fetchedAt,
    reason_key: activation.reason_key,
  });

  const overlay: CommunityExternalProviderAdapterOverlay = {
    provider_key: UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
    integration_provider_key: UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY,
    organization_id: input.organizationId,
    activation,
    records,
    capability_readiness,
    command_brief_signals: adapterSignals,
    audit_reference,
  };

  const adapterCapabilities = buildAdapterCapabilities(context, overlay, input.effectivePermissions);

  const providerStatus = {
    provider_key: UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
    implementation_status:
      activation.status === "active"
        ? ("connected" as const)
        : activation.status === "activating"
          ? ("partial" as const)
          : ("implemented_disconnected" as const),
    community_network_center_enabled: false,
    moderation_engine_enabled: false,
    client_relationship_loyalty_enabled: false,
    community_collective_intelligence_enabled: false,
    community_engagement_services_enabled: false,
    verified: input.connectedProviders.includes(UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY),
    adapter_available: activation.status === "active" && records.length > 0,
    entitlement_active: !context.app_entitlement_blocked,
    business_pack_active:
      input.activeBusinessPacks.includes("community_pack") ||
      context.community_network_center_enabled ||
      context.moderation_engine_enabled,
  };

  return {
    ...context,
    external_provider_adapters: [...(context.external_provider_adapters ?? []), overlay],
    providers: [...context.providers.filter((p) => p.provider_key !== UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY), providerStatus],
    capabilities: [
      ...context.capabilities.filter((cap) => cap.provider_key !== UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY),
      ...adapterCapabilities,
    ],
    command_brief_signals: mergeCommandBriefSignals(context.command_brief_signals, adapterSignals),
    command_brief_events_linked:
      context.command_brief_events_linked ||
      (adapterSignals.length > 0 && activation.status === "active"),
  };
}
