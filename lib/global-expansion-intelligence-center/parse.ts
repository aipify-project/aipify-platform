import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  CompanionExpansionItem,
  CountryProfile,
  ExecutiveExpansionMetric,
  ExpansionOpportunityItem,
  ExpansionSectionItem,
  ExpansionSectionKey,
  ExpansionSettings,
  GlobalExpansionIntelligenceCenter,
  LocalizationItem,
  MarketEntryItem,
  OperationsItem,
  ReadinessItem,
  RegulatoryItem,
  SimulationItem,
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

function parseSection(raw: unknown): ExpansionSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "expansion_overview") as ExpansionSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): ExpansionSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseSettings(raw: unknown): ExpansionSettings {
  const d = asRecord(raw);
  return {
    intelligenceEnabled: asBool(d.intelligence_enabled, true),
    humanControlRequired: asBool(d.human_control_required, true),
  };
}

function parseCountry(raw: unknown): CountryProfile {
  const d = asRecord(raw);
  return {
    id: asString(d.id), countryKey: asString(d.country_key), countryName: asString(d.country_name),
    profileType: asString(d.profile_type), marketSizeLabel: asString(d.market_size_label),
    languageLabel: asString(d.language_label), businessEnvironmentLabel: asString(d.business_environment_label),
    growthPotentialLabel: asString(d.growth_potential_label), competitionLevelLabel: asString(d.competition_level_label),
    riskLevelLabel: asString(d.risk_level_label), sourceLabel: asString(d.source_label),
    dateLabel: asString(d.date_label), confidenceLabel: asString(d.confidence_label),
    statusKey: asStatus(d.status_key), itemType: "country",
  };
}

function parseLocalization(raw: unknown): LocalizationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), localizationType: asString(d.localization_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), riskLabel: asString(d.risk_label),
    statusKey: asStatus(d.status_key), itemType: "localization",
  };
}

function parseMarketEntry(raw: unknown): MarketEntryItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), marketKey: asString(d.market_key), marketName: asString(d.market_name),
    demandLabel: asString(d.demand_label), competitionLabel: asString(d.competition_label),
    regulationsLabel: asString(d.regulations_label), operationalComplexityLabel: asString(d.operational_complexity_label),
    investmentLabel: asString(d.investment_label), revenuePotentialLabel: asString(d.revenue_potential_label),
    sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), riskLabel: asString(d.risk_label),
    statusKey: asStatus(d.status_key), itemType: "market_entry",
  };
}

function parseReadiness(raw: unknown): ReadinessItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), readinessDimension: asString(d.readiness_dimension), dimensionName: asString(d.dimension_name),
    scoreLabel: asString(d.score_label), statusKey: asStatus(d.status_key), itemType: "readiness",
  };
}

function parseRegulatory(raw: unknown): RegulatoryItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), regulatoryType: asString(d.regulatory_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), riskLabel: asString(d.risk_label),
    statusKey: asStatus(d.status_key), itemType: "regulatory",
  };
}

function parseOperations(raw: unknown): OperationsItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), operationsType: asString(d.operations_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), riskLabel: asString(d.risk_label),
    statusKey: asStatus(d.status_key), itemType: "operations",
  };
}

function parseOpportunity(raw: unknown): ExpansionOpportunityItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), opportunityTitle: asString(d.opportunity_title), summary: asString(d.summary),
    sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), riskLabel: asString(d.risk_label),
    statusKey: asStatus(d.status_key), itemType: "expansion_opportunity",
  };
}

function parseExecutive(raw: unknown): ExecutiveExpansionMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

function parseCompanion(raw: unknown): CompanionExpansionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), advisorType: asString(d.advisor_type), question: asString(d.question),
    insight: asString(d.insight), reasoningLabel: asString(d.reasoning_label),
    evidenceLabel: asString(d.evidence_label), sourceLabel: asString(d.source_label),
    dateLabel: asString(d.date_label), confidenceLabel: asString(d.confidence_label),
    riskLabel: asString(d.risk_label), status: asString(d.status), itemType: "companion",
  };
}

