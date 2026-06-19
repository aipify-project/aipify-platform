export type IntegrationHubTab =
  | "overview"
  | "installed"
  | "marketplace"
  | "connected_systems"
  | "domains"
  | "api_keys"
  | "webhooks"
  | "sync"
  | "reports"
  | "companion";

export type HubConnector = {
  id: string;
  connector_key: string;
  connector_name: string;
  provider?: string;
  version?: string;
  category?: string;
  status?: string;
  auth_method?: string;
  sync_mode?: string;
  sync_direction?: string;
  domain_id?: string;
  business_pack_key?: string;
  permissions_requested?: unknown;
  permissions_granted?: unknown;
  data_access_scope?: string;
  approval_required?: boolean;
  health_status?: string;
  last_sync_at?: string;
  last_sync_status?: string;
  last_error?: string;
  record_href?: string;
  installed_at?: string;
  updated_at?: string;
};

export type MarketplaceConnector = {
  connector_key: string;
  connector_name: string;
  provider?: string;
  category?: string;
  description?: string;
  auth_methods?: unknown;
  default_permissions?: unknown;
  sync_directions?: unknown;
  business_pack_keys?: unknown;
  is_available?: boolean;
};

export type SyncRun = {
  id: string;
  connector_id?: string;
  connector_name?: string;
  sync_type?: string;
  sync_target?: string;
  status?: string;
  records_processed?: number;
  duration_ms?: number;
  error_message?: string;
  warning_message?: string;
  started_at?: string;
  completed_at?: string;
};

export type WebhookEntry = {
  id: string;
  webhook_name: string;
  source?: string;
  destination?: string;
  event_types?: unknown;
  status?: string;
  retry_count?: number;
  failure_count?: number;
  created_at?: string;
};

export type ApiKeyEntry = {
  id: string;
  key_name: string;
  key_prefix?: string;
  permissions?: unknown;
  usage_count?: number;
  rate_limit_per_hour?: number;
  status?: string;
  last_used_at?: string;
  created_at?: string;
};

export type HealthCheck = {
  connector_id?: string;
  connector_name?: string;
  health_status?: string;
  availability_pct?: number;
  api_errors?: number;
  rate_limit_hits?: number;
  auth_issues?: number;
  latency_ms?: number;
  summary?: string;
  checked_at?: string;
};

export type IntegrationHubCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, string | number | undefined>;
  connector_statuses?: string[];
  auth_methods?: string[];
  sync_modes?: string[];
  installed_connectors?: HubConnector[];
  marketplace?: MarketplaceConnector[];
  connected_systems?: { connector?: HubConnector; domain?: string; domain_status?: string }[];
  domains?: { domain_id?: string; domain?: string; verification_status?: string; connector_count?: number }[];
  api_keys?: ApiKeyEntry[];
  webhooks?: WebhookEntry[];
  sync_history?: SyncRun[];
  health_monitoring?: HealthCheck[];
  connector_governance?: Record<string, unknown>;
  installation_workflow?: string[];
  business_pack_integration?: Record<string, unknown>;
  domain_intelligence?: { domain?: string; connectors?: unknown }[];
  executive_dashboard?: Record<string, unknown>;
  companion_integration?: Record<string, unknown>;
  external_actions_framework?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  mobile_access?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; section?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};
