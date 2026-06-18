import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  CompanionMarketItem,
  CustomerBehaviorItem,
  ExecutiveMarketMetric,
  ForecastItem,
  GeographicItem,
  MarketGapItem,
  MarketIntelligenceCenter,
  MarketSectionItem,
  MarketSectionKey,
  MarketSettings,
  MonitoringItem,
  OpportunityItem,
  RevenueOpportunityItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}
function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = ["completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting"];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseSection(raw: unknown): MarketSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "market_overview") as MarketSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): MarketSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseSettings(raw: unknown): MarketSettings {
  const d = asRecord(raw);
  return {
    intelligenceEnabled: asBool(d.intelligence_enabled, true),
    humanControlRequired: asBool(d.human_control_required, true),
  };
}

function parseMonitoring(raw: unknown): MonitoringItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), monitoringType: asString(d.monitoring_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), impactLabel: asString(d.impact_label),
    statusKey: asStatus(d.status_key), itemType: "monitoring",
  };
}

function parseBehavior(raw: unknown): CustomerBehaviorItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), behaviorType: asString(d.behavior_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), impactLabel: asString(d.impact_label),
    statusKey: asStatus(d.status_key), itemType: "customer_behavior",
  };
}

function parseOpportunity(raw: unknown): OpportunityItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), opportunityType: asString(d.opportunity_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), impactLabel: asString(d.impact_label),
    statusKey: asStatus(d.status_key), itemType: "opportunity",
  };
}

function parseGap(raw: unknown): MarketGapItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), gapType: asString(d.gap_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), impactLabel: asString(d.impact_label),
    statusKey: asStatus(d.status_key), itemType: "market_gap",
  };
}

function parseGeographic(raw: unknown): GeographicItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), geoType: asString(d.geo_type), geoKey: asString(d.geo_key),
    geoName: asString(d.geo_name), summary: asString(d.summary),
    sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), statusKey: asStatus(d.status_key), itemType: "geographic",
  };
}

function parseRevenue(raw: unknown): RevenueOpportunityItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), opportunityTitle: asString(d.opportunity_title),
    opportunityScoreLabel: asString(d.opportunity_score_label),
    potentialRevenueLabel: asString(d.potential_revenue_label),
    adoptionPotentialLabel: asString(d.adoption_potential_label),
    marketSizeLabel: asString(d.market_size_label),
    competitionLevelLabel: asString(d.competition_level_label),
    sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), impactLabel: asString(d.impact_label),
    statusKey: asStatus(d.status_key), itemType: "revenue_opportunity",
  };
}

function parseExecutive(raw: unknown): ExecutiveMarketMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

function parseCompanion(raw: unknown): CompanionMarketItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), advisorType: asString(d.advisor_type), question: asString(d.question),
    insight: asString(d.insight), evidenceLabel: asString(d.evidence_label),
    sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), impactLabel: asString(d.impact_label),
    status: asString(d.status), itemType: "companion",
  };
}

function parseForecast(raw: unknown): ForecastItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), forecastHorizon: asString(d.forecast_horizon), horizonLabel: asString(d.horizon_label),
    forecastSummary: asString(d.forecast_summary), sourceLabel: asString(d.source_label),
    dateLabel: asString(d.date_label), confidenceLabel: asString(d.confidence_label),
    statusKey: asStatus(d.status_key), itemType: "forecast",
  };
}

const emptyCenter: MarketIntelligenceCenter = {
  found: false,
  intelligenceSettings: { intelligenceEnabled: true, humanControlRequired: true },
  marketMonitoringEngine: [],
  customerBehaviorIntelligence: [],
  opportunityDiscoveryEngine: [],
  marketGapDetection: [],
  geographicExpansionIntelligence: [],
  revenueOpportunityEngine: [],
  executiveMarketDashboard: [],
  companionMarketAdvisor: [],
  forecastingEngine: [],
  sections: {
    market_overview: [], customer_trends: [], opportunity_detection: [], market_gaps: [],
    expansion_opportunities: [], emerging_demand: [], market_forecasts: [],
  },
  statistics: { monitoringCount: 0, behaviorCount: 0, opportunityCount: 0, gapCount: 0, revenueCount: 0, companionCount: 0 },
};

export function parseMarketIntelligenceCenter(raw: unknown): MarketIntelligenceCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...emptyCenter, error: asString(d.error) || undefined };

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    intelligenceSettings: parseSettings(d.intelligence_settings),
    marketMonitoringEngine: Array.isArray(d.market_monitoring_engine) ? d.market_monitoring_engine.map(parseMonitoring) : [],
    customerBehaviorIntelligence: Array.isArray(d.customer_behavior_intelligence) ? d.customer_behavior_intelligence.map(parseBehavior) : [],
    opportunityDiscoveryEngine: Array.isArray(d.opportunity_discovery_engine) ? d.opportunity_discovery_engine.map(parseOpportunity) : [],
    marketGapDetection: Array.isArray(d.market_gap_detection) ? d.market_gap_detection.map(parseGap) : [],
    geographicExpansionIntelligence: Array.isArray(d.geographic_expansion_intelligence) ? d.geographic_expansion_intelligence.map(parseGeographic) : [],
    revenueOpportunityEngine: Array.isArray(d.revenue_opportunity_engine) ? d.revenue_opportunity_engine.map(parseRevenue) : [],
    executiveMarketDashboard: Array.isArray(d.executive_market_dashboard) ? d.executive_market_dashboard.map(parseExecutive) : [],
    companionMarketAdvisor: Array.isArray(d.companion_market_advisor) ? d.companion_market_advisor.map(parseCompanion) : [],
    forecastingEngine: Array.isArray(d.forecasting_engine) ? d.forecasting_engine.map(parseForecast) : [],
    sections: {
      market_overview: parseSections(sections.market_overview),
      customer_trends: parseSections(sections.customer_trends),
      opportunity_detection: parseSections(sections.opportunity_detection),
      market_gaps: parseSections(sections.market_gaps),
      expansion_opportunities: parseSections(sections.expansion_opportunities),
      emerging_demand: parseSections(sections.emerging_demand),
      market_forecasts: parseSections(sections.market_forecasts),
    },
    statistics: {
      monitoringCount: asNumber(stats.monitoring_count),
      behaviorCount: asNumber(stats.behavior_count),
      opportunityCount: asNumber(stats.opportunity_count),
      gapCount: asNumber(stats.gap_count),
      revenueCount: asNumber(stats.revenue_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseMarketIntelligenceAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