function parseSimulation(raw: unknown): SimulationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), marketKey: asString(d.market_key), marketName: asString(d.market_name),
    bestCaseLabel: asString(d.best_case_label), expectedCaseLabel: asString(d.expected_case_label),
    worstCaseLabel: asString(d.worst_case_label), sourceLabel: asString(d.source_label),
    dateLabel: asString(d.date_label), confidenceLabel: asString(d.confidence_label),
    statusKey: asStatus(d.status_key), itemType: "simulation",
  };
}

const emptyCenter: GlobalExpansionIntelligenceCenter = {
  found: false,
  intelligenceSettings: { intelligenceEnabled: true, humanControlRequired: true },
  countryIntelligenceEngine: [],
  localizationIntelligence: [],
  marketEntryAnalysis: [],
  expansionReadinessEngine: [],
  regulatoryIntelligence: [],
  internationalOperationsIntelligence: [],
  expansionOpportunities: [],
  executiveExpansionDashboard: [],
  companionExpansionAdvisor: [],
  expansionSimulationEngine: [],
  sections: {
    expansion_overview: [], country_intelligence: [], localization_intelligence: [],
    regulatory_intelligence: [], market_entry_analysis: [], expansion_opportunities: [], expansion_roadmaps: [],
  },
  statistics: { countryCount: 0, localizationCount: 0, marketEntryCount: 0, regulatoryCount: 0, opportunityCount: 0, companionCount: 0 },
};

export function parseGlobalExpansionIntelligenceCenter(raw: unknown): GlobalExpansionIntelligenceCenter {
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
    expansionReadinessScore: asString(d.expansion_readiness_score) || undefined,
    intelligenceSettings: parseSettings(d.intelligence_settings),
    countryIntelligenceEngine: Array.isArray(d.country_intelligence_engine) ? d.country_intelligence_engine.map(parseCountry) : [],
    localizationIntelligence: Array.isArray(d.localization_intelligence) ? d.localization_intelligence.map(parseLocalization) : [],
    marketEntryAnalysis: Array.isArray(d.market_entry_analysis) ? d.market_entry_analysis.map(parseMarketEntry) : [],
    expansionReadinessEngine: Array.isArray(d.expansion_readiness_engine) ? d.expansion_readiness_engine.map(parseReadiness) : [],
    regulatoryIntelligence: Array.isArray(d.regulatory_intelligence) ? d.regulatory_intelligence.map(parseRegulatory) : [],
    internationalOperationsIntelligence: Array.isArray(d.international_operations_intelligence) ? d.international_operations_intelligence.map(parseOperations) : [],
    expansionOpportunities: Array.isArray(d.expansion_opportunities) ? d.expansion_opportunities.map(parseOpportunity) : [],
    executiveExpansionDashboard: Array.isArray(d.executive_expansion_dashboard) ? d.executive_expansion_dashboard.map(parseExecutive) : [],
    companionExpansionAdvisor: Array.isArray(d.companion_expansion_advisor) ? d.companion_expansion_advisor.map(parseCompanion) : [],
    expansionSimulationEngine: Array.isArray(d.expansion_simulation_engine) ? d.expansion_simulation_engine.map(parseSimulation) : [],
    sections: {
      expansion_overview: parseSections(sections.expansion_overview),
      country_intelligence: parseSections(sections.country_intelligence),
      localization_intelligence: parseSections(sections.localization_intelligence),
      regulatory_intelligence: parseSections(sections.regulatory_intelligence),
      market_entry_analysis: parseSections(sections.market_entry_analysis),
      expansion_opportunities: parseSections(sections.expansion_opportunities),
      expansion_roadmaps: parseSections(sections.expansion_roadmaps),
    },
    statistics: {
      countryCount: asNumber(stats.country_count),
      localizationCount: asNumber(stats.localization_count),
      marketEntryCount: asNumber(stats.market_entry_count),
      regulatoryCount: asNumber(stats.regulatory_count),
      opportunityCount: asNumber(stats.opportunity_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseGlobalExpansionIntelligenceAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
