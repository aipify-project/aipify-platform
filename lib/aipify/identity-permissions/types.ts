export type RoleDistribution = {
  role: string;
  count: number;
};

export type IdentityApprovalRequest = {
  id: string;
  action_type: string;
  risk_level: string;
  status: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export type IdentityAccessEvent = {
  id: string;
  action_type: string;
  actor_role?: string | null;
  created_at?: string;
  metadata?: Record<string, unknown>;
};

export type AiRiskClassification = {
  level: string;
  examples: string[];
  auto_execute: boolean;
};

export type MfaReadiness = {
  method: string;
  status: string;
};

export type IdentityPermissionsCard = {
  has_organization: boolean;
  active_users?: number;
  pending_approvals?: number;
  philosophy?: string;
};

export type IdentityPermissionsDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  current_role?: string;
  active_users?: number;
  pending_invitations?: number;
  pending_approvals?: number;
  suspended_users?: number;
  role_distribution: RoleDistribution[];
  approval_requests: IdentityApprovalRequest[];
  recent_access_events: IdentityAccessEvent[];
  user_permissions: string[];
  ai_risk_classification: AiRiskClassification[];
  mfa_readiness: MfaReadiness[];
  can_approve_low?: boolean;
  can_approve_medium?: boolean;
  can_approve_high?: boolean;
};
