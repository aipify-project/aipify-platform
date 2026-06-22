import {
  getProactiveProviderManifest,
  listProactiveProviderManifests,
} from "@/lib/integration-intelligence/proactive/registry";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionProactiveContext } from "./companion-proactive-context";
import { filterProactiveCapabilitiesForPrivacy } from "./companion-proactive-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type ProactiveProviderMatch = {
  provider_key: string;
  capability_key: string | null;
};

function normalizeProactiveQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasProactiveProviderIntent(query: string): boolean {
  const normalized = normalizeProactiveQuery(query);
  return /\b(proactive|monitoring|alert|alerts|anomaly|anomalies|recommendation|recommendations|risk signal|opportunity|opportunities|health score|forecast warning|follow.?up|attention item|unresolved|insight|insights|command brief signal)\b/i.test(
    normalized,
  );
}

export function hasBlockedProactiveOperationIntent(query: string): boolean {
  const normalized = normalizeProactiveQuery(query);
  return /\b(auto execute recommendation|auto.?apply recommendation|auto dismiss alert|auto resolve signal|execute recommendation automatically)\b/i.test(
    normalized,
  );
}

export function hasExternalProactiveAdapterIntent(query: string): boolean {
  const normalized = normalizeProactiveQuery(query);
  return /\b(external proactive adapter|live monitoring adapter|third.?party alert sync)\b/i.test(
    normalized,
  );
}

export function matchProactiveProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): ProactiveProviderMatch | null {
  if (!hasProactiveProviderIntent(query)) return null;

  const normalized = normalizeProactiveQuery(query);
  const manifests = listProactiveProviderManifests();

  for (const manifest of manifests) {
    const provider = manifest.provider_key.toLowerCase();
    const providerSpaced = provider.replace(/_/g, " ");
    if (normalized.includes(providerSpaced) || normalized.includes(provider)) {
      return { provider_key: manifest.provider_key, capability_key: null };
    }
  }

  for (const manifest of manifests) {
    for (const capability of manifest.capabilities) {
      const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
      if (normalized.includes(capabilityPhrase)) {
        return {
          provider_key: manifest.provider_key,
          capability_key: capability.capability_key,
        };
      }
    }
  }

  if (tenantContext.proactiveContext.prioritized_signals.length > 0) {
    return { provider_key: "domain_signal_bus", capability_key: "signal.read" };
  }

  return { provider_key: "proactive_insights_engine", capability_key: null };
}

function statusLabelKey(status: string): string {
  return `customerApp.companionPlatformKnowledge.proactive.status.${status}`;
}

function proactiveSourceLabel(t: Translator): string {
  return t("customerApp.companionPlatformKnowledge.proactive.sourceLabel");
}

export function buildProactiveProviderDiscoveryAnswer(
  match: ProactiveProviderMatch,
  proactiveContext: CompanionProactiveContext,
  t: Translator,
): PlatformKnowledgeAnswer {
  const manifest = getProactiveProviderManifest(match.provider_key);
  const providerLabel = manifest
    ? t(manifest.display_name_key)
    : match.provider_key.replace(/_/g, " ");
  const provider = proactiveContext.providers.find(
    (entry) => entry.provider_key === match.provider_key,
  );
  const status = provider?.implementation_status ?? "partial";
  const statusLabel = t(statusLabelKey(status));

  const capabilityLines = filterProactiveCapabilitiesForPrivacy(proactiveContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 8)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.proactive.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.proactive.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const signalLines = proactiveContext.prioritized_signals
    .slice(0, 5)
    .map((signal) =>
      t("customerApp.companionPlatformKnowledge.proactive.signalLine")
        .replace("{title}", signal.title)
        .replace("{severity}", signal.severity)
        .replace("{sourceModule}", signal.source_module),
    )
    .join("\n");

  const governanceLines = [
    t("customerApp.companionPlatformKnowledge.proactive.recommendationAutoExecuteBlocked"),
    t("customerApp.companionPlatformKnowledge.proactive.noRecommendationWithoutSource"),
    t("customerApp.companionPlatformKnowledge.proactive.noFalseAlerts"),
    proactiveContext.sensitive_data_sanitized
      ? t("customerApp.companionPlatformKnowledge.proactive.sensitiveDataSanitized")
      : null,
    proactiveContext.role_based_access_active
      ? t("customerApp.companionPlatformKnowledge.proactive.roleBasedAccessActive")
      : null,
    proactiveContext.command_brief_events_linked
      ? t("customerApp.companionPlatformKnowledge.proactive.commandBriefEventsLinked")
      : t("customerApp.companionPlatformKnowledge.proactive.commandBriefEventsAvailable"),
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.proactive.discoveryExplanation"),
    capabilityLines,
    signalLines,
    governanceLines,
    provider?.verified
      ? t("customerApp.companionPlatformKnowledge.proactive.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.proactive.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.proactive.privacyNote"),
    t("customerApp.companionPlatformKnowledge.proactive.policyNote"),
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.proactive.discoveryLead")
      .replace("{provider}", providerLabel)
      .replace("{status}", statusLabel),
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.proactive.openProactiveCenter",
        label: t("customerApp.companionPlatformKnowledge.proactive.openProactiveCenter"),
        href: proactiveContext.cross_link_command_brief,
        routeKey: "appCommandCenter",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: proactiveSourceLabel(t),
        kind: "customer_context",
        meta: status,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: provider?.verified ? "moderate" : "low",
  };
}

