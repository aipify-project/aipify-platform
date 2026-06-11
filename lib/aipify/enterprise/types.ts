export const DEPLOYMENT_MODES = ["cloud_saas", "hybrid", "on_premise"] as const;
export const DATA_RESIDENCY_MODES = ["cloud", "local_only", "hybrid_redacted", "customer_controlled"] as const;
export const CONNECTIVITY_MODES = ["internet", "outbound_only", "private_network", "offline_limited"] as const;
export const AGENT_STATUSES = ["pending", "online", "offline", "error", "disabled"] as const;
export const AGENT_JOB_STATUSES = ["queued", "claimed", "running", "completed", "failed", "cancelled", "expired"] as const;
export const DESKTOP_ENDPOINT_MODES = ["cloud", "hybrid", "on_premise"] as const;

export type TenantDeploymentSettings = {
  deployment_mode?: string;
  data_residency_mode?: string;
  connectivity_mode?: string;
  local_agent_required?: boolean;
  cloud_sync_allowed?: boolean;
  raw_data_cloud_sync_allowed?: boolean;
  redaction_required?: boolean;
  local_knowledge_enabled?: boolean;
  local_memory_enabled?: boolean;
  enterprise_governance_enabled?: boolean;
  desktop_endpoint_mode?: string;
  custom_desktop_endpoint_url?: string | null;
};

export type AipifyAgent = {
  id: string;
  agent_name: string;
  deployment_mode: string;
  status: string;
  version?: string | null;
  host_info?: Record<string, unknown>;
  capabilities?: Record<string, unknown>;
  last_seen_at?: string | null;
  last_health_check_at?: string | null;
  created_at?: string;
};

export type AgentJob = {
  id: string;
  job_type: string;
  status: string;
  agent_id?: string;
  payload?: Record<string, unknown>;
  queued_at?: string;
  completed_at?: string | null;
  error_message?: string | null;
};

export type DataResidencyPolicy = {
  id?: string;
  policy_key: string;
  description?: string | null;
  data_category: string;
  storage_location: string;
  cloud_sync_allowed: boolean;
  redaction_required: boolean;
  retention_days?: number | null;
};

export type EnterpriseConnector = {
  id?: string;
  connector_key: string;
  display_name: string;
  requires_agent: boolean;
  supported_deployment_modes: string[];
  status: string;
  permissions?: Record<string, unknown>;
  config_ref?: string | null;
};

export type AgentAccessEvent = {
  id: string;
  event_type: string;
  agent_id?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
};

export type EnterpriseDeploymentCard = {
  has_customer: boolean;
  deployment_mode?: string;
  data_residency_mode?: string;
  local_agent_required?: boolean;
  agents_online?: number;
  jobs_queued?: number;
  has_enterprise_access?: boolean;
  philosophy?: string;
  privacy_note?: string;
};

export type EnterpriseDeploymentDashboard = {
  has_customer: boolean;
  has_enterprise_access?: boolean;
  upgrade_required?: boolean;
  settings?: TenantDeploymentSettings;
  agents: AipifyAgent[];
  recent_jobs: AgentJob[];
  recent_agent_events: AgentAccessEvent[];
};

export type TenantDeploymentBundle = {
  has_customer: boolean;
  has_enterprise_access?: boolean;
  upgrade_required?: boolean;
  settings?: TenantDeploymentSettings;
};

export type AgentRegisterResult = {
  agent_id: string;
  agent_key: string;
  agent_name: string;
  deployment_mode: string;
  status: string;
};
