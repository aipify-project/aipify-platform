import type { ActionLevel, ActionRequestStatus, EmergencyState } from "./levels";

export type ActionRequest = {
  id: string;
  skill_id: string | null;
  skill_name: string | null;
  skill_key: string | null;
  action_name: string;
  description: string;
  risk_level: ActionLevel;
  resource_type: string | null;
  resource_id: string | null;
  status: ActionRequestStatus;
  requested_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  executed_at: string | null;
  created_at: string;
  explanation?: string | null;
  confidence_score?: number | null;
  undo_available?: boolean;
  approver_role_required?: string | null;
  core_approval_id?: string | null;
  correlation_id?: string | null;
  latest_audit_id?: string | null;
  scope_summary?: string | null;
  access_mode?: string | null;
  target_environment?: string | null;
  execution_result?: string | null;
  unchanged_summary?: string | null;
  approved_by_display?: string | null;
  approver_role_snapshot?: string | null;
  expires_at?: string | null;
};

export type ActionPolicy = {
  id: string;
  skill_id: string;
  skill_key: string;
  action_name: string;
  allowed: boolean;
  approval_required: boolean;
};

export type ActionAuditEntry = {
  id: string;
  action_request_id: string;
  skill_id: string | null;
  event_type: string;
  performed_by: string | null;
  details: Record<string, unknown>;
  created_at: string;
};

export type SkillTrustScore = {
  skill_id: string;
  skill_key: string;
  skill_name: string;
  trust_score: number;
  approval_rate: number;
  failure_rate: number;
  policy_violations: number;
  trust_band: "highly_trusted" | "trusted" | "needs_monitoring" | "restricted";
};

export type TrustActionsCenterBundle = {
  has_customer: boolean;
  emergency_state?: EmergencyState;
  pending_approvals?: ActionRequest[];
  executed_today?: number;
  rejected_today?: number;
  highest_risk_pending?: ActionRequest[];
  trust_scores?: SkillTrustScore[];
  recent_activity?: ActionAuditEntry[];
};
