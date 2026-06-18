import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  BusinessImprovementCenter,
  CompanionAdvisorItem,
  CostItem,
  CustomerExperienceItem,
  DiscoverySignal,
  ExecutiveImprovementDashboard,
  ImprovementPlan,
  ImprovementSectionItem,
  ImprovementSectionKey,
  ProcessItem,
  RevenueItem,
  ScoreLevel,
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

function asScore(value: unknown): ScoreLevel {
  const key = asString(value, "medium");
  const allowed: ScoreLevel[] = ["low", "medium", "high", "critical"];
  return allowed.includes(key as ScoreLevel) ? (key as ScoreLevel) : "medium";
}

function parseSection(raw: unknown): ImprovementSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    suggestedAction: asString(d.suggested_action),
    impactScore: asScore(d.impact_score),
    riskScore: asScore(d.risk_score),
    complexityScore: asScore(d.complexity_score),
    priorityLevel: asScore(d.priority_level),
    estimatedBenefit: asString(d.estimated_benefit),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "improvement_opportunities") as ImprovementSectionKey,
    itemType: "section",
  };
}

function parseSections(raw: unknown): ImprovementSectionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseSection);
}

function parseDiscovery(raw: unknown): DiscoverySignal {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    analysisDomain: asString(d.analysis_domain),
    signalType: asString(d.signal_type),
    title: asString(d.title),
    summary: asString(d.summary),
    statusKey: asStatus(d.status_key),
    itemType: "discovery",
  };
}

function parseRevenue(raw: unknown): RevenueItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    opportunityType: asString(d.opportunity_type),
    title: asString(d.title),
    summary: asString(d.summary),
    suggestedAction: asString(d.suggested_action),
    customerCount: asNumber(d.customer_count),
    statusKey: asStatus(d.status_key),
    itemType: "revenue",
  };
}

function parseCost(raw: unknown): CostItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    costType: asString(d.cost_type),
    title: asString(d.title),
    summary: asString(d.summary),
    potentialSavingsLabel: asString(d.potential_savings_label),
    statusKey: asStatus(d.status_key),
    itemType: "cost",
  };
}

function parseProcess(raw: unknown): ProcessItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    workflowType: asString(d.workflow_type),
    title: asString(d.title),
    summary: asString(d.summary),
    timeReductionLabel: asString(d.time_reduction_label),
    statusKey: asStatus(d.status_key),
    itemType: "process",
  };
}

function parseCx(raw: unknown): CustomerExperienceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    metricType: asString(d.metric_type),
    title: asString(d.title),
    summary: asString(d.summary),
    benchmarkLabel: asString(d.benchmark_label),
    statusKey: asStatus(d.status_key),
    itemType: "cx",
  };
}

function parsePlan(raw: unknown): ImprovementPlan {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    problem: asString(d.problem),
    cause: asString(d.cause),
    recommendedSolution: asString(d.recommended_solution),
    expectedOutcome: asString(d.expected_outcome),
    estimatedBenefit: asString(d.estimated_benefit),
    impactScore: asScore(d.impact_score),
    riskScore: asScore(d.risk_score),
    complexityScore: asScore(d.complexity_score),
    priorityLevel: asScore(d.priority_level),
    status: asString(d.status),
    itemType: "plan",
  };
}

function parseAdvisor(raw: unknown): CompanionAdvisorItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    recommendationType: asString(d.recommendation_type),
    recommendation: asString(d.recommendation),
    reason: asString(d.reason),
    status: asString(d.status),
    itemType: "advisor",
  };
}

function parseExecutiveDashboard(raw: unknown): ExecutiveImprovementDashboard {
  const d = asRecord(raw);
  return {
    totalOpportunities: asNumber(d.total_opportunities),
    estimatedRevenueGain: asString(d.estimated_revenue_gain),
    estimatedCostSavings: asString(d.estimated_cost_savings),
    completedImprovements: asNumber(d.completed_improvements),
    pendingImprovements: asNumber(d.pending_improvements),
  };
}

const emptyCenter: BusinessImprovementCenter = {
  found: false,
  executiveDashboard: {
    totalOpportunities: 0,
    estimatedRevenueGain: "",
    estimatedCostSavings: "",
    completedImprovements: 0,
    pendingImprovements: 0,
  },
  sections: {
    improvementOpportunities: [],
    recommendedActions: [],
    revenueOpportunities: [],
    costSavings: [],
    processImprovements: [],
    customerExperienceImprovements: [],
    completedImprovements: [],
  },
  opportunityDiscovery: [],
  revenueIntelligence: [],
  costOptimization: [],
  processOptimization: [],
  customerExperience: [],
  improvementPlans: [],
  companionAdvisor: [],
  statistics: {
    opportunityCount: 0,
    discoveryCount: 0,
    revenueCount: 0,
    costCount: 0,
    planCount: 0,
    advisorCount: 0,
    completedCount: 0,
  },
};

export function parseBusinessImprovementCenter(raw: unknown): BusinessImprovementCenter {
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
    executiveDashboard: parseExecutiveDashboard(d.executive_dashboard),
    sections: {
      improvementOpportunities: parseSections(sections.improvement_opportunities),
      recommendedActions: parseSections(sections.recommended_actions),
      revenueOpportunities: parseSections(sections.revenue_opportunities),
      costSavings: parseSections(sections.cost_savings),
      processImprovements: parseSections(sections.process_improvements),
      customerExperienceImprovements: parseSections(sections.customer_experience_improvements),
      completedImprovements: parseSections(sections.completed_improvements),
    },
    opportunityDiscovery: Array.isArray(d.opportunity_discovery) ? d.opportunity_discovery.map(parseDiscovery) : [],
    revenueIntelligence: Array.isArray(d.revenue_intelligence) ? d.revenue_intelligence.map(parseRevenue) : [],
    costOptimization: Array.isArray(d.cost_optimization) ? d.cost_optimization.map(parseCost) : [],
    processOptimization: Array.isArray(d.process_optimization) ? d.process_optimization.map(parseProcess) : [],
    customerExperience: Array.isArray(d.customer_experience) ? d.customer_experience.map(parseCx) : [],
    improvementPlans: Array.isArray(d.improvement_plans) ? d.improvement_plans.map(parsePlan) : [],
    companionAdvisor: Array.isArray(d.companion_advisor) ? d.companion_advisor.map(parseAdvisor) : [],
    statistics: {
      opportunityCount: asNumber(stats.opportunity_count),
      discoveryCount: asNumber(stats.discovery_count),
      revenueCount: asNumber(stats.revenue_count),
      costCount: asNumber(stats.cost_count),
      planCount: asNumber(stats.plan_count),
      advisorCount: asNumber(stats.advisor_count),
      completedCount: asNumber(stats.completed_count),
    },
  };
}

export function parseBusinessImprovementAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
