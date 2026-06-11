export const GOVERNANCE_MODES = [
  "safe",
  "balanced",
  "autonomous_low_risk",
  "enterprise_control",
] as const;
export type GovernanceMode = (typeof GOVERNANCE_MODES)[number];

export const PERMISSION_LEVELS = ["allowed", "approval_required", "blocked"] as const;
export type PermissionLevel = (typeof PERMISSION_LEVELS)[number];

export const GOVERNANCE_RISK_LEVELS = ["low", "medium", "high", "blocked"] as const;
export type GovernanceRiskLevel = (typeof GOVERNANCE_RISK_LEVELS)[number];

export const APPROVAL_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "expired",
  "cancelled",
  "paused",
] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export type GovernanceSettings = {
  governance_mode: GovernanceMode;
  approval_defaults: Record<string, unknown>;
  emergency_controls_enabled: boolean;
  explainability_enabled: boolean;
  trust_scoring_enabled: boolean;
  audit_retention_days: number;
};

export type GovernanceApproval = {
  id: string;
  action_type: string;
  title: string;
  summary: string;
  risk_level: GovernanceRiskLevel;
  explanation: string | null;
  approval_scope: string | null;
  status: ApprovalStatus;
  requested_by_ai: boolean;
  source_type: string;
  source_id: string | null;
  expires_at: string | null;
  created_at: string;
};

export type GovernanceAuditEntry = {
  id: string;
  actor_type: string;
  action: string;
  action_category: string | null;
  result: string | null;
  explanation_reference: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type GovernanceTrustScore = {
  id: string;
  automation_id: string | null;
  action_key: string;
  success_count: number;
  failure_count: number;
  approval_count: number;
  trust_score: number;
  last_calculated_at: string;
};

export type GovernancePermission = {
  id: string;
  action_key: string;
  permission_level: PermissionLevel;
  risk_level: GovernanceRiskLevel;
  requires_approval: boolean;
  enabled: boolean;
};

export type GovernanceCenter = {
  has_customer: boolean;
  has_access: boolean;
  upgrade_required: boolean;
  enabled: boolean;
  governance_mode: GovernanceMode;
  privacy_note: string;
  emergency: {
    enabled: boolean;
    reason: string | null;
    activated_at: string | null;
    state: string;
  };
  metrics: {
    pending_approvals: number;
    blocked_actions: number;
    avg_trust_score: number;
    audit_events_24h: number;
  };
  pending_approvals: GovernanceApproval[];
  recent_audit: GovernanceAuditEntry[];
  trust_scores: GovernanceTrustScore[];
};

export type ExplainabilityRecord = {
  id: string;
  action_reference: string;
  explanation: string;
  evidence: Record<string, unknown>;
  confidence_score: number;
  generated_at: string;
};
