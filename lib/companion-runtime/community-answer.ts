import {
  getCommunityProviderManifest,
  listCommunityProviderManifests,
} from "@/lib/integration-intelligence/community/registry";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { CompanionConversationSemanticContext } from "@/lib/integration-intelligence/semantic/types";
import type { Translator } from "@/lib/i18n/translate";
import {
  collectSemanticDescriptorsFromManifest,
  resolveCompanionSemanticIntent,
  semanticDescriptorMatchesQuery,
} from "./companion-semantic-query-match";
import {
  resolveCompanionSemanticQuery,
  resolvedIntentToProviderMatch,
} from "./companion-semantic-resolver";
import type { CompanionCommunityContext } from "./companion-community-context";
import { filterCommunityCapabilitiesForPrivacy } from "./companion-community-context";
import { isOrganizationConnectionStatusQuery } from "@/lib/companion-platform-knowledge/organization-connection-status-intent";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type CommunityProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
  requested_metric?: string | null;
  requested_period?: string | null;
  resolved_intent_id?: string | null;
  outcome?: import("@/lib/integration-intelligence/semantic/types").CompanionSemanticOutcomeType | null;
};

const GENERIC_COMMUNITY_DOMAIN_PATTERN =
  /\b(community|membership|member|members|engagement|reward|points|leaderboard|referral|birthday|gift|moderation|moderate|listing|marketplace|activity|report|verification|since last)\b/i;

export function hasCommunityProviderIntent(query: string): boolean {
  if (isOrganizationConnectionStatusQuery(query)) return false;

  const normalized = normalizeIntegrationQuery(query);
  if (GENERIC_COMMUNITY_DOMAIN_PATTERN.test(normalized)) return true;

  for (const manifest of listCommunityProviderManifests()) {
    const descriptors = collectSemanticDescriptorsFromManifest(manifest);
    if (semanticDescriptorMatchesQuery(query, descriptors)) return true;
  }

  return false;
}

export function hasBlockedCommunityOperationIntent(query: string): boolean {
  const normalized = normalizeIntegrationQuery(query);
  return /\b(delete member|delete user|permanent ban|auto approve verification|irreversible points|financial transaction|publish without policy|permanent exclusion)\b/i.test(
    normalized,
  );
}

export function hasExternalCommunityAdapterIntent(
  query: string,
  communityContext?: CompanionCommunityContext,
): boolean {
  const normalized = normalizeIntegrationQuery(query);
  const explicit = /\b(external community adapter|live forum sync|third.?party membership platform|external engagement adapter)\b/i.test(
    normalized,
  );
  if (explicit) return true;
  if (!communityContext?.external_provider_adapters?.length) return false;
  return /\b(provider adapter|community adapter|live community|external adapter)\b/i.test(normalized);
}

function preferredCommunityProviderKeys(communityContext: CompanionCommunityContext): string[] {
  const adapterKeys =
    communityContext.external_provider_adapters
      ?.filter((entry) => entry.activation.status === "active" || entry.activation.status === "activating")
      .map((entry) => entry.provider_key) ?? [];
  const providerKeys = communityContext.providers.map((provider) => provider.provider_key);
  return [...new Set([...adapterKeys, ...providerKeys])];
}

function manifestsForTenant(
  tenantContext: CompanionTenantContext,
  manifests: ReturnType<typeof listCommunityProviderManifests>,
) {
  const preferred = preferredCommunityProviderKeys(tenantContext.communityContext);
  if (preferred.length > 0) {
    return manifests.filter((manifest) => preferred.includes(manifest.provider_key));
  }

  const activeBusinessPacks = tenantContext.activeBusinessPacks ?? [];
  const connectedProviders = tenantContext.connectedProviders ?? [];
  if (activeBusinessPacks.length === 0 && connectedProviders.length === 0) {
    return [];
  }

  return manifests.filter(
    (manifest) =>
      manifest.business_pack_key == null ||
      activeBusinessPacks.includes(manifest.business_pack_key),
  );
}

