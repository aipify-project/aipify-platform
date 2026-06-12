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

export type BlueprintDefaultRole = {
  key?: string;
  label?: string;
  implemented?: boolean;
  scope?: string;
  note?: string;
};

export type PermissionCategoryBlock = {
  category?: string;
  description?: string;
  examples?: string[];
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type AccessReviewSettings = {
  scheduled_reviews_enabled?: boolean;
  review_interval_days?: number;
  privileged_accounts_only?: boolean;
  notify_owners?: boolean;
  [key: string]: unknown;
};

export type CompanionPermissionPrefs = {
  companion_view_default?: boolean;
  companion_manage_restricted?: boolean;
  restrict_by_role?: boolean;
  self_love_boundary_respected?: boolean;
  [key: string]: unknown;
};

export type IdentityPermissionsCard = {
  has_organization: boolean;
  active_users?: number;
  pending_approvals?: number;
  philosophy?: string;
  mission?: string;
  build_philosophy?: string;
  implementation_blueprint?: string;
};

export type IdentityPermissionsDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  build_philosophy?: string;
  abos_principle?: string;
  vision?: string;
  safety_note?: string;
  implementation_blueprint?: Record<string, unknown>;
  user_management_requirements?: string[];
  org_membership_model?: string[];
  default_roles?: BlueprintDefaultRole[];
  permission_categories?: PermissionCategoryBlock[];
  least_privilege_note?: string;
  approval_integration?: Record<string, unknown>;
  self_love_connection?: Record<string, unknown>;
  trust_connection?: Record<string, unknown>;
  audit_requirements?: string[];
  access_reviews?: {
    settings?: AccessReviewSettings;
    pending_count?: number;
    compliance_route?: string;
    security_route?: string;
  };
  companion_permission_prefs?: CompanionPermissionPrefs;
  success_criteria?: BlueprintSuccessCriterion[];
  blueprint_integration_links?: { label?: string; route?: string }[];
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
