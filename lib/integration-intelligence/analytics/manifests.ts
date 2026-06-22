import type { AnalyticsProviderManifest } from "./types";

const ANALYTICS_VIEW = "analytics.view";
const EXECUTIVE_VIEW = "executive.view";
const ADVANCED_INSIGHTS_VIEW = "advanced_insights.view";

function readCapability(
  capability_key: AnalyticsProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = ANALYTICS_VIEW,
  privacy_sensitive = false,
) {
  return {
    capability_key,
    operation: "read" as const,
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1 as const,
    entity,
    required_permission: permission,
    privacy_sensitive,
  };
}

/** Analytics / executive intelligence manifests — capability IDs originate here. */
export const ANALYTICS_PROVIDER_MANIFESTS: readonly AnalyticsProviderManifest[] = [
  {
    provider_key: "analytics_center",
    display_name_key:
      "customerApp.companionPlatformKnowledge.analytics.providers.analytics_center",
    source_engine: "analytics_center",
    implementation_status: "connected",
    business_pack_key: "analytics",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.analytics.searchTerms.analytics_center",
    capabilities: [
      readCapability("kpi.read", "analytics_kpi"),
      readCapability("metric.read", "analytics_metric"),
      readCapability("trend.read", "analytics_trend"),
      readCapability("comparison.read", "analytics_comparison"),
      readCapability("dashboard.read", "analytics_dashboard"),
      readCapability("report.read", "analytics_report"),
      readCapability("performance.read", "analytics_performance"),
    ],
  },
  {
    provider_key: "executive_insights_center",
    display_name_key:
      "customerApp.companionPlatformKnowledge.analytics.providers.executive_insights_center",
    source_engine: "executive_insights_center",
    implementation_status: "connected",
    business_pack_key: "executive_intelligence",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.analytics.searchTerms.executive_insights_center",
    capabilities: [
      readCapability("executive_insight.read", "executive_insight", EXECUTIVE_VIEW),
      readCapability("kpi.read", "executive_kpi", EXECUTIVE_VIEW),
      readCapability("anomaly.read", "executive_anomaly", EXECUTIVE_VIEW, true),
      readCapability("performance.read", "executive_performance", EXECUTIVE_VIEW),
    ],
  },
  {
    provider_key: "companion_analytics_context",
    display_name_key:
      "customerApp.companionPlatformKnowledge.analytics.providers.companion_analytics_context",
    source_engine: "companion_analytics_context",
    implementation_status: "connected",
    business_pack_key: "analytics",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.analytics.searchTerms.companion_analytics_context",
    capabilities: [
      readCapability("kpi.read", "companion_kpi"),
      readCapability("metric.read", "companion_metric"),
      readCapability("dashboard.read", "companion_dashboard"),
    ],
  },
  {
    provider_key: "companion_executive_layer",
    display_name_key:
      "customerApp.companionPlatformKnowledge.analytics.providers.companion_executive_layer",
    source_engine: "companion_executive_layer",
    implementation_status: "connected",
    business_pack_key: "executive_intelligence",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.analytics.searchTerms.companion_executive_layer",
    capabilities: [
      readCapability("executive_insight.read", "executive_layer_insight", ADVANCED_INSIGHTS_VIEW),
      readCapability("forecast.read", "executive_forecast", ADVANCED_INSIGHTS_VIEW),
      readCapability("performance.read", "executive_layer_performance", ADVANCED_INSIGHTS_VIEW),
      readCapability("kpi.read", "executive_layer_kpi", ADVANCED_INSIGHTS_VIEW),
    ],
  },
  {
    provider_key: "command_brief_analytics",
    display_name_key:
      "customerApp.companionPlatformKnowledge.analytics.providers.command_brief_analytics",
    source_engine: "command_brief_analytics",
    implementation_status: "connected",
    business_pack_key: "command_center",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.analytics.searchTerms.command_brief_analytics",
    capabilities: [
      readCapability("kpi.read", "command_brief_kpi", EXECUTIVE_VIEW),
      readCapability("metric.read", "command_brief_metric", EXECUTIVE_VIEW),
      readCapability("dashboard.read", "command_brief_dashboard", EXECUTIVE_VIEW),
    ],
  },
  {
    provider_key: "cross_module_insight_bus",
    display_name_key:
      "customerApp.companionPlatformKnowledge.analytics.providers.cross_module_insight_bus",
    source_engine: "cross_module_insight_bus",
    implementation_status: "connected",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.analytics.searchTerms.cross_module_insight_bus",
    capabilities: [
      readCapability("cross_module.read", "cross_module_view", ANALYTICS_VIEW),
      readCapability("comparison.read", "cross_module_comparison", ANALYTICS_VIEW),
    ],
  },
  {
    provider_key: "analytics_pack_adapter",
    display_name_key:
      "customerApp.companionPlatformKnowledge.analytics.providers.analytics_pack_adapter",
    source_engine: "analytics_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: "analytics",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.analytics.searchTerms.analytics_pack_adapter",
    capabilities: [readCapability("metric.read", "external_metric", ANALYTICS_VIEW)],
  },
];
