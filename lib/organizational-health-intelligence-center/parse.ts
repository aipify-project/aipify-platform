import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  CompanionIntervention,
  EarlyWarningSignal,
  ExecutiveWarningItem,
  HealthCategoryScore,
  HealthLevel,
  HealthSectionItem,
  HealthSectionKey,
  OrganizationalHealthIntelligenceCenter,
  OrganizationHealthScore,
  PredictiveRiskItem,
  ProjectHealthItem,
  TrendDirection,
  TrendWindow,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = [
    "completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting",
  ];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function asHealthLevel(value: unknown): HealthLevel {
  const key = asString(value, "stable");
  const allowed: HealthLevel[] = ["healthy", "stable", "requires_attention", "critical"];
  return allowed.includes(key as HealthLevel) ? (key as HealthLevel) : "stable";
}

function parseOrgScore(raw: unknown): OrganizationHealthScore {
  const d = asRecord(raw);
  return {
    scoreValue: asNumber(d.score_value),
    healthLevel: asHealthLevel(d.health_level),
    statusKey: asStatus(d.status_key),
  };
}

function parseCategoryScore(raw: unknown): HealthCategoryScore {
  const d = asRecord(raw);
  return {
    categoryKey: asString(d.category_key, "operations") as HealthCategoryScore["categoryKey"],
    scoreValue: asNumber(d.score_value),
    healthLevel: asHealthLevel(d.health_level),
    statusKey: asStatus(d.status_key),
    contributingFactors: asString(d.contributing_factors),
    itemType: "score",
  };
}

function parseSectionItem(raw: unknown): HealthSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    statusKey: asStatus(d.status_key),
    detailLabel: asString(d.detail_label),
    trendWindow: asString(d.trend_window) as TrendWindow,
    trendDirection: asString(d.trend_direction) as TrendDirection,
    sectionKey: asString(d.section_key, "health_overview") as HealthSectionKey,
    itemType: "section",
  };
}

function parseSections(raw: unknown): HealthSectionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseSectionItem);
}

function parseSignal(raw: unknown): EarlyWarningSignal {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    signalType: asString(d.signal_type),
    title: asString(d.title),
    summary: asString(d.summary),
    statusKey: asStatus(d.status_key),
    trendPctLabel: asString(d.trend_pct_label),
    itemType: "signal",
  };
}

function parseProject(raw: unknown): ProjectHealthItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    projectStatus: asString(d.project_status),
    timelineHealth: asString(d.timeline_health),
    dependencyHealth: asString(d.dependency_health),
    resourceHealth: asString(d.resource_health),
    summary: asString(d.summary),
    statusKey: asStatus(d.status_key),
    itemType: "project",
  };
}

function parseWarning(raw: unknown): ExecutiveWarningItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    warningTier: asString(d.warning_tier, "emerging") as ExecutiveWarningItem["warningTier"],
    title: asString(d.title),
    summary: asString(d.summary),
    impactLevel: asString(d.impact_level),
    priorityRank: asNumber(d.priority_rank),
    statusKey: asStatus(d.status_key),
    itemType: "warning",
  };
}

function parseIntervention(raw: unknown): CompanionIntervention {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    recommendation: asString(d.recommendation),
    reason: asString(d.reason),
    interventionType: asString(d.intervention_type),
    status: asString(d.status),
    itemType: "intervention",
  };
}

function parsePredictive(raw: unknown): PredictiveRiskItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    riskLabel: asString(d.risk_label),
    probability: asString(d.probability),
    impact: asString(d.impact),
    urgency: asString(d.urgency),
    summary: asString(d.summary),
    contributingFactors: asString(d.contributing_factors),
    statusKey: asStatus(d.status_key),
    itemType: "predictive",
  };
}

const emptyCenter: OrganizationalHealthIntelligenceCenter = {
  found: false,
  organizationHealthScore: { scoreValue: 0, healthLevel: "stable", statusKey: "information" },
  healthScores: [],
  earlyWarningSignals: [],
  sections: {
    healthOverview: [],
    riskSignals: [],
    performanceTrends: [],
    teamHealth: [],
    customerHealth: [],
    operationalHealth: [],
    financialHealth: [],
  },
  projectHealth: [],
  executiveWarnings: [],
  companionInterventions: [],
  predictiveRisks: [],
  statistics: {
    scoreCount: 0,
    signalCount: 0,
    warningCount: 0,
    interventionCount: 0,
    projectCount: 0,
    predictiveCount: 0,
  },
};

export function parseOrganizationalHealthIntelligenceCenter(raw: unknown): OrganizationalHealthIntelligenceCenter {
  const d = asRecord(raw);
  if (!d.found) {
    return { ...emptyCenter, error: asString(d.error) || undefined };
  }

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    organizationHealthScore: parseOrgScore(d.organization_health_score),
    healthScores: Array.isArray(d.health_scores) ? d.health_scores.map(parseCategoryScore) : [],
    earlyWarningSignals: Array.isArray(d.early_warning_signals) ? d.early_warning_signals.map(parseSignal) : [],
    sections: {
      healthOverview: parseSections(sections.health_overview),
      riskSignals: parseSections(sections.risk_signals),
      performanceTrends: parseSections(sections.performance_trends),
      teamHealth: parseSections(sections.team_health),
      customerHealth: parseSections(sections.customer_health),
      operationalHealth: parseSections(sections.operational_health),
      financialHealth: parseSections(sections.financial_health),
    },
    projectHealth: Array.isArray(d.project_health) ? d.project_health.map(parseProject) : [],
    executiveWarnings: Array.isArray(d.executive_warnings) ? d.executive_warnings.map(parseWarning) : [],
    companionInterventions: Array.isArray(d.companion_interventions) ? d.companion_interventions.map(parseIntervention) : [],
    predictiveRisks: Array.isArray(d.predictive_risks) ? d.predictive_risks.map(parsePredictive) : [],
    statistics: {
      scoreCount: asNumber(stats.score_count),
      signalCount: asNumber(stats.signal_count),
      warningCount: asNumber(stats.warning_count),
      interventionCount: asNumber(stats.intervention_count),
      projectCount: asNumber(stats.project_count),
      predictiveCount: asNumber(stats.predictive_count),
    },
  };
}

export function parseOrganizationalHealthIntelligenceAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
