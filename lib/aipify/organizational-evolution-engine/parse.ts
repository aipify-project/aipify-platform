import type {
  EvolutionAdvisorSignal,
  EvolutionApprovedImprovement,
  EvolutionImprovementOpportunity,
  EvolutionIntelligenceSignal,
  EvolutionKnowledgeItem,
  EvolutionLearningSignal,
  EvolutionOperationalLearning,
  EvolutionPattern,
  EvolutionWorkflowItem,
  OrganizationalEvolutionCenter,
} from "./types";

function parseLearningSignal(raw: unknown): EvolutionLearningSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_key: typeof d.signal_key === "string" ? d.signal_key : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    signal_title: typeof d.signal_title === "string" ? d.signal_title : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    source_summary: typeof d.source_summary === "string" ? d.source_summary : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseOpportunity(raw: unknown): EvolutionImprovementOpportunity {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    opportunity_key: typeof d.opportunity_key === "string" ? d.opportunity_key : undefined,
    opportunity_title: typeof d.opportunity_title === "string" ? d.opportunity_title : undefined,
    opportunity_type: typeof d.opportunity_type === "string" ? d.opportunity_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    evolution_status: typeof d.evolution_status === "string" ? d.evolution_status : undefined,
  };
}

function parseLearning(raw: unknown): EvolutionOperationalLearning {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    learning_key: typeof d.learning_key === "string" ? d.learning_key : undefined,
    learning_title: typeof d.learning_title === "string" ? d.learning_title : undefined,
    learning_type: typeof d.learning_type === "string" ? d.learning_type : undefined,
    outcome_summary: typeof d.outcome_summary === "string" ? d.outcome_summary : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseKnowledge(raw: unknown): EvolutionKnowledgeItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    knowledge_key: typeof d.knowledge_key === "string" ? d.knowledge_key : undefined,
    knowledge_title: typeof d.knowledge_title === "string" ? d.knowledge_title : undefined,
    knowledge_status: typeof d.knowledge_status === "string" ? d.knowledge_status : undefined,
    accuracy_score: Number(d.accuracy_score ?? 0),
    ownership: typeof d.ownership === "string" ? d.ownership : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
  };
}

function parseWorkflow(raw: unknown): EvolutionWorkflowItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    workflow_key: typeof d.workflow_key === "string" ? d.workflow_key : undefined,
    workflow_title: typeof d.workflow_title === "string" ? d.workflow_title : undefined,
    workflow_status: typeof d.workflow_status === "string" ? d.workflow_status : undefined,
    success_rate_percent: Number(d.success_rate_percent ?? 0),
    observation: typeof d.observation === "string" ? d.observation : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
  };
}

function parsePattern(raw: unknown): EvolutionPattern {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    pattern_key: typeof d.pattern_key === "string" ? d.pattern_key : undefined,
    pattern_title: typeof d.pattern_title === "string" ? d.pattern_title : undefined,
    pattern_type: typeof d.pattern_type === "string" ? d.pattern_type : undefined,
    frequency: typeof d.frequency === "string" ? d.frequency : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
  };
}

function parseApproved(raw: unknown): EvolutionApprovedImprovement {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    improvement_key: typeof d.improvement_key === "string" ? d.improvement_key : undefined,
    improvement_title: typeof d.improvement_title === "string" ? d.improvement_title : undefined,
    improvement_type: typeof d.improvement_type === "string" ? d.improvement_type : undefined,
    evolution_status: typeof d.evolution_status === "string" ? d.evolution_status : undefined,
    outcome_summary: typeof d.outcome_summary === "string" ? d.outcome_summary : undefined,
    business_impact: typeof d.business_impact === "string" ? d.business_impact : undefined,
    rollout_status: typeof d.rollout_status === "string" ? d.rollout_status : undefined,
  };
}

function parseIntelligence(raw: unknown): EvolutionIntelligenceSignal {
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

function parseAdvisor(raw: unknown): EvolutionAdvisorSignal {
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

export function parseOrganizationalEvolutionCenter(raw: unknown): OrganizationalEvolutionCenter {
  const d = (raw ?? {}) as Record<string, unknown>;

  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    learning_route: typeof d.learning_route === "string" ? d.learning_route : undefined,
    approvals_route: typeof d.approvals_route === "string" ? d.approvals_route : undefined,
    knowledge_route: typeof d.knowledge_route === "string" ? d.knowledge_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: (d.overview as Record<string, unknown>) ?? {},
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    evolution_statuses: Array.isArray(d.evolution_statuses)
      ? (d.evolution_statuses as Array<{ key?: string; label?: string }>)
      : [],
    learning_signals: Array.isArray(d.learning_signals) ? d.learning_signals.map(parseLearningSignal) : [],
    improvement_opportunities: Array.isArray(d.improvement_opportunities)
      ? d.improvement_opportunities.map(parseOpportunity)
      : [],
    operational_learnings: Array.isArray(d.operational_learnings)
      ? d.operational_learnings.map(parseLearning)
      : [],
    knowledge_evolution: Array.isArray(d.knowledge_evolution) ? d.knowledge_evolution.map(parseKnowledge) : [],
    workflow_evolution: Array.isArray(d.workflow_evolution) ? d.workflow_evolution.map(parseWorkflow) : [],
    patterns: Array.isArray(d.patterns) ? d.patterns.map(parsePattern) : [],
    approved_improvements: Array.isArray(d.approved_improvements)
      ? d.approved_improvements.map(parseApproved)
      : [],
    intelligence_signals: Array.isArray(d.intelligence_signals)
      ? d.intelligence_signals.map(parseIntelligence)
      : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseAdvisor) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    executive_dashboard: (d.executive_dashboard as Record<string, unknown>) ?? {},
    governance: (d.governance as Record<string, unknown>) ?? {},
  };
}
