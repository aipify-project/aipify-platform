import type { DECISION_CATEGORIES, DECISION_FRAMEWORKS, DECISION_SENSITIVITY, DECISION_STATES } from "./constants";

export type DecisionCategory = (typeof DECISION_CATEGORIES)[number];
export type DecisionState = (typeof DECISION_STATES)[number];
export type DecisionFramework = (typeof DECISION_FRAMEWORKS)[number];
export type DecisionSensitivity = (typeof DECISION_SENSITIVITY)[number];

export type DecisionWorkspace = {
  decision_key: string;
  title: string;
  category: DecisionCategory | string;
  owner_label: string;
  time_sensitivity: DecisionSensitivity | string;
  stakeholders: string;
  status: DecisionState | string;
  framework_type: DecisionFramework | string;
  framework_data: Record<string, unknown>;
  objectives: string | null;
  assumptions: string | null;
  alternatives: string | null;
  risk_indicators: unknown[];
  deadline_at: string | null;
  decided_at: string | null;
  outcome_summary: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type DecisionInsight = {
  insight_key: string;
  decision_key: string | null;
  message: string;
  priority: string;
};

export type StakeholderInput = {
  input_key: string;
  decision_key: string;
  contributor_label: string;
  input_type: string;
  content: string;
  rating: number | null;
  created_at: string | null;
};

export type AuditEntry = {
  event_type: string;
  summary: string | null;
  created_at: string | null;
};

export type ExecutiveDecisionSupportCenter = {
  dashboard: {
    active_count: number;
    pending_evaluations: number;
    awaiting_approval: number;
    stakeholder_inputs: number;
    high_sensitivity: number;
    decided_count: number;
    framework_adoption_rate: number;
    decision_confidence_avg: number;
  } | null;
  active_decisions: DecisionWorkspace[];
  pending_evaluations: DecisionWorkspace[];
  decided_decisions: DecisionWorkspace[];
  insights: DecisionInsight[];
  stakeholder_input: StakeholderInput[];
  recent_audit: AuditEntry[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
