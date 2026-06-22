import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { applyExternalCommunityProviderAdaptersAsync } from "@/lib/integration-intelligence/community/apply-external-provider-adapters";
import { listCommunityProviderManifests } from "@/lib/integration-intelligence/community/registry";
import type { CommunityProviderImplementationStatus } from "@/lib/integration-intelligence/community/types";
import { isCommunityBusinessPackActive } from "@/lib/integration-intelligence/community/types";
import {
  buildCommunityCapabilityRuntimeRef,
  createEmptyCompanionCommunityContext,
  type CommunityCommandBriefSignal,
  type CompanionCommunityContext,
  type CommunityProviderRuntimeStatus,
} from "./companion-community-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function rpcEnabled(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  if (record.found === false) return false;
  if (record.has_access === false) return false;
  if (record.has_customer === false) return false;
  if (record.has_organization === false) return false;
  return true;
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: CommunityProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): CommunityProviderRuntimeStatus {
  const verified = input.connectedProviders.includes(input.providerKey);

  let implementationStatus = input.manifestStatus;
  if (verified && input.manifestStatus === "implemented_disconnected") {
    implementationStatus = "connected";
  } else if (!verified && input.manifestStatus === "connected") {
    implementationStatus = "implemented_disconnected";
  }

  return {
    provider_key: input.providerKey,
    implementation_status: implementationStatus,
    community_network_center_enabled: input.engineEnabled,
    moderation_engine_enabled: input.engineEnabled,
    client_relationship_loyalty_enabled: input.engineEnabled,
    community_collective_intelligence_enabled: input.engineEnabled,
    community_engagement_services_enabled: false,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    communityNetwork: boolean;
    moderationEngine: boolean;
    clientRelationshipLoyalty: boolean;
    collectiveIntelligence: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "community_network_center":
      return flags.communityNetwork;
    case "moderation_engine":
      return flags.moderationEngine;
    case "client_relationship_loyalty":
      return flags.clientRelationshipLoyalty;
    case "community_collective_intelligence":
      return flags.collectiveIntelligence;
    case "community_engagement_services":
      return false;
    case "community_pack_adapter":
      return false;
    default:
      return false;
  }
}

function readCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function arrayLength(value: unknown): number | null {
  return Array.isArray(value) ? value.length : null;
}

function countModerationPending(items: unknown): number | null {
  if (!Array.isArray(items)) return null;
  return items.filter((item) => {
    if (!item || typeof item !== "object") return false;
    const row = item as Record<string, unknown>;
    return String(row.status ?? "") === "pending";
  }).length;
}

function countPendingModerationStatus(items: unknown): number | null {
  if (!Array.isArray(items)) return null;
  return items.filter((item) => {
    if (!item || typeof item !== "object") return false;
    const row = item as Record<string, unknown>;
    const status = String(row.moderation_status ?? row.status_key ?? "").toLowerCase();
    return status.includes("pending") || status.includes("review");
  }).length;
}

function extractCommunityOperationalSignals(input: {
  communityCenter: unknown;
  moderationDashboard: unknown;
  clientRelationshipCenter: unknown;
  collectiveIntelligenceAdmin: unknown;
}): {
  new_members_count: number | null;
  group_count: number | null;
  discussion_count: number | null;
  pending_moderation_count: number | null;
  pending_verification_count: number | null;
  reports_attention_count: number | null;
  listing_review_count: number | null;
  command_brief_signals: CommunityCommandBriefSignal[];
} {
  const community =
    input.communityCenter && typeof input.communityCenter === "object"
      ? (input.communityCenter as Record<string, unknown>)
      : {};
  const statistics =
    community.statistics && typeof community.statistics === "object"
      ? (community.statistics as Record<string, unknown>)
      : {};
  const moderation =
    input.moderationDashboard && typeof input.moderationDashboard === "object"
      ? (input.moderationDashboard as Record<string, unknown>)
      : {};
  const moderationMetrics =
    moderation.metrics && typeof moderation.metrics === "object"
      ? (moderation.metrics as Record<string, unknown>)
      : {};
  const crm =
    input.clientRelationshipCenter && typeof input.clientRelationshipCenter === "object"
      ? (input.clientRelationshipCenter as Record<string, unknown>)
      : {};

  const groupCount = readCount(statistics.group_count);
  const discussionCount = readCount(statistics.discussion_count);

  const pendingModeration =
    readCount(moderationMetrics.pending_review) ??
    countModerationPending(moderation.items) ??
    readCount(moderationMetrics.high_risk_pending);

  const pendingVerification = countPendingModerationStatus(community.best_practices);

  const reportsAttention =
    readCount(moderationMetrics.high_risk_pending) ??
    (Array.isArray(moderation.items)
      ? moderation.items.filter((item) => {
          if (!item || typeof item !== "object") return false;
          const row = item as Record<string, unknown>;
          return Boolean(row.is_reported) || Boolean(row.is_high_risk);
        }).length
      : null);

  const listingReview = countPendingModerationStatus(community.marketplace_prep);

  const rewardMilestones = readCount(crm.loyalty_accounts_count);

  const signals: CommunityCommandBriefSignal[] = [];
  if (discussionCount !== null && discussionCount > 0) {
    signals.push({ signal_key: "activity_change", count: discussionCount });
  }
  if (rewardMilestones !== null && rewardMilestones > 0) {
    signals.push({ signal_key: "reward_milestone", count: rewardMilestones });
  }
  if (pendingModeration !== null && pendingModeration > 0) {
    signals.push({ signal_key: "pending_moderation", count: pendingModeration });
  }
  if (pendingVerification !== null && pendingVerification > 0) {
    signals.push({ signal_key: "pending_verification", count: pendingVerification });
  }
  if (listingReview !== null && listingReview > 0) {
    signals.push({ signal_key: "listing_review", count: listingReview });
  }
  if (reportsAttention !== null && reportsAttention > 0) {
    signals.push({ signal_key: "reports_requiring_attention", count: reportsAttention });
  }

  return {
    new_members_count: null,
    group_count: groupCount,
    discussion_count: discussionCount,
    pending_moderation_count: pendingModeration,
    pending_verification_count: pendingVerification,
    reports_attention_count: reportsAttention,
    listing_review_count: listingReview,
    command_brief_signals: signals,
  };
}

