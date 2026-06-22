import type { ProactiveProviderManifest } from "./types";

const PROACTIVE_VIEW = "executive.view";
const INSIGHTS_VIEW = "insights.view";
const RECOMMENDATIONS_VIEW = "recommendations.view";

function readCapability(
  capability_key: ProactiveProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = PROACTIVE_VIEW,
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

/** Proactive monitoring / alert / recommendation manifests — capability IDs originate here. */
export const PROACTIVE_PROVIDER_MANIFESTS: readonly ProactiveProviderManifest[] = [
  {
    provider_key: "proactive_insights_engine",
    display_name_key:
      "customerApp.companionPlatformKnowledge.proactive.providers.proactive_insights_engine",
    source_engine: "proactive_insights_engine",
    implementation_status: "connected",
    business_pack_key: "proactive_pack",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.proactive.searchTerms.proactive_insights_engine",
    capabilities: [
      readCapability("signal.read", "proactive_signal", INSIGHTS_VIEW),
      readCapability("alert.read", "proactive_alert", INSIGHTS_VIEW),
      readCapability("anomaly.read", "proactive_anomaly", INSIGHTS_VIEW, true),
      readCapability("risk_signal.read", "risk_signal", INSIGHTS_VIEW),
      readCapability("attention_item.read", "attention_item", PROACTIVE_VIEW),
    ],
  },
  {
    provider_key: "companion_recommendation_engine",
    display_name_key:
      "customerApp.companionPlatformKnowledge.proactive.providers.companion_recommendation_engine",
    source_engine: "companion_recommendation_engine",
    implementation_status: "connected",
    business_pack_key: "recommendations_pack",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.proactive.searchTerms.companion_recommendation_engine",
    capabilities: [
      readCapability("recommendation.read", "recommendation", RECOMMENDATIONS_VIEW),
      readCapability("opportunity.read", "opportunity", RECOMMENDATIONS_VIEW),
      readCapability("health_score.read", "recommendation_health", RECOMMENDATIONS_VIEW),
    ],
  },
  {
    provider_key: "proactive_organization_center",
    display_name_key:
      "customerApp.companionPlatformKnowledge.proactive.providers.proactive_organization_center",
    source_engine: "proactive_organization_center",
    implementation_status: "connected",
    business_pack_key: "proactive_pack",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.proactive.searchTerms.proactive_organization_center",
    capabilities: [
      readCapability("signal.read", "organization_signal", PROACTIVE_VIEW),
      readCapability("follow_up.read", "follow_up", PROACTIVE_VIEW),
      readCapability("attention_item.read", "organization_attention", PROACTIVE_VIEW),
    ],
  },
  {
    provider_key: "command_brief_operational",
    display_name_key:
      "customerApp.companionPlatformKnowledge.proactive.providers.command_brief_operational",
    source_engine: "command_brief_operational",
    implementation_status: "connected",
    business_pack_key: "command_center",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.proactive.searchTerms.command_brief_operational",
    capabilities: [
      readCapability("signal.read", "command_brief_signal", PROACTIVE_VIEW),
      readCapability("attention_item.read", "command_brief_attention", PROACTIVE_VIEW),
      readCapability("forecast_warning.read", "forecast_warning", PROACTIVE_VIEW),
    ],
  },
  {
    provider_key: "domain_signal_bus",
    display_name_key:
      "customerApp.companionPlatformKnowledge.proactive.providers.domain_signal_bus",
    source_engine: "domain_signal_bus",
    implementation_status: "connected",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.proactive.searchTerms.domain_signal_bus",
    capabilities: [
      readCapability("signal.read", "domain_signal", PROACTIVE_VIEW),
      readCapability("risk_signal.read", "domain_risk", PROACTIVE_VIEW),
      readCapability("opportunity.read", "domain_opportunity", PROACTIVE_VIEW),
      readCapability("health_score.read", "domain_health", PROACTIVE_VIEW),
      readCapability("follow_up.read", "domain_follow_up", PROACTIVE_VIEW),
    ],
  },
  {
    provider_key: "proactive_pack_adapter",
    display_name_key:
      "customerApp.companionPlatformKnowledge.proactive.providers.proactive_pack_adapter",
    source_engine: "proactive_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: "proactive_pack",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.proactive.searchTerms.proactive_pack_adapter",
    capabilities: [readCapability("signal.read", "external_signal", PROACTIVE_VIEW)],
  },
];
