import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  BusinessImpactItem,
  CompanionEconomicItem,
  ConsumerSpendingItem,
  EconomicIntelligenceCenter,
  EconomicSectionItem,
  EconomicSectionKey,
  EconomicSettings,
  ExecutiveEconomicMetric,
  MonitoringItem,
  OpportunityItem,
  RegionalItem,
  ScenarioItem,
  WorkforceItem,
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

function parseSection(raw: unknown): EconomicSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "economic_overview") as EconomicSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): EconomicSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseSettings(raw: unknown): EconomicSettings {
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

function parseRegional(raw: unknown): RegionalItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), scopeType: asString(d.scope_type), regionKey: asString(d.region_key),
    regionName: asString(d.region_name), summary: asString(d.summary),
    sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), statusKey: asStatus(d.status_key), itemType: "regional",
  };
}

function parseBusinessImpact(raw: unknown): BusinessImpactItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), impactArea: asString(d.impact_area), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), impactLabel: asString(d.impact_label),
    statusKey: asStatus(d.status_key), itemType: "business_impact",
  };
}

function parseConsumerSpending(raw: unknown): ConsumerSpendingItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), spendingType: asString(d.spending_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), impactLabel: asString(d.impact_label),
    statusKey: asStatus(d.status_key), itemType: "consumer_spending",
  };
}

function parseWorkforce(raw: unknown): WorkforceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), workforceType: asString(d.workforce_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), impactLabel: asString(d.impact_label),
    statusKey: asStatus(d.status_key), itemType: "workforce",
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

function parseExecutive(raw: unknown): ExecutiveEconomicMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

function parseCompanion(raw: unknown): CompanionEconomicItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), advisorType: asString(d.advisor_type), question: asString(d.question),
    insight: asString(d.insight), reasoningLabel: asString(d.reasoning_label),
    evidenceLabel: asString(d.evidence_label), sourceLabel: asString(d.source_label),
    dateLabel: asString(d.date_label), confidenceLabel: asString(d.confidence_label),
    impactLabel: asString(d.impact_label), status: asString(d.status), itemType: "companion",
  };
}

function parseScenario(raw: unknown): ScenarioItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), scenarioType: asString(d.scenario_type), title: asString(d.title),
    potentialImpact: asString(d.potential_impact), preparationLabel: asString(d.preparation_label),
    sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), statusKey: asStatus(d.status_key), itemType: "scenario",
  };
}

const emptyCenter: EconomicIntelligenceCenter = {
  found: false,
  intelligenceSettings: { intelligenceEnabled: true, humanControlRequired: true },
  economicMonitoringEngine: [],
  regionalEconomicIntelligence: [],
  businessImpactEngine: [],
  consumerSpendingIntelligence: [],
  hiringWorkforceIntelligence: [],
  economicOpportunityEngine: [],
  executiveEconomicDashboard: [],
  companionEconomicAdvisor: [],
  scenarioModeling: [],
  sections: {
    economic_overview: [], inflation: [], interest_rates: [], employment: [],
    consumer_trends: [], business_climate: [], economic_risks: [], economic_opportunities: [],
  },
  statistics: { monitoringCount: 0, regionalCount: 0, impactCount: 0, opportunityCount: 0, companionCount: 0, scenarioCount: 0 },
};

export function parseEconomicIntelligenceCenter(raw: unknown): EconomicIntelligenceCenter {
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
    economicMonitoringEngine: Array.isArray(d.economic_monitoring_engine) ? d.economic_monitoring_engine.map(parseMonitoring) : [],
    regionalEconomicIntelligence: Array.isArray(d.regional_economic_intelligence) ? d.regional_economic_intelligence.map(parseRegional) : [],
    businessImpactEngine: Array.isArray(d.business_impact_engine) ? d.business_impact_engine.map(parseBusinessImpact) : [],
    consumerSpendingIntelligence: Array.isArray(d.consumer_spending_intelligence) ? d.consumer_spending_intelligence.map(parseConsumerSpending) : [],
    hiringWorkforceIntelligence: Array.isArray(d.hiring_workforce_intelligence) ? d.hiring_workforce_intelligence.map(parseWorkforce) : [],
    economicOpportunityEngine: Array.isArray(d.economic_opportunity_engine) ? d.economic_opportunity_engine.map(parseOpportunity) : [],
    executiveEconomicDashboard: Array.isArray(d.executive_economic_dashboard) ? d.executive_economic_dashboard.map(parseExecutive) : [],
    companionEconomicAdvisor: Array.isArray(d.companion_economic_advisor) ? d.companion_economic_advisor.map(parseCompanion) : [],
    scenarioModeling: Array.isArray(d.scenario_modeling) ? d.scenario_modeling.map(parseScenario) : [],
    sections: {
      economic_overview: parseSections(sections.economic_overview),
      inflation: parseSections(sections.inflation),
      interest_rates: parseSections(sections.interest_rates),
      employment: parseSections(sections.employment),
      consumer_trends: parseSections(sections.consumer_trends),
      business_climate: parseSections(sections.business_climate),
      economic_risks: parseSections(sections.economic_risks),
      economic_opportunities: parseSections(sections.economic_opportunities),
    },
    statistics: {
      monitoringCount: asNumber(stats.monitoring_count),
      regionalCount: asNumber(stats.regional_count),
      impactCount: asNumber(stats.impact_count),
      opportunityCount: asNumber(stats.opportunity_count),
      companionCount: asNumber(stats.companion_count),
      scenarioCount: asNumber(stats.scenario_count),
    },
  };
}

export function parseEconomicIntelligenceAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