export async function loadCompanionCommunityContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
    organizationId?: string | null;
  },
): Promise<CompanionCommunityContext> {
  const businessPackActive = isCommunityBusinessPackActive(input.activeBusinessPacks);

  const [
    communityCenterResult,
    moderationDashboardResult,
    clientRelationshipResult,
    collectiveIntelligenceResult,
  ] = await Promise.all([
    supabase.rpc("get_customer_community_network_center"),
    supabase.rpc("get_aipify_moderation_dashboard", { p_tab: "needs_review" }),
    supabase.rpc("get_organization_client_relationship_center", { p_section: "loyalty" }),
    supabase.rpc("get_community_intelligence_admin"),
  ]);

  const communityPermissionDenied =
    communityCenterResult.error && isPermissionDeniedMessage(communityCenterResult.error.message);

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (communityPermissionDenied) {
    return createEmptyCompanionCommunityContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const communityNetworkEnabled = rpcEnabled(communityCenterResult.data);
  const moderationEngineEnabled =
    rpcEnabled(moderationDashboardResult.data) ||
    (!moderationDashboardResult.error &&
      input.effectivePermissions.some((permission) => permission.startsWith("moderation.")));
  const clientRelationshipEnabled = rpcEnabled(clientRelationshipResult.data);
  const collectiveIntelligenceEnabled = rpcEnabled(collectiveIntelligenceResult.data);

  const operationalSignals = extractCommunityOperationalSignals({
    communityCenter: communityCenterResult.data,
    moderationDashboard: moderationDashboardResult.data,
    clientRelationshipCenter: clientRelationshipResult.data,
    collectiveIntelligenceAdmin: collectiveIntelligenceResult.data,
  });

  const engineFlags = {
    communityNetwork: communityNetworkEnabled,
    moderationEngine: moderationEngineEnabled && !moderationDashboardResult.error,
    clientRelationshipLoyalty: clientRelationshipEnabled,
    collectiveIntelligence: collectiveIntelligenceEnabled,
  };

  const anyEngineEnabled = Object.values(engineFlags).some(Boolean);

  const providers: CommunityProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listCommunityProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive: businessPackActive || anyEngineEnabled,
    });

    providerStatus.community_network_center_enabled =
      engineFlags.communityNetwork && manifest.source_engine === "community_network_center";
    providerStatus.moderation_engine_enabled =
      engineFlags.moderationEngine && manifest.source_engine === "moderation_engine";
    providerStatus.client_relationship_loyalty_enabled =
      engineFlags.clientRelationshipLoyalty && manifest.source_engine === "client_relationship_loyalty";
    providerStatus.community_collective_intelligence_enabled =
      engineFlags.collectiveIntelligence &&
      manifest.source_engine === "community_collective_intelligence";
    providerStatus.community_engagement_services_enabled = false;

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildCommunityCapabilityRuntimeRef({
        manifest,
        providerStatus,
        capability,
        hasPermission,
      });

      if (runtimeRef) {
        capabilities.push(runtimeRef);
      }
    }
  }

  const baseContext = createEmptyCompanionCommunityContext({
    community_network_center_enabled: communityNetworkEnabled,
    moderation_engine_enabled: engineFlags.moderationEngine,
    client_relationship_loyalty_enabled: clientRelationshipEnabled,
    community_collective_intelligence_enabled: collectiveIntelligenceEnabled,
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
    new_members_count: operationalSignals.new_members_count,
    group_count: operationalSignals.group_count,
    discussion_count: operationalSignals.discussion_count,
    pending_moderation_count: operationalSignals.pending_moderation_count,
    pending_verification_count: operationalSignals.pending_verification_count,
    reports_attention_count: operationalSignals.reports_attention_count,
    listing_review_count: operationalSignals.listing_review_count,
    command_brief_signals: operationalSignals.command_brief_signals,
    command_brief_events_linked:
      operationalSignals.command_brief_signals.length > 0 &&
      (businessPackActive || anyEngineEnabled),
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });

  return applyExternalCommunityProviderAdaptersAsync(supabase, baseContext, {
    organizationId: input.organizationId ?? null,
    subscriptionStatus: input.subscriptionStatus,
    connectedProviders: input.connectedProviders,
    activeBusinessPacks: input.activeBusinessPacks,
    effectivePermissions: input.effectivePermissions,
  });
}
