export type MobileApiChannel = {
  id: string;
  channel_key: string;
  name: string;
  channel_type: string;
  provider: string;
  endpoint_url?: string | null;
  auth_method: string;
  connection_mode: string;
  status: string;
  rate_limit_per_hour: number;
  daily_limit: number;
  quiet_hours_start?: string | null;
  quiet_hours_end?: string | null;
  last_test_at?: string | null;
  last_test_status?: string | null;
  domain_id?: string | null;
  business_pack_key?: string | null;
  allowed_events?: unknown[];
};

export type MobileApiEventRule = {
  id: string;
  channel_id: string;
  event_key: string;
  enabled: boolean;
  requires_approval: boolean;
  min_priority: string;
  deep_link_template?: string | null;
};

export type MobileApiPendingSend = {
  id: string;
  channel_id: string;
  event_key: string;
  title: string;
  message?: string | null;
  priority: string;
  status: string;
  created_at?: string | null;
};

export type MobileApiDeliveryLog = {
  id: string;
  channel_id?: string | null;
  event_key?: string | null;
  delivery_status: string;
  suppression_reason?: string | null;
  retry_count?: number;
  fallback_channel?: string | null;
  summary?: string | null;
  created_at?: string | null;
};

export type MobileApiSettings = {
  pause_non_critical?: boolean;
  default_quiet_hours_start?: string | null;
  default_quiet_hours_end?: string | null;
  default_working_hours_start?: string | null;
  default_working_hours_end?: string | null;
  weekend_rules?: Record<string, unknown>;
  emergency_bypass_enabled?: boolean;
  max_retries?: number;
  fallback_to_email?: boolean;
  fallback_to_in_app?: boolean;
};

export type MobileApiIntegrationCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, unknown>;
  channels?: MobileApiChannel[];
  event_rules?: MobileApiEventRule[];
  pending_sends?: MobileApiPendingSend[];
  settings?: MobileApiSettings;
  delivery_history?: MobileApiDeliveryLog[];
  reports?: Record<string, unknown>;
  connection_types?: string[];
  connection_modes?: string[];
  providers?: string[];
  priorities?: string[];
  default_event_keys?: string[];
  payload_fields?: string[];
  audit_recent?: { action: string; summary: string; created_at: string }[];
  sections?: string[];
  routes?: Record<string, string>;
};
