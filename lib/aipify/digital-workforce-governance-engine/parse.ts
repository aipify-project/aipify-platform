import type {
  ActionAuthorityEntry,
  ApprovalPolicy,
  AuthorityAssignment,
  AuthorityLevel,
  DecisionLog,
  DigitalWorkforceGovernanceCenter,
  EscalationRule,
  GovernanceAdvisorSignal,
  GovernancePolicy,
  GovernanceReview,
  RiskEvent,
} from "./types";

function parseLevel(raw: unknown): AuthorityLevel {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    level_number: Number(d.level_number ?? 0),
    level_key: typeof d.level_key === "string" ? d.level_key : undefined,
    level_name: typeof d.level_name === "string" ? d.level_name : undefined,
    level_description: typeof d.level_description === "string" ? d.level_description : undefined,
    automation_permitted: Boolean(d.automation_permitted),
  };
}

function parseAssignment(raw: unknown): AuthorityAssignment {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    assignment_key: typeof d.assignment_key === "string" ? d.assignment_key : undefined,
    employee_name: typeof d.employee_name === "string" ? d.employee_name : undefined,
    department: typeof d.department === "string" ? d.department : undefined,
    authority_level: Number(d.authority_level ?? 0),
    assignment_status: typeof d.assignment_status === "string" ? d.assignment_status : undefined,
  };
}

function parsePolicy(raw: unknown): GovernancePolicy {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    policy_key: typeof d.policy_key === "string" ? d.policy_key : undefined,
    policy_name: typeof d.policy_name === "string" ? d.policy_name : undefined,
    policy_type: typeof d.policy_type === "string" ? d.policy_type : undefined,
    policy_status: typeof d.policy_status === "string" ? d.policy_status : undefined,
    risk_class: typeof d.risk_class === "string" ? d.risk_class : undefined,
    requires_approval: Boolean(d.requires_approval),
  };
}

function parseApproval(raw: unknown): ApprovalPolicy {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    approval_key: typeof d.approval_key === "string" ? d.approval_key : undefined,
    approval_name: typeof d.approval_name === "string" ? d.approval_name : undefined,
    approval_type: typeof d.approval_type === "string" ? d.approval_type : undefined,
    approval_status: typeof d.approval_status === "string" ? d.approval_status : undefined,
    steps: d.steps,
  };
}

function parseMatrixEntry(raw: unknown): ActionAuthorityEntry {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    action_key: typeof d.action_key === "string" ? d.action_key : undefined,
    action_name: typeof d.action_name === "string" ? d.action_name : undefined,
    action_category: typeof d.action_category === "string" ? d.action_category : undefined,
    min_authority_level: Number(d.min_authority_level ?? 0),
    risk_class: typeof d.risk_class === "string" ? d.risk_class : undefined,
    requires_human_approval: Boolean(d.requires_human_approval),
  };
}

function parseEscalation(raw: unknown): EscalationRule {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    rule_key: typeof d.rule_key === "string" ? d.rule_key : undefined,
    rule_name: typeof d.rule_name === "string" ? d.rule_name : undefined,
    escalation_type: typeof d.escalation_type === "string" ? d.escalation_type : undefined,
    trigger_condition: typeof d.trigger_condition === "string" ? d.trigger_condition : undefined,
    target_role: typeof d.target_role === "string" ? d.target_role : undefined,
    rule_status: typeof d.rule_status === "string" ? d.rule_status : undefined,
  };
}

function parseDecision(raw: unknown): DecisionLog {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    log_key: typeof d.log_key === "string" ? d.log_key : undefined,
    decision_type: typeof d.decision_type === "string" ? d.decision_type : undefined,
    employee_name: typeof d.employee_name === "string" ? d.employee_name : undefined,
    action_name: typeof d.action_name === "string" ? d.action_name : undefined,
    decision_status: typeof d.decision_status === "string" ? d.decision_status : undefined,
    risk_class: typeof d.risk_class === "string" ? d.risk_class : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseRisk(raw: unknown): RiskEvent {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    event_key: typeof d.event_key === "string" ? d.event_key : undefined,
    event_title: typeof d.event_title === "string" ? d.event_title : undefined,
    risk_class: typeof d.risk_class === "string" ? d.risk_class : undefined,
    event_status: typeof d.event_status === "string" ? d.event_status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseReview(raw: unknown): GovernanceReview {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    review_key: typeof d.review_key === "string" ? d.review_key : undefined,
    review_title: typeof d.review_title === "string" ? d.review_title : undefined,
    review_type: typeof d.review_type === "string" ? d.review_type : undefined,
    review_status: typeof d.review_status === "string" ? d.review_status : undefined,
    due_at: typeof d.due_at === "string" ? d.due_at : undefined,
  };
}

function parseSignal(raw: unknown): GovernanceAdvisorSignal {
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

export function parseDigitalWorkforceGovernanceCenter(raw: unknown): DigitalWorkforceGovernanceCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    lifecycle_route: typeof d.lifecycle_route === "string" ? d.lifecycle_route : undefined,
    value_route: typeof d.value_route === "string" ? d.value_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    authority_levels: Array.isArray(d.authority_levels) ? d.authority_levels.map(parseLevel) : [],
    authority_assignments: Array.isArray(d.authority_assignments) ? d.authority_assignments.map(parseAssignment) : [],
    policies: Array.isArray(d.policies) ? d.policies.map(parsePolicy) : [],
    approval_policies: Array.isArray(d.approval_policies) ? d.approval_policies.map(parseApproval) : [],
    action_authority_matrix: Array.isArray(d.action_authority_matrix) ? d.action_authority_matrix.map(parseMatrixEntry) : [],
    escalation_rules: Array.isArray(d.escalation_rules) ? d.escalation_rules.map(parseEscalation) : [],
    decision_logs: Array.isArray(d.decision_logs) ? d.decision_logs.map(parseDecision) : [],
    risk_events: Array.isArray(d.risk_events) ? d.risk_events.map(parseRisk) : [],
    governance_reviews: Array.isArray(d.governance_reviews) ? d.governance_reviews.map(parseReview) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
