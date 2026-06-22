import {
  getCommunityProviderManifest,
  listCommunityProviderManifests,
} from "@/lib/integration-intelligence/community/registry";
import { normalizeIntegrationQuery } from "@/lib/integration-intelligence/normalize-text";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import {
  collectSemanticDescriptorsFromManifest,
  resolveCompanionSemanticIntent,
  semanticDescriptorMatchesQuery,
} from "./companion-semantic-query-match";
import type { CompanionCommunityContext } from "./companion-community-context";
import { filterCommunityCapabilitiesForPrivacy } from "./companion-community-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type CommunityProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

const GENERIC_COMMUNITY_DOMAIN_PATTERN =
  /\b(community|membership|member|members|engagement|reward|points|leaderboard|referral|birthday|gift|moderation|moderate|listing|marketplace|activity|report|verification|since last)\b/i;

export function hasCommunityProviderIntent(query: string): boolean {
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

function resolveExternalAdapterProviderMatch(
  query: string,
  communityContext: CompanionCommunityContext,
  locale: CustomerActiveLocale = "en",
): CommunityProviderMatch | null {
  const overlay =
    communityContext.external_provider_adapters?.find(
      (entry) => entry.activation.status === "active" || entry.activation.status === "activating",
    ) ?? null;
  if (!overlay) return null;

  const manifest = getCommunityProviderManifest(overlay.provider_key);
  const descriptors = collectSemanticDescriptorsFromManifest(manifest);
  const intent = resolveCompanionSemanticIntent({ query, descriptors, locale });

  if (intent.capability_candidates[0]) {
    return {
      provider_key: overlay.provider_key,
      capability_key: intent.capability_candidates[0]!,
      operation: "read",
    };
  }

  return { provider_key: overlay.provider_key, capability_key: null, operation: "read" };
}

export function matchCommunityProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
  locale: CustomerActiveLocale = "en",
): CommunityProviderMatch | null {
  if (!hasCommunityProviderIntent(query)) return null;

  const normalized = normalizeIntegrationQuery(query);
  const manifests = listCommunityProviderManifests();

  const adapterMatch = resolveExternalAdapterProviderMatch(
    query,
    tenantContext.communityContext,
    locale,
  );
  if (adapterMatch) {
    return adapterMatch;
  }

  const mentionedProviders = manifests.filter((manifest) => {
    const provider = manifest.provider_key.toLowerCase();
    const providerSpaced = provider.replace(/_/g, " ");
    return normalized.includes(providerSpaced) || normalized.includes(provider);
  });

  if (mentionedProviders.length > 0) {
    for (const manifest of mentionedProviders) {
      for (const capability of manifest.capabilities) {
        const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
        if (normalized.includes(capabilityPhrase)) {
          return {
            provider_key: manifest.provider_key,
            capability_key: capability.capability_key,
            operation: capability.operation,
          };
        }
      }
    }

    return {
      provider_key: mentionedProviders[0]!.provider_key,
      capability_key: null,
      operation: null,
    };
  }

  for (const manifest of manifests) {
    for (const capability of manifest.capabilities) {
      const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
      if (normalized.includes(capabilityPhrase)) {
        return {
          provider_key: manifest.provider_key,
          capability_key: capability.capability_key,
          operation: capability.operation,
        };
      }
    }
  }

  const keywordMatch = manifests.find((manifest) => {
    if (normalized.includes("moderation") || normalized.includes("moderate")) {
      return manifest.provider_key === "moderation_engine";
    }
    if (normalized.includes("reward") || normalized.includes("points") || normalized.includes("loyalty")) {
      return manifest.provider_key === "client_relationship_loyalty";
    }
    if (normalized.includes("referral")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "referral.read",
      );
    }
    if (normalized.includes("leaderboard")) {
      return manifest.provider_key === "community_engagement_services";
    }
    if (normalized.includes("birthday")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "birthday.read",
      );
    }
    if (normalized.includes("gift")) {
      return manifest.capabilities.some((capability) => capability.capability_key === "gift.read");
    }
    if (normalized.includes("listing") || normalized.includes("marketplace")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "listing.read",
      );
    }
    if (normalized.includes("report")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "report.read",
      );
    }
    if (normalized.includes("member") || normalized.includes("membership")) {
      return manifest.provider_key === "community_network_center";
    }
    if (normalized.includes("activity") || normalized.includes("engagement")) {
      return (
        manifest.provider_key === "community_network_center" ||
        manifest.provider_key === "community_collective_intelligence"
      );
    }
    return false;
  });

  if (keywordMatch) {
    return {
      provider_key: keywordMatch.provider_key,
      capability_key: null,
      operation: null,
    };
  }

  const writeIntent = /\b(create|request|start|initiate|review)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|summary|who)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.communityContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
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
