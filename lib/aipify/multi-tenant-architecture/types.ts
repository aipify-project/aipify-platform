export type OrganizationModule = {
  module_key: string;
  enabled: boolean;
  plan_required?: string | null;
};

export type OrganizationIntegration = {
  integration_type: string;
  name: string;
  status: string;
  last_sync_at?: string | null;
};

export type OrganizationAuditEvent = {
  id: string;
  action_type: string;
  entity_type?: string | null;
  actor_role?: string | null;
  ai_involved?: boolean;
  approval_status?: string | null;
  created_at?: string;
};

export type KnowledgeCenterStatus = {
  faq_count: number;
  article_count: number;
  status: string;
};

export type RolePermissions = {
  billing: boolean;
  user_management: boolean;
  module_management: boolean;
  integration_management: boolean;
  audit_log_access: boolean;
  approve_ai_actions: boolean;
};

export type OrganizationInfo = {
  id: string;
  name: string;
  slug: string;
  status: string;
  subscription_plan: string;
  default_language?: string;
  timezone?: string;
  is_unonight_pilot?: boolean;
  is_internal?: boolean;
};

export type MultiTenantArchitectureCard = {
  has_organization: boolean;
  organization_name?: string;
  modules_enabled?: number;
  philosophy?: string;
};

export type MultiTenantArchitectureDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  organization?: OrganizationInfo;
  current_role?: string;
  modules_enabled?: number;
  pending_tasks?: number;
  active_alerts?: number;
  available_organizations: OrganizationSummary[];
  enabled_modules: OrganizationModule[];
  integrations: OrganizationIntegration[];
  knowledge_center?: KnowledgeCenterStatus;
  recent_audit_events: OrganizationAuditEvent[];
  role_permissions?: RolePermissions;
  isolation_checks?: string[];
};

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  status: string;
  subscription_plan: string;
  role: string;
  membership_status: string;
};
