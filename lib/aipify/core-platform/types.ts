export type CoreComponent = {
  component_key: string;
  status: string;
  summary: string;
  health_score: number;
};

export type DashboardWidget = {
  widget_key: string;
  title: string;
  summary: string;
  count_value: number;
  priority: string;
};

export type TenantModule = {
  module_key: string;
  module_label: string;
  module_category: string;
  enabled: boolean;
};

export type AiActionRule = {
  action_key: string;
  action_label: string;
  risk_level: string;
  auto_execute_allowed: boolean;
  requires_approval: boolean;
  example?: string | null;
};

export type CoreIntegration = {
  integration_key: string;
  integration_label: string;
  status: string;
  integration_type: string;
  last_synced_at?: string | null;
};

export type ApiKeySummary = {
  id: string;
  key_label: string;
  key_prefix: string;
  scopes?: string[];
  rate_limit_per_minute: number;
  active: boolean;
};

export type AuditEvent = {
  id: string;
  event_type: string;
  summary?: string | null;
  actor_type: string;
  created_at?: string;
};

export type SupportedRole = {
  key: string;
  label: string;
};

export type AipifyCorePlatformCard = {
  has_customer: boolean;
  core_health_score?: number;
  modules_enabled?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type AipifyCorePlatformDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_high_risk_disabled?: boolean;
  unonight_pilot_mode?: boolean;
  philosophy?: string;
  safety_note?: string;
  core_enabled?: boolean;
  core_health_score?: number;
  components_active?: number;
  modules_enabled?: number;
  pending_tasks?: number;
  active_alerts?: number;
  supported_roles: SupportedRole[];
  core_components: CoreComponent[];
  dashboard_widgets: DashboardWidget[];
  tenant_modules: TenantModule[];
  ai_action_framework: AiActionRule[];
  integrations: CoreIntegration[];
  api_keys: ApiKeySummary[];
  recent_audit_events: AuditEvent[];
  pilot_principles?: string[];
  integrations_map?: Record<string, string>;
};

export type AipifyCoreActionResult = {
  status?: string;
  error?: string;
  [key: string]: unknown;
};
