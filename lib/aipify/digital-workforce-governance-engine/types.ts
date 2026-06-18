export type AuthorityLevel = {
  id?: string;
  level_number?: number;
  level_key?: string;
  level_name?: string;
  level_description?: string;
  automation_permitted?: boolean;
  [key: string]: unknown;
};

export type AuthorityAssignment = {
  id?: string;
  assignment_key?: string;
  employee_name?: string;
  department?: string;
  authority_level?: number;
  assignment_status?: string;
  [key: string]: unknown;
};

export type GovernancePolicy = {
  id?: string;
  policy_key?: string;
  policy_name?: string;
  policy_type?: string;
  policy_status?: string;
  risk_class?: string;
  requires_approval?: boolean;
  [key: string]: unknown;
};

export type ApprovalPolicy = {
  id?: string;
  approval_key?: string;
  approval_name?: string;
  approval_type?: string;
  approval_status?: string;
  steps?: unknown;
  [key: string]: unknown;
};

export type ActionAuthorityEntry = {
  id?: string;
  action_key?: string;
  action_name?: string;
  action_category?: string;
  min_authority_level?: number;
  risk_class?: string;
  requires_human_approval?: boolean;
  [key: string]: unknown;
};

export type EscalationRule = {
  id?: string;
  rule_key?: string;
  rule_name?: string;
  escalation_type?: string;
  trigger_condition?: string;
  target_role?: string;
  rule_status?: string;
  [key: string]: unknown;
};

export type DecisionLog = {
  id?: string;
  log_key?: string;
  decision_type?: string;
  employee_name?: string;
  action_name?: string;
  decision_status?: string;
  risk_class?: string;
  summary?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type RiskEvent = {
  id?: string;
  event_key?: string;
  event_title?: string;
  risk_class?: string;
  event_status?: string;
  summary?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type GovernanceReview = {
  id?: string;
  review_key?: string;
  review_title?: string;
  review_type?: string;
  review_status?: string;
  due_at?: string;
  [key: string]: unknown;
};

export type GovernanceAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type DigitalWorkforceGovernanceCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  lifecycle_route?: string;
  value_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  authority_levels?: AuthorityLevel[];
  authority_assignments?: AuthorityAssignment[];
  policies?: GovernancePolicy[];
  approval_policies?: ApprovalPolicy[];
  action_authority_matrix?: ActionAuthorityEntry[];
  escalation_rules?: EscalationRule[];
  decision_logs?: DecisionLog[];
  risk_events?: RiskEvent[];
  governance_reviews?: GovernanceReview[];
  advisor_signals?: GovernanceAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  operations?: Record<string, string>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
