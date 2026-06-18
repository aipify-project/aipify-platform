import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  DecisionIntelligenceCenter,
  DecisionOption,
  DecisionRiskItem,
  DecisionSectionKey,
  DecisionWorkspaceItem,
  ExecutiveAdvisorRecommendation,
  ExecutiveBriefing,
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

function parseDecision(raw: unknown): DecisionWorkspaceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    description: asString(d.description),
    owner: asString(d.owner ?? d.owner_label),
    businessArea: asString(d.business_area),
    priority: asString(d.priority, "medium"),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "active_decisions") as DecisionSectionKey,
    reasoning: asString(d.reasoning) || undefined,
    decisionDate: asString(d.decision_date) || null,
    outcomeSummary: asString(d.outcome_summary) || undefined,
    expectedResult: asString(d.expected_result) || undefined,
    actualResult: asString(d.actual_result) || undefined,
    itemType: "decision",
  };
}

function parseDecisions(raw: unknown): DecisionWorkspaceItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseDecision);
}

function parseOption(raw: unknown): DecisionOption {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    decisionId: asString(d.decision_id),
    optionKey: asString(d.option_key),
    label: asString(d.label),
    benefits: asString(d.benefits),
    risks: asString(d.risks),
    costLabel: asString(d.cost_label),
    complexity: asString(d.complexity),
    expectedOutcome: asString(d.expected_outcome),
    itemType: "option",
  };
}

function parseAdvisor(raw: unknown): ExecutiveAdvisorRecommendation {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    decisionId: asString(d.decision_id) || undefined,
    recommendation: asString(d.recommendation),
    reason: asString(d.reason),
    supportingEvidence: asString(d.supporting_evidence),
    confidenceLevel: asString(d.confidence_level),
    potentialRisks: asString(d.potential_risks),
    status: asString(d.status),
    itemType: "advisor",
  };
}

function parseRisk(raw: unknown): DecisionRiskItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    riskCategory: asString(d.risk_category),
    title: asString(d.title),
    summary: asString(d.summary),
    statusKey: asStatus(d.status_key),
    suggestedAction: asString(d.suggested_action) || undefined,
    itemType: "risk",
  };
}

function parseBriefing(raw: unknown): ExecutiveBriefing {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    briefingType: asString(d.briefing_type),
    title: asString(d.title),
    whatChanged: asString(d.what_changed),
    requiresAttention: asString(d.requires_attention),
    recommendedActions: asString(d.recommended_actions),
    generatedAt: asString(d.generated_at) || undefined,
    itemType: "briefing",
  };
}

export function parseDecisionIntelligenceCenter(raw: unknown): DecisionIntelligenceCenter {
  const d = asRecord(raw);
  if (!d.found) {
    return {
      found: false,
      sections: {
        activeDecisions: [],
        recommendedDecisions: [],
        strategicReviews: [],
        riskAnalysis: [],
        decisionHistory: [],
        outcomeTracking: [],
      },
      optionAnalysis: [],
      executiveAdvisor: [],
      executiveBriefings: [],
      statistics: {
        activeCount: 0,
        recommendedCount: 0,
        reviewCount: 0,
        riskCount: 0,
        historyCount: 0,
        outcomeCount: 0,
        advisorCount: 0,
      },
      error: asString(d.error) || undefined,
    };
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
    sections: {
      activeDecisions: parseDecisions(sections.active_decisions),
      recommendedDecisions: parseDecisions(sections.recommended_decisions),
      strategicReviews: parseDecisions(sections.strategic_reviews),
      riskAnalysis: Array.isArray(sections.risk_analysis) ? sections.risk_analysis.map(parseRisk) : [],
      decisionHistory: parseDecisions(sections.decision_history),
      outcomeTracking: parseDecisions(sections.outcome_tracking),
    },
    optionAnalysis: Array.isArray(d.option_analysis) ? d.option_analysis.map(parseOption) : [],
    executiveAdvisor: Array.isArray(d.executive_advisor) ? d.executive_advisor.map(parseAdvisor) : [],
    executiveBriefings: Array.isArray(d.executive_briefings) ? d.executive_briefings.map(parseBriefing) : [],
    statistics: {
      activeCount: asNumber(stats.active_count),
      recommendedCount: asNumber(stats.recommended_count),
      reviewCount: asNumber(stats.review_count),
      riskCount: asNumber(stats.risk_count),
      historyCount: asNumber(stats.history_count),
      outcomeCount: asNumber(stats.outcome_count),
      advisorCount: asNumber(stats.advisor_count),
    },
  };
}

export function parseDecisionIntelligenceAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