export function buildProactiveProviderUnavailableAnswer(
  t: Translator,
  proactiveContext: CompanionProactiveContext,
): PlatformKnowledgeAnswer {
  let directAnswer = t("customerApp.companionPlatformKnowledge.proactive.unavailableLead");
  let explanation = t("customerApp.companionPlatformKnowledge.proactive.unavailableExplanation");

  if (proactiveContext.app_entitlement_blocked) {
    directAnswer = t("customerApp.companionPlatformKnowledge.proactive.entitlementBlocked");
    explanation = t("customerApp.companionPlatformKnowledge.proactive.policyNote");
  } else if (proactiveContext.permission_denied) {
    directAnswer = t("customerApp.companionPlatformKnowledge.proactive.permissionDenied");
    explanation = t("customerApp.companionPlatformKnowledge.proactive.policyNote");
  } else if (proactiveContext.empty_signal_basis) {
    directAnswer = t("customerApp.companionPlatformKnowledge.proactive.emptySignalBasisLead");
    explanation = t("customerApp.companionPlatformKnowledge.proactive.emptySignalBasisExplanation");
  }

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [],
    sources: [
      {
        id: "proactive-provider-unavailable",
        label: proactiveSourceLabel(t),
        kind: "customer_context",
      },
    ],
    sourceId: "proactive-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedProactiveOperationAnswer(t: Translator): PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.proactive.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.proactive.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "proactive-blocked-operation",
        label: proactiveSourceLabel(t),
        kind: "customer_context",
      },
    ],
    sourceId: "proactive-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalProactiveUnavailableAnswer(t: Translator): PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.proactive.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.proactive.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "proactive-external-unavailable",
        label: proactiveSourceLabel(t),
        kind: "customer_context",
      },
    ],
    sourceId: "proactive-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildProactiveSignalSummaryAnswer(
  proactiveContext: CompanionProactiveContext,
  t: Translator,
): PlatformKnowledgeAnswer {
  const topSignals = proactiveContext.prioritized_signals.slice(0, 6);
  if (topSignals.length === 0) {
    return buildProactiveProviderUnavailableAnswer(t, proactiveContext);
  }

  const lines = topSignals
    .map((signal) =>
      t("customerApp.companionPlatformKnowledge.proactive.signalLine")
        .replace("{title}", signal.title)
        .replace("{severity}", signal.severity)
        .replace("{sourceModule}", signal.source_module),
    )
    .join("\n");

  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.proactive.signalSummaryLead").replace(
      "{count}",
      String(topSignals.length),
    ),
    explanation: [
      t("customerApp.companionPlatformKnowledge.proactive.signalSummaryExplanation"),
      lines,
      t("customerApp.companionPlatformKnowledge.proactive.commandBriefEventsLinked"),
    ].join("\n\n"),
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.proactive.openProactiveCenter",
        label: t("customerApp.companionPlatformKnowledge.proactive.openProactiveCenter"),
        href: proactiveContext.cross_link_command_brief,
        routeKey: "appCommandCenter",
      },
    ],
    sources: [
      {
        id: "proactive-signal-summary",
        label: proactiveSourceLabel(t),
        kind: "customer_context",
      },
    ],
    sourceId: "proactive-signal-summary",
    source: "customer_context",
    confidence: "moderate",
  };
}
