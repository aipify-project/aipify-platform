import {
  getServicesProviderManifest,
  listServicesProviderManifests,
} from "@/lib/integration-intelligence/services/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionServicesContext } from "./companion-services-context";
import { filterServicesCapabilitiesForPrivacy } from "./companion-services-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type ServicesProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeServicesQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasServicesProviderIntent(query: string): boolean {
  const normalized = normalizeServicesQuery(query);
  return /\b(service|services|booking|bookings|appointment|appointments|availability|schedule|scheduling|work order|work-order|field service|field operations|resource|resources|assignment|assignments|vacation mode|absence|coverage|waiting list|slot|buffer|duration|timezone|location|service network|service intake|execution operations)\b/i.test(
    normalized,
  );
}

export function hasBlockedServicesOperationIntent(query: string): boolean {
  const normalized = normalizeServicesQuery(query);
  return /\b(cancel appointment|delete appointment|cancel booking|delete booking|cancel work order|delete work order|process payment|issue refund|refund booking|no.?show charge|irreversible)\b/i.test(
    normalized,
  );
}

export function hasExternalServicesAdapterIntent(query: string): boolean {
  const normalized = normalizeServicesQuery(query);
  return /\b(external booking adapter|third.?party calendar sync|live field service api|external work order system)\b/i.test(
    normalized,
  );
}

export function matchServicesProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): ServicesProviderMatch | null {
  if (!hasServicesProviderIntent(query)) return null;

  const normalized = normalizeServicesQuery(query);
  const manifests = listServicesProviderManifests();

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
    if (normalized.includes("appointment") || normalized.includes("booking")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("appointment."),
      );
    }
    if (normalized.includes("availability") || normalized.includes("slot")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("service.availability"),
      );
    }
    if (normalized.includes("work order") || normalized.includes("field")) {
      return manifest.provider_key === "execution_operations";
    }
    if (normalized.includes("vacation") || normalized.includes("absence")) {
      return manifest.provider_key === "absence_vacation_coverage";
    }
    if (normalized.includes("schedule") || normalized.includes("shift")) {
      return manifest.provider_key === "workforce_scheduling";
    }
    if (normalized.includes("service") && !normalized.includes("network")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("service."),
      );
    }
    if (normalized.includes("resource")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("resource."),
      );
    }
    if (normalized.includes("location")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("location."),
      );
    }
    if (normalized.includes("assignment") || normalized.includes("assign")) {
      return manifest.capabilities.some((capability) =>
        capability.capability_key.startsWith("assignment.") ||
        capability.capability_key.startsWith("work_order.assign"),
      );
    }
    if (normalized.includes("network")) {
      return manifest.provider_key === "service_network";
    }
    if (normalized.includes("intake")) {
      return manifest.provider_key === "service_intake";
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

  const writeIntent = /\b(create|book|schedule|assign|update|add)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|availability)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.servicesContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveServicesCrossLink(
  match: ServicesProviderMatch,
  servicesContext: CompanionServicesContext,
): string {
  if (match.provider_key === "workforce_scheduling") {
    return servicesContext.cross_link_scheduling;
  }
  if (match.provider_key === "absence_vacation_coverage") {
    return servicesContext.cross_link_absence;
  }
  if (match.provider_key === "execution_operations") {
    return servicesContext.cross_link_execution;
  }
  if (match.provider_key === "service_network") {
    return servicesContext.cross_link_service_network;
  }
  return servicesContext.cross_link_appointments;
}

export function buildServicesProviderDiscoveryAnswer(
  match: ServicesProviderMatch,
  servicesContext: CompanionServicesContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getServicesProviderManifest(match.provider_key);
  const providerStatus = servicesContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.services.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.services.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterServicesCapabilitiesForPrivacy(servicesContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.services.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.services.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const bookingPolicyLines = [
    servicesContext.prevent_double_booking
      ? t("customerApp.companionPlatformKnowledge.services.doubleBookingPrevented")
      : t("customerApp.companionPlatformKnowledge.services.doubleBookingReviewRequired"),
    servicesContext.vacation_mode_integration_enabled
      ? t("customerApp.companionPlatformKnowledge.services.vacationModeActive")
      : t("customerApp.companionPlatformKnowledge.services.vacationModeAvailable"),
  ].join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.services.discoveryExplanation"),
    capabilityLines,
    bookingPolicyLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.services.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.services.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.services.privacyNote"),
    t("customerApp.companionPlatformKnowledge.services.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.services.openServicesCenter",
        label: t("customerApp.companionPlatformKnowledge.services.openServicesCenter"),
        href: resolveServicesCrossLink(match, servicesContext),
        routeKey: "servicesCenter",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.services.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildServicesProviderUnavailableAnswer(
  t: Translator,
  servicesContext: CompanionServicesContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.services.unavailableLead"),
    explanation: servicesContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.services.permissionDenied")
      : servicesContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.services.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.services.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "services-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.services.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "services-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedServicesOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.services.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.services.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "services-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.services.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "services-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalServicesUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.services.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.services.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "services-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.services.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "services-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
