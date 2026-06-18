import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  BenchmarkItem,
  BusinessPackItem,
  CompetitiveItem,
  CompanionIndustryItem,
  ExecutiveIndustryMetric,
  IndustryIntelligenceCenter,
  IndustryProfile,
  IndustrySectionItem,
  IndustrySectionKey,
  IntelligenceSettings,
  MarketMonitoringItem,
  OpportunityItem,
  RegulatoryItem,
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

function parseSection(raw: unknown): IndustrySectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "industry_overview") as IndustrySectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): IndustrySectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseSettings(raw: unknown): IntelligenceSettings {
  const d = asRecord(raw);
  return {
    intelligenceEnabled: asBool(d.intelligence_enabled, true),
    humanControlRequired: asBool(d.human_control_required, true),
  };
}

function parseProfile(raw: unknown): IndustryProfile {
  const d = asRecord(raw);
  return {
    id: asString(d.id), industryKey: asString(d.industry_key), industryName: asString(d.industry_name),
    signalLabel: asString(d.signal_label), benchmarkLabel: asString(d.benchmark_label),
    trendLabel: asString(d.trend_label), riskLabel: asString(d.risk_label),
    opportunityLabel: asString(d.opportunity_label), statusKey: asStatus(d.status_key), itemType: "profile",
  };
}

function parseMarket(raw: unknown): MarketMonitoringItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), monitoringType: asString(d.monitoring_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), relevanceLabel: asString(d.relevance_label),
    statusKey: asStatus(d.status_key), itemType: "market_monitoring",
  };
}

function parseCompetitive(raw: unknown): CompetitiveItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), competitiveType: asString(d.competitive_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), relevanceLabel: asString(d.relevance_label),
    statusKey: asStatus(d.status_key), itemType: "competitive",
  };
}

function parseRegulatory(raw: unknown): RegulatoryItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), regulatoryType: asString(d.regulatory_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), relevanceLabel: asString(d.relevance_label),
    statusKey: asStatus(d.status_key), itemType: "regulatory",
  };
}

function parseBenchmark(raw: unknown): BenchmarkItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), benchmarkType: asString(d.benchmark_type), title: asString(d.title),
    comparisonLabel: asString(d.comparison_label), sourceLabel: asString(d.source_label),
    dateLabel: asString(d.date_label), confidenceLabel: asString(d.confidence_label),
    statusKey: asStatus(d.status_key), itemType: "benchmark",
  };
}

function parseOpportunity(raw: unknown): OpportunityItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), opportunityType: asString(d.opportunity_type), title: asString(d.title),
    summary: asString(d.summary), sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), relevanceLabel: asString(d.relevance_label),
    statusKey: asStatus(d.status_key), itemType: "opportunity",
  };
}

function parseExecutive(raw: unknown): ExecutiveIndustryMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

function parseCompanion(raw: unknown): CompanionIndustryItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), advisorType: asString(d.advisor_type), question: asString(d.question),
    insight: asString(d.insight), evidenceLabel: asString(d.evidence_label),
    sourceLabel: asString(d.source_label), dateLabel: asString(d.date_label),
    confidenceLabel: asString(d.confidence_label), status: asString(d.status), itemType: "companion",
  };
}

function parseBusinessPack(raw: unknown): BusinessPackItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), packKey: asString(d.pack_key), packName: asString(d.pack_name),
    enrichmentLabel: asString(d.enrichment_label), statusKey: asStatus(d.status_key), itemType: "business_pack",
  };
}

const emptyCenter: IndustryIntelligenceCenter = {
  found: false,
  intelligenceSettings: { intelligenceEnabled: true, humanControlRequired: true },
  industryProfiles: [],
  marketMonitoringEngine: [],
  competitiveIntelligence: [],
  regulatoryIntelligence: [],
  industryBenchmarkEngine: [],
  opportunityDetection: [],
  executiveIndustryDashboard: [],
  companionIndustryAdvisor: [],
  businessPackAwareness: [],
  sections: {
    industry_overview: [], market_trends: [], regulatory_changes: [],
    competitive_intelligence: [], emerging_opportunities: [], industry_risks: [], industry_benchmarks: [],
  },
  statistics: { profileCount: 0, marketCount: 0, competitiveCount: 0, regulatoryCount: 0, opportunityCount: 0, companionCount: 0 },
};

export function parseIndustryIntelligenceCenter(raw: unknown): IndustryIntelligenceCenter {
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
    industryProfiles: Array.isArray(d.industry_profiles) ? d.industry_profiles.map(parseProfile) : [],
    marketMonitoringEngine: Array.isArray(d.market_monitoring_engine) ? d.market_monitoring_engine.map(parseMarket) : [],
    competitiveIntelligence: Array.isArray(d.competitive_intelligence) ? d.competitive_intelligence.map(parseCompetitive) : [],
    regulatoryIntelligence: Array.isArray(d.regulatory_intelligence) ? d.regulatory_intelligence.map(parseRegulatory) : [],
    industryBenchmarkEngine: Array.isArray(d.industry_benchmark_engine) ? d.industry_benchmark_engine.map(parseBenchmark) : [],
    opportunityDetection: Array.isArray(d.opportunity_detection) ? d.opportunity_detection.map(parseOpportunity) : [],
    executiveIndustryDashboard: Array.isArray(d.executive_industry_dashboard) ? d.executive_industry_dashboard.map(parseExecutive) : [],
    companionIndustryAdvisor: Array.isArray(d.companion_industry_advisor) ? d.companion_industry_advisor.map(parseCompanion) : [],
    businessPackAwareness: Array.isArray(d.business_pack_awareness) ? d.business_pack_awareness.map(parseBusinessPack) : [],
    sections: {
      industry_overview: parseSections(sections.industry_overview),
      market_trends: parseSections(sections.market_trends),
      regulatory_changes: parseSections(sections.regulatory_changes),
      competitive_intelligence: parseSections(sections.competitive_intelligence),
      emerging_opportunities: parseSections(sections.emerging_opportunities),
      industry_risks: parseSections(sections.industry_risks),
      industry_benchmarks: parseSections(sections.industry_benchmarks),
    },
    statistics: {
      profileCount: asNumber(stats.profile_count),
      marketCount: asNumber(stats.market_count),
      competitiveCount: asNumber(stats.competitive_count),
      regulatoryCount: asNumber(stats.regulatory_count),
      opportunityCount: asNumber(stats.opportunity_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseIndustryIntelligenceAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
