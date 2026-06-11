export const PILOT_STATUSES = [
  "setup",
  "discovery",
  "pilot_active",
  "active",
  "paused",
  "archived",
] as const;
export type PilotStatus = (typeof PILOT_STATUSES)[number];

export const PILOT_MODULE_MODES = [
  "safe",
  "read_only",
  "approval_required",
  "active",
  "disabled",
  "suggestions_only",
  "draft_only",
] as const;
export type PilotModuleMode = (typeof PILOT_MODULE_MODES)[number];

export const PILOT_CHECKLIST_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "blocked",
  "skipped",
] as const;
export type PilotChecklistStatus = (typeof PILOT_CHECKLIST_STATUSES)[number];

export type PilotTenantProfile = {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  tenant_type: string;
  industry: string | null;
  region: string | null;
  default_language: string;
  supported_languages: string[];
  timezone: string;
  pilot_status: PilotStatus;
  pilot_stage: number;
  metadata: Record<string, unknown>;
};

export type PilotModule = {
  id?: string;
  module_key: string;
  enabled: boolean;
  licensed?: boolean;
  status: string;
  mode: PilotModuleMode;
  settings?: Record<string, unknown>;
  enabled_at?: string | null;
  updated_at?: string;
};

export type PilotIntegration = {
  id?: string;
  integration_key: string;
  display_name: string;
  status: string;
  connection_mode: string;
  capabilities: Record<string, unknown>;
  last_sync_at?: string | null;
  error_message?: string | null;
};

export type PilotChecklistItem = {
  id: string;
  checklist_key: string;
  title: string;
  description: string | null;
  status: PilotChecklistStatus;
  priority: number;
  completed_at: string | null;
};

export type PilotEvent = {
  id: string;
  event_type: string;
  title: string;
  summary: string | null;
  severity: string;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
};

export type PilotDashboard = {
  tenant_id: string;
  profile: PilotTenantProfile | null;
  setup_completeness_score: number;
  safe_mode: boolean;
  governance_mode: string;
  emergency_stop_active: boolean;
  support_ai_mode: string;
  knowledge_articles_count: number;
  open_knowledge_gaps: number;
  workflows_detected: number;
  integrations_connected: number;
  modules_enabled: number;
  last_discovery_run: Record<string, unknown> | null;
  pending_approvals: number;
  blocked_actions: number;
  checklist_summary: { completed: number; total: number };
  next_recommended_step: string;
};

export type PilotInstallStatus = {
  exists: boolean;
  slug?: string;
  profile?: PilotTenantProfile;
  dashboard?: PilotDashboard;
};

export type PilotProvisionConfig = {
  slug: string;
  name: string;
  company_slug: string;
  tenant_type: string;
  industry?: string;
  region?: string;
  default_language: string;
  supported_languages: string[];
  timezone: string;
  pilot_status: PilotStatus;
  pilot_stage: number;
  contact_email?: string;
  country?: string;
  plan_name?: string;
  plan_type?: string;
  metadata?: Record<string, unknown>;
  modules: Array<{
    module_key: string;
    enabled: boolean;
    mode: PilotModuleMode;
    settings?: Record<string, unknown>;
  }>;
  integrations: Array<{
    integration_key: string;
    display_name: string;
    status: string;
    connection_mode: string;
    capabilities?: Record<string, unknown>;
  }>;
  workflows: Array<{
    workflow_key: string;
    name: string;
    description?: string;
    category: string;
    expected_response_time_minutes: number;
    active?: boolean;
  }>;
  checklist: Array<{
    checklist_key: string;
    title: string;
    description?: string;
    status?: PilotChecklistStatus;
    priority: number;
  }>;
  governance: {
    mode: string;
    approval_defaults?: Record<string, unknown>;
    permissions?: Array<{
      action_key: string;
      permission_level: string;
      risk_level: string;
      requires_approval: boolean;
      enabled?: boolean;
    }>;
  };
};
