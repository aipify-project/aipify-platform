import {
  getHostsProviderManifest,
  listHostsProviderManifests,
} from "@/lib/integration-intelligence/hosts/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionHostsContext } from "./companion-hosts-context";
import { filterHostsCapabilitiesForPrivacy } from "./companion-hosts-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type HostsProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeHostsQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasHostsProviderIntent(query: string): boolean {
  const normalized = normalizeHostsQuery(query);
  return /\b(hosts|hospitality|property|properties|reservation|reservations|booking|bookings|guest|guests|availability|calendar|cleaning|maintenance|payout|revenue|expense|forecast|report|portfolio|short.?term|rental|accommodation|check.?in|check.?out|turnover|message draft)\b/i.test(
    normalized,
  );
}

export function hasBlockedHostsOperationIntent(query: string): boolean {
  const normalized = normalizeHostsQuery(query);
  return /\b(send message|auto.?message|delete reservation|cancel reservation|delete property|delete guest|payment|refund|payout execute|irreversible)\b/i.test(
    normalized,
  );
}

export function hasExternalHostsAdapterIntent(query: string): boolean {
  const normalized = normalizeHostsQuery(query);
  return /\b(external channel adapter|third.?party channel|live channel sync|external booking adapter)\b/i.test(
    normalized,
  );
}

export function matchHostsProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): HostsProviderMatch | null {
  if (!hasHostsProviderIntent(query)) return null;

  const normalized = normalizeHostsQuery(query);
  const manifests = listHostsProviderManifests();

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
    if (normalized.includes("property") || normalized.includes("portfolio")) {
      return manifest.provider_key === "short_term_property";
    }
    if (normalized.includes("reservation") || normalized.includes("booking")) {
      return manifest.provider_key === "short_term_reservation";
    }
    if (normalized.includes("guest")) {
      return manifest.provider_key === "short_term_guest";
    }
    if (normalized.includes("calendar") || normalized.includes("availability")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "availability.read",
      );
    }
    if (normalized.includes("cleaning") || normalized.includes("maintenance")) {
      return manifest.provider_key === "short_term_operations";
    }
    if (
      normalized.includes("payout") ||
      normalized.includes("revenue") ||
      normalized.includes("expense") ||
      normalized.includes("forecast")
    ) {
      return manifest.provider_key === "short_term_finance";
    }
    if (normalized.includes("report") || normalized.includes("export")) {
      return manifest.provider_key === "short_term_reports";
    }
    if (normalized.includes("message") || normalized.includes("draft")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "message.draft",
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

  const writeIntent = /\b(draft|export|create|update)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|summary)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.hostsContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveHostsCrossLink(
  match: HostsProviderMatch,
  hostsContext: CompanionHostsContext,
): string {
  if (match.provider_key === "short_term_property") {
    return hostsContext.cross_link_properties;
  }
  if (match.provider_key === "short_term_reservation") {
    return hostsContext.cross_link_bookings;
  }
  if (match.provider_key === "short_term_finance") {
    return hostsContext.cross_link_finance;
  }
  if (match.provider_key === "short_term_reports") {
    return hostsContext.cross_link_reports;
  }
  return hostsContext.cross_link_hosts;
}

export function buildHostsProviderDiscoveryAnswer(
  match: HostsProviderMatch,
  hostsContext: CompanionHostsContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getHostsProviderManifest(match.provider_key);
  const providerStatus = hostsContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.hosts.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.hosts.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterHostsCapabilitiesForPrivacy(hostsContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.hosts.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.hosts.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const governanceLines = [
    hostsContext.auto_message_send_blocked
      ? t("customerApp.companionPlatformKnowledge.hosts.autoMessageSendBlocked")
      : null,
    hostsContext.payment_execution_blocked
      ? t("customerApp.companionPlatformKnowledge.hosts.paymentExecutionBlocked")
      : null,
    hostsContext.reservation_delete_blocked
      ? t("customerApp.companionPlatformKnowledge.hosts.reservationDeleteBlocked")
      : null,
    hostsContext.portfolio_isolation_enabled
      ? t("customerApp.companionPlatformKnowledge.hosts.portfolioIsolationActive")
      : t("customerApp.companionPlatformKnowledge.hosts.portfolioIsolationRequired"),
    hostsContext.vacation_mode_active
      ? t("customerApp.companionPlatformKnowledge.hosts.vacationModeActive")
      : t("customerApp.companionPlatformKnowledge.hosts.vacationModeAvailable"),
    hostsContext.command_brief_events_linked
      ? t("customerApp.companionPlatformKnowledge.hosts.commandBriefEventsLinked")
      : t("customerApp.companionPlatformKnowledge.hosts.commandBriefEventsAvailable"),
    hostsContext.human_oversight_required
      ? t("customerApp.companionPlatformKnowledge.hosts.humanOversightRequired")
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.hosts.discoveryExplanation"),
    capabilityLines,
    governanceLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.hosts.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.hosts.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.hosts.privacyNote"),
    t("customerApp.companionPlatformKnowledge.hosts.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.hosts.openHostsCenter",
        label: t("customerApp.companionPlatformKnowledge.hosts.openHostsCenter"),
        href: resolveHostsCrossLink(match, hostsContext),
        routeKey: "aipifyHosts",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.hosts.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildHostsProviderUnavailableAnswer(
  t: Translator,
  hostsContext: CompanionHostsContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.hosts.unavailableLead"),
    explanation: hostsContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.hosts.permissionDenied")
      : hostsContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.hosts.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.hosts.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "hosts-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.hosts.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "hosts-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedHostsOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.hosts.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.hosts.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "hosts-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.hosts.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "hosts-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalHostsUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.hosts.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.hosts.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "hosts-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.hosts.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "hosts-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
