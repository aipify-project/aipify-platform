import {
  getAnalyticsProviderManifest,
  listAnalyticsProviderManifests,
} from "@/lib/integration-intelligence/analytics/registry";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionAnalyticsContext } from "./companion-analytics-context";
import { filterAnalyticsCapabilitiesForPrivacy } from "./companion-analytics-context";
import type { CompanionTenantContext } from "./companion-tenant-context";
import { validateUnsupportedCorrelationAttempt } from "./normalize-analytics-metrics";

export type AnalyticsProviderMatch = {
  provider_key: string;
  capability_key: string | null;
};

function normalizeAnalyticsQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasAnalyticsProviderIntent(query: string): boolean {
  const normalized = normalizeAnalyticsQuery(query);
  return /\b(analytics|kpi|kpis|metric|metrics|trend|trends|comparison|comparisons|forecast|forecasts|executive insight|executive intelligence|strategic intelligence|performance|dashboard|dashboards|report|reports|cross.?module|correlation|health score|organization health)\b/i.test(
    normalized,
  );
}

export function hasBlockedAnalyticsOperationIntent(query: string): boolean {
  const normalized = normalizeAnalyticsQuery(query);
  return /\b(auto generate report|auto apply insight|auto export analytics|execute recommendation automatically|auto.?apply recommendation)\b/i.test(
    normalized,
  );
}

export function hasExternalAnalyticsAdapterIntent(query: string): boolean {
  const normalized = normalizeAnalyticsQuery(query);
  return /\b(external analytics adapter|live bi adapter|third.?party analytics sync)\b/i.test(
    normalized,
  );
}

export function hasUnsupportedCorrelationIntent(query: string): boolean {
  const normalized = normalizeAnalyticsQuery(query);
  return /\b(correlat|caus|because|due to|led to|driven by|root cause|why did)\b/i.test(
    normalized,
  );
}

export function matchAnalyticsProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): AnalyticsProviderMatch | null {
  if (!hasAnalyticsProviderIntent(query)) return null;

  const normalized = normalizeAnalyticsQuery(query);
  const manifests = listAnalyticsProviderManifests();

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

  if (tenantContext.analyticsContext.cross_module_views.length > 0) {
    return { provider_key: "cross_module_insight_bus", capability_key: "cross_module.read" };
  }

  if (tenantContext.analyticsContext.prioritized_metrics.length > 0) {
    return { provider_key: "analytics_center", capability_key: "kpi.read" };
  }

  return { provider_key: "companion_analytics_context", capability_key: null };
}

function statusLabelKey(status: string): string {
  return `customerApp.companionPlatformKnowledge.analytics.status.${status}`;
}

function analyticsSourceLabel(t: Translator): string {
  return t("customerApp.companionPlatformKnowledge.analytics.sourceLabel");
}

export function buildAnalyticsProviderDiscoveryAnswer(
  match: AnalyticsProviderMatch,
  analyticsContext: CompanionAnalyticsContext,
  t: Translator,
): PlatformKnowledgeAnswer {
  const manifest = getAnalyticsProviderManifest(match.provider_key);
  const providerLabel = manifest
    ? t(manifest.display_name_key)
    : match.provider_key.replace(/_/g, " ");
  const provider = analyticsContext.providers.find(
    (entry) => entry.provider_key === match.provider_key,
  );
  const status = provider?.implementation_status ?? "partial";
  const statusLabel = t(statusLabelKey(status));

  const capabilityLines = filterAnalyticsCapabilitiesForPrivacy(analyticsContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 8)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.analytics.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.analytics.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const metricLines = analyticsContext.prioritized_metrics
    .slice(0, 6)
    .map((metric) =>
      t("customerApp.companionPlatformKnowledge.analytics.metricLine")
        .replace("{label}", metric.metric_label)
        .replace("{value}", String(metric.value))
        .replace("{unit}", metric.unit)
        .replace("{sourceModule}", metric.source_module),
    )
    .join("\n");

  const crossModuleLines = analyticsContext.cross_module_views
    .slice(0, 3)
    .map((view) =>
      t("customerApp.companionPlatformKnowledge.analytics.crossModuleLine")
        .replace("{period}", view.period)
        .replace("{unit}", view.unit)
        .replace("{sources}", view.source_modules.join(", ")),
    )
    .join("\n");

  const governanceLines = [
    t("customerApp.companionPlatformKnowledge.analytics.insightAutoApplyBlocked"),
    t("customerApp.companionPlatformKnowledge.analytics.noRecommendationWithoutBasis"),
    t("customerApp.companionPlatformKnowledge.analytics.noInferredCorrelation"),
    t("customerApp.companionPlatformKnowledge.analytics.factVsInferenceNote"),
    analyticsContext.sensitive_metrics_filtered
      ? t("customerApp.companionPlatformKnowledge.analytics.sensitiveMetricsFiltered")
      : null,
    analyticsContext.role_based_access_active
      ? t("customerApp.companionPlatformKnowledge.analytics.roleBasedAccessActive")
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.analytics.discoveryExplanation"),
    capabilityLines,
    metricLines,
    crossModuleLines,
    governanceLines,
    provider?.verified
      ? t("customerApp.companionPlatformKnowledge.analytics.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.analytics.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.analytics.privacyNote"),
    t("customerApp.companionPlatformKnowledge.analytics.policyNote"),
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.analytics.discoveryLead")
      .replace("{provider}", providerLabel)
      .replace("{status}", statusLabel),
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.analytics.openAnalyticsCenter",
        label: t("customerApp.companionPlatformKnowledge.analytics.openAnalyticsCenter"),
        href: analyticsContext.cross_link_analytics,
        routeKey: "appAnalytics",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: analyticsSourceLabel(t),
        kind: "customer_context",
        meta: status,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: provider?.verified ? "moderate" : "low",
  };
}

