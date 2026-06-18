import type {
  AutonomousAdvisorSignal,
  AutonomousApprovalQueueItem,
  AutonomousEnterpriseOperationsCenter,
  AutonomousImprovement,
  AutonomousIntelligenceSignal,
  AutonomousOpportunity,
  AutonomousPlan,
  AutonomousProactiveItem,
  AutonomousRecommendation,
  AutonomousRisk,
  AutonomousWorkflow,
} from "./types";

function parseOpportunity(raw: unknown): AutonomousOpportunity {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    opportunity_key: typeof d.opportunity_key === "string" ? d.opportunity_key : undefined,
    opportunity_title: typeof d.opportunity_title === "string" ? d.opportunity_title : undefined,
    opportunity_type: typeof d.opportunity_type === "string" ? d.opportunity_type : undefined,
    impact_summary: typeof d.impact_summary === "string" ? d.impact_summary : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseRisk(raw: unknown): AutonomousRisk {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    risk_key: typeof d.risk_key === "string" ? d.risk_key : undefined,
    risk_title: typeof d.risk_title === "string" ? d.risk_title : undefined,
    risk_type: typeof d.risk_type === "string" ? d.risk_type : undefined,
    severity: typeof d.severity === "string" ? d.severity : undefined,
    impact_summary: typeof d.impact_summary === "string" ? d.impact_summary : undefined,
    mitigation_recommendation:
      typeof d.mitigation_recommendation === "string" ? d.mitigation_recommendation : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parsePlan(raw: unknown): AutonomousPlan {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    plan_key: typeof d.plan_key === "string" ? d.plan_key : undefined,
    plan_title: typeof d.plan_title === "string" ? d.plan_title : undefined,
    plan_type: typeof d.plan_type === "string" ? d.plan_type : undefined,
    plan_summary: typeof d.plan_summary === "string" ? d.plan_summary : undefined,
    steps: d.steps,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseRecommendation(raw: unknown): AutonomousRecommendation {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    recommendation_key: typeof d.recommendation_key === "string" ? d.recommendation_key : undefined,
    recommendation_title: typeof d.recommendation_title === "string" ? d.recommendation_title : undefined,
    recommendation_type: typeof d.recommendation_type === "string" ? d.recommendation_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseWorkflow(raw: unknown): AutonomousWorkflow {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    workflow_key: typeof d.workflow_key === "string" ? d.workflow_key : undefined,
    workflow_title: typeof d.workflow_title === "string" ? d.workflow_title : undefined,
    coordination_type: typeof d.coordination_type === "string" ? d.coordination_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    participants: d.participants,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseProactiveItem(raw: unknown): AutonomousProactiveItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    item_key: typeof d.item_key === "string" ? d.item_key : undefined,
    item_title: typeof d.item_title === "string" ? d.item_title : undefined,
    item_type: typeof d.item_type === "string" ? d.item_type : undefined,
    priority: typeof d.priority === "string" ? d.priority : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    assigned_to: typeof d.assigned_to === "string" ? d.assigned_to : undefined,
  };
}

function parseApproval(raw: unknown): AutonomousApprovalQueueItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    queue_key: typeof d.queue_key === "string" ? d.queue_key : undefined,
    queue_title: typeof d.queue_title === "string" ? d.queue_title : undefined,
    approval_type: typeof d.approval_type === "string" ? d.approval_type : undefined,
    autonomy_level_required: Number(d.autonomy_level_required ?? 0),
    status: typeof d.status === "string" ? d.status : undefined,
    risk_level: typeof d.risk_level === "string" ? d.risk_level : undefined,
  };
}

function parseIntelligence(raw: unknown): AutonomousIntelligenceSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseAdvisor(raw: unknown): AutonomousAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseImprovement(raw: unknown): AutonomousImprovement {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    improvement_key: typeof d.improvement_key === "string" ? d.improvement_key : undefined,
    improvement_title: typeof d.improvement_title === "string" ? d.improvement_title : undefined,
    improvement_type: typeof d.improvement_type === "string" ? d.improvement_type : undefined,
    outcome_summary: typeof d.outcome_summary === "string" ? d.outcome_summary : undefined,
    business_impact: typeof d.business_impact === "string" ? d.business_impact : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

export function parseAutonomousEnterpriseOperationsCenter(
  raw: unknown
): AutonomousEnterpriseOperationsCenter {
  const d = (raw ?? {}) as Record<string, unknown>;

  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    approvals_route: typeof d.approvals_route === "string" ? d.approvals_route : undefined,
    actions_route: typeof d.actions_route === "string" ? d.actions_route : undefined,
    command_center_route: typeof d.command_center_route === "string" ? d.command_center_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: (d.overview as Record<string, unknown>) ?? {},
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    autonomy_levels: Array.isArray(d.autonomy_levels)
      ? (d.autonomy_levels as Array<{ level?: number; label?: string }>)
      : [],
    opportunities: Array.isArray(d.opportunities) ? d.opportunities.map(parseOpportunity) : [],
    risks: Array.isArray(d.risks) ? d.risks.map(parseRisk) : [],
    plans: Array.isArray(d.plans) ? d.plans.map(parsePlan) : [],
    recommendations: Array.isArray(d.recommendations) ? d.recommendations.map(parseRecommendation) : [],
    workflows: Array.isArray(d.workflows) ? d.workflows.map(parseWorkflow) : [],
    proactive_items: Array.isArray(d.proactive_items) ? d.proactive_items.map(parseProactiveItem) : [],
    approval_queue: Array.isArray(d.approval_queue) ? d.approval_queue.map(parseApproval) : [],
    intelligence_signals: Array.isArray(d.intelligence_signals)
      ? d.intelligence_signals.map(parseIntelligence)
      : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseAdvisor) : [],
    improvements: Array.isArray(d.improvements) ? d.improvements.map(parseImprovement) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    executive_dashboard: (d.executive_dashboard as Record<string, unknown>) ?? {},
    governance: (d.governance as Record<string, unknown>) ?? {},
  };
}
