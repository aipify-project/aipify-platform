import {
  getIndustryPackProviderManifest,
  listIndustryPackProviderManifests,
} from "@/lib/integration-intelligence/industry-packs/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionIndustryPackContext } from "./companion-industry-pack-context";
import { filterIndustryPackCapabilitiesForPrivacy } from "./companion-industry-pack-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type IndustryPackProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeIndustryPackQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasIndustryPackProviderIntent(query: string): boolean {
  const normalized = normalizeIndustryPackQuery(query);
  return /\b(industry pack|business pack|treatment|staff|availability|appointment|booking|reminder|follow.?up|rebook|buffer|duration|vacation mode|inventory|product|local service)\b/i.test(
    normalized,
  );
}

export function hasBlockedIndustryPackOperationIntent(query: string): boolean {
  const normalized = normalizeIndustryPackQuery(query);
  return /\b(cancel appointment|delete appointment|process payment|issue refund|irreversible|no.?show charge)\b/i.test(
    normalized,
  );
}

export function hasExternalIndustryPackAdapterIntent(query: string): boolean {
  const normalized = normalizeIndustryPackQuery(query);
  return /\b(external booking adapter|third.?party scheduling api|live industry adapter)\b/i.test(
    normalized,
  );
}

export function matchIndustryPackProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): IndustryPackProviderMatch | null {
  if (!hasIndustryPackProviderIntent(query)) return null;

  const normalized = normalizeIndustryPackQuery(query);
  const manifests = listIndustryPackProviderManifests();

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
    if (normalized.includes("treatment") || normalized.includes("service menu")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "treatment.read",
      );
    }
    if (normalized.includes("staff") || normalized.includes("stylist") || normalized.includes("therapist")) {
      return manifest.capabilities.some((capability) => capability.capability_key === "staff.read");
    }
    if (normalized.includes("availability") || normalized.includes("slot")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "availability.read",
      );
    }
    if (normalized.includes("appointment") || normalized.includes("booking")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("appointment."),
      );
    }
    if (normalized.includes("reminder") || normalized.includes("follow")) {
      return manifest.capabilities.some(
        (capability) =>
          capability.capability_key === "reminder.create" ||
          capability.capability_key === "follow_up.create",
      );
    }
    if (normalized.includes("product") || normalized.includes("inventory") || normalized.includes("stock")) {
      return manifest.capabilities.some(
        (capability) =>
          capability.capability_key === "product.read" ||
          capability.capability_key === "inventory.read",
      );
    }
    if (normalized.includes("vacation") || normalized.includes("absence")) {
      return manifest.provider_key === "local_service_beauty";
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

  const writeIntent = /\b(create|book|schedule|update|remind|follow)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|availability)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.industryPackContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveIndustryPackCrossLink(
  match: IndustryPackProviderMatch,
  industryPackContext: CompanionIndustryPackContext,
): string {
  if (match.provider_key === "service_scheduling_staff") {
    return industryPackContext.cross_link_scheduling;
  }
  if (match.provider_key === "service_retail_inventory") {
    return industryPackContext.cross_link_inventory;
  }
  if (match.provider_key === "client_engagement_follow_up") {
    return industryPackContext.cross_link_follow_up;
  }
  if (
    industryPackContext.vacation_mode_integration_enabled &&
    match.provider_key === "local_service_beauty"
  ) {
    return industryPackContext.cross_link_absence;
  }
  return industryPackContext.cross_link_appointments;
}

export function buildIndustryPackProviderDiscoveryAnswer(
  match: IndustryPackProviderMatch,
  industryPackContext: CompanionIndustryPackContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getIndustryPackProviderManifest(match.provider_key);
  const providerStatus = industryPackContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.industryPack.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.industryPack.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterIndustryPackCapabilitiesForPrivacy(industryPackContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.industryPack.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.industryPack.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const bookingPolicyLines = [
    industryPackContext.prevent_double_booking
      ? t("customerApp.companionPlatformKnowledge.industryPack.doubleBookingPrevented")
      : t("customerApp.companionPlatformKnowledge.industryPack.doubleBookingReviewRequired"),
    industryPackContext.vacation_mode_integration_enabled
      ? t("customerApp.companionPlatformKnowledge.industryPack.vacationModeActive")
      : t("customerApp.companionPlatformKnowledge.industryPack.vacationModeAvailable"),
    industryPackContext.post_vacation_buffer_days !== null
      ? t("customerApp.companionPlatformKnowledge.industryPack.postVacationBufferActive")
      : t("customerApp.companionPlatformKnowledge.industryPack.postVacationBufferAvailable"),
  ].join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.industryPack.discoveryExplanation"),
    capabilityLines,
    bookingPolicyLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.industryPack.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.industryPack.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.industryPack.privacyNote"),
    t("customerApp.companionPlatformKnowledge.industryPack.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.industryPack.openIndustryCenter",
        label: t("customerApp.companionPlatformKnowledge.industryPack.openIndustryCenter"),
        href: resolveIndustryPackCrossLink(match, industryPackContext),
        routeKey: "industryPackCenter",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.industryPack.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildIndustryPackProviderUnavailableAnswer(
  t: Translator,
  industryPackContext: CompanionIndustryPackContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.industryPack.unavailableLead"),
    explanation: industryPackContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.industryPack.permissionDenied")
      : industryPackContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.industryPack.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.industryPack.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "industry-pack-unavailable",
        label: t("customerApp.companionPlatformKnowledge.industryPack.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "industry-pack-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedIndustryPackOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.industryPack.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.industryPack.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "industry-pack-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.industryPack.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "industry-pack-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalIndustryPackUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.industryPack.externalUnavailableLead"),
    explanation: t(
      "customerApp.companionPlatformKnowledge.industryPack.externalUnavailableExplanation",
    ),
    steps: [],
    actions: [],
    sources: [
      {
        id: "industry-pack-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.industryPack.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "industry-pack-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