export function buildAnalyticsProviderUnavailableAnswer(
  t: Translator,
  analyticsContext: CompanionAnalyticsContext,
): PlatformKnowledgeAnswer {
  let directAnswer = t("customerApp.companionPlatformKnowledge.analytics.unavailableLead");
  let explanation = t("customerApp.companionPlatformKnowledge.analytics.unavailableExplanation");

  if (analyticsContext.app_entitlement_blocked) {
    directAnswer = t("customerApp.companionPlatformKnowledge.analytics.entitlementBlocked");
    explanation = t("customerApp.companionPlatformKnowledge.analytics.policyNote");
  } else if (analyticsContext.permission_denied) {
    directAnswer = t("customerApp.companionPlatformKnowledge.analytics.permissionDenied");
    explanation = t("customerApp.companionPlatformKnowledge.analytics.policyNote");
  } else if (analyticsContext.empty_metric_basis) {
    directAnswer = t("customerApp.companionPlatformKnowledge.analytics.emptyMetricBasisLead");
    explanation = t("customerApp.companionPlatformKnowledge.analytics.emptyMetricBasisExplanation");
  }

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [],
    sources: [
      {
        id: "analytics-provider-unavailable",
        label: analyticsSourceLabel(t),
        kind: "customer_context",
      },
    ],
    sourceId: "analytics-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedAnalyticsOperationAnswer(t: Translator): PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.analytics.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.analytics.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "analytics-blocked-operation",
        label: analyticsSourceLabel(t),
        kind: "customer_context",
      },
    ],
    sourceId: "analytics-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalAnalyticsUnavailableAnswer(t: Translator): PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.analytics.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.analytics.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "analytics-external-unavailable",
        label: analyticsSourceLabel(t),
        kind: "customer_context",
      },
    ],
    sourceId: "analytics-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildUnsupportedCorrelationAnswer(
  analyticsContext: CompanionAnalyticsContext,
  t: Translator,
): PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.analytics.unsupportedCorrelationLead"),
    explanation: [
      t("customerApp.companionPlatformKnowledge.analytics.unsupportedCorrelationExplanation"),
      t("customerApp.companionPlatformKnowledge.analytics.factVsInferenceNote"),
      analyticsContext.cross_module_views.length > 0
        ? t("customerApp.companionPlatformKnowledge.analytics.crossModuleFactsAvailable")
        : t("customerApp.companionPlatformKnowledge.analytics.crossModuleFactsUnavailable"),
    ].join("\n\n"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "analytics-unsupported-correlation",
        label: analyticsSourceLabel(t),
        kind: "customer_context",
      },
    ],
    sourceId: "analytics-unsupported-correlation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildAnalyticsExecutiveSummaryAnswer(
  analyticsContext: CompanionAnalyticsContext,
  t: Translator,
): PlatformKnowledgeAnswer {
  const topMetrics = analyticsContext.prioritized_metrics.slice(0, 8);
  if (topMetrics.length === 0) {
    return buildAnalyticsProviderUnavailableAnswer(t, analyticsContext);
  }

  const lines = topMetrics
    .map((metric) =>
      t("customerApp.companionPlatformKnowledge.analytics.metricLine")
        .replace("{label}", metric.metric_label)
        .replace("{value}", String(metric.value))
        .replace("{unit}", metric.unit)
        .replace("{sourceModule}", metric.source_module),
    )
    .join("\n");

  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.analytics.executiveSummaryLead").replace(
      "{count}",
      String(topMetrics.length),
    ),
    explanation: [
      t("customerApp.companionPlatformKnowledge.analytics.executiveSummaryExplanation"),
      lines,
      t("customerApp.companionPlatformKnowledge.analytics.factVsInferenceNote"),
    ].join("\n\n"),
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.analytics.openExecutiveInsights",
        label: t("customerApp.companionPlatformKnowledge.analytics.openExecutiveInsights"),
        href: analyticsContext.cross_link_executive_insights,
        routeKey: "appInsights",
      },
    ],
    sources: [
      {
        id: "analytics-executive-summary",
        label: analyticsSourceLabel(t),
        kind: "customer_context",
      },
    ],
    sourceId: "analytics-executive-summary",
    source: "customer_context",
    confidence: "moderate",
  };
}

export function resolveAnalyticsCorrelationBlocked(
  query: string,
  analyticsContext: CompanionAnalyticsContext,
): boolean {
  if (!hasUnsupportedCorrelationIntent(query)) return false;
  return validateUnsupportedCorrelationAttempt(query, analyticsContext.prioritized_metrics);
}