export function matchCommunityProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
  locale: CustomerActiveLocale = "en",
  conversation?: CompanionConversationSemanticContext | null,
): CommunityProviderMatch | null {
  if (!hasCommunityProviderIntent(query)) return null;

  const manifests = manifestsForTenant(tenantContext, listCommunityProviderManifests());
  if (manifests.length === 0) {
    return null;
  }

  const resolved = resolveCompanionSemanticQuery({
    query,
    locale,
    manifests,
    conversation,
    preferredProviderKeys: preferredCommunityProviderKeys(tenantContext.communityContext),
  });

  const semanticMatch = resolvedIntentToProviderMatch(resolved);
  if (semanticMatch) {
    return {
      ...semanticMatch,
      resolved_intent_id: resolved.intent_id,
      outcome: resolved.outcome,
    };
  }

  if (
    resolved.outcome === "intent_ambiguous" ||
    resolved.outcome === "intent_unresolved" ||
    resolved.outcome === "intent_resolved_provider_missing"
  ) {
    return null;
  }

  return null;
}

function resolveCommunityCrossLink(
  match: CommunityProviderMatch,
  communityContext: CompanionCommunityContext,
): string {
  if (match.provider_key === "moderation_engine") {
    return communityContext.cross_link_moderation;
  }
  if (match.provider_key === "client_relationship_loyalty") {
    return communityContext.cross_link_loyalty;
  }
  if (match.provider_key === "community_network_center") {
    return communityContext.cross_link_community;
  }
  return communityContext.cross_link_community;
}

export function buildCommunityProviderDiscoveryAnswer(
  match: CommunityProviderMatch,
  communityContext: CompanionCommunityContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getCommunityProviderManifest(match.provider_key);
  const providerStatus = communityContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.community.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.community.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterCommunityCapabilitiesForPrivacy(communityContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.community.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.community.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const governanceLines = [
    communityContext.member_deletion_blocked
      ? t("customerApp.companionPlatformKnowledge.community.memberDeletionBlocked")
      : null,
    communityContext.permanent_ban_blocked
      ? t("customerApp.companionPlatformKnowledge.community.permanentBanBlocked")
      : null,
    communityContext.verification_auto_approve_blocked
      ? t("customerApp.companionPlatformKnowledge.community.verificationAutoApproveBlocked")
      : null,
    communityContext.irreversible_points_blocked
      ? t("customerApp.companionPlatformKnowledge.community.irreversiblePointsBlocked")
      : null,
    communityContext.private_profile_data_filtered
      ? t("customerApp.companionPlatformKnowledge.community.privateProfileDataFiltered")
      : null,
    communityContext.birthday_data_limited
      ? t("customerApp.companionPlatformKnowledge.community.birthdayDataLimited")
      : null,
    communityContext.moderation_data_permission_gated
      ? t("customerApp.companionPlatformKnowledge.community.moderationDataPermissionGated")
      : null,
    communityContext.role_based_access_active
      ? t("customerApp.companionPlatformKnowledge.community.roleBasedAccessActive")
      : null,
    communityContext.command_brief_events_linked
      ? t("customerApp.companionPlatformKnowledge.community.commandBriefEventsLinked")
      : t("customerApp.companionPlatformKnowledge.community.commandBriefEventsAvailable"),
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.community.discoveryExplanation"),
    capabilityLines,
    governanceLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.community.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.community.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.community.privacyNote"),
    t("customerApp.companionPlatformKnowledge.community.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.community.openCommunityCenter",
        label: t("customerApp.companionPlatformKnowledge.community.openCommunityCenter"),
        href: resolveCommunityCrossLink(match, communityContext),
        routeKey: "appCommunity",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.community.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildCommunityProviderUnavailableAnswer(
  t: Translator,
  communityContext: CompanionCommunityContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.community.unavailableLead"),
    explanation: communityContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.community.permissionDenied")
      : communityContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.community.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.community.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "community-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.community.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "community-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedCommunityOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.community.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.community.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "community-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.community.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "community-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalCommunityUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.community.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.community.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "community-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.community.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "community-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
