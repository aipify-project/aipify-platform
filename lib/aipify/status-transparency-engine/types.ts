export type StatusComponent =
  | "authentication"
  | "support_ai"
  | "admin_assistant"
  | "knowledge_center"
  | "integrations"
  | "notifications"
  | "dashboard"
  | "api_platform"
  | "platform";

export type ServiceStatus =
  | "operational"
  | "degraded_performance"
  | "partial_outage"
  | "major_outage"
  | "maintenance";

export type StatusSeverity = "informational" | "low" | "medium" | "high" | "critical";
export type IncidentUpdateType = "acknowledgement" | "update" | "resolution" | "maintenance_notice";
export type UptimePeriod = "daily" | "monthly" | "annual";

export type StatusEvent = {
  id: string;
  component?: StatusComponent | string;
  status?: ServiceStatus | string;
  severity?: StatusSeverity | string;
  title?: string;
  description?: string | null;
  public_visibility?: boolean;
  metadata?: Record<string, unknown>;
  started_at?: string;
  resolved_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type StatusIncidentUpdate = {
  id: string;
  status_event_id?: string;
  update_type?: IncidentUpdateType | string;
  message?: string;
  public_visibility?: boolean;
  created_at?: string;
};

export type StatusUptimeMetric = {
  id: string;
  component?: string;
  measurement_period?: UptimePeriod | string;
  period_start?: string;
  period_end?: string;
  uptime_percentage?: number;
  incident_count?: number;
};

export type StatusTransparencySettings = {
  public_status_page_enabled?: boolean;
  tenant_notices_enabled?: boolean;
  auto_publish_from_observability?: boolean;
  critical_bypass_quiet_hours?: boolean;
  enabled_components?: Record<string, boolean>;
};

export type StatusSummary = {
  open_incidents?: number;
  maintenance_active?: number;
  monthly_uptime_avg?: number;
};

export type StatusTransparencyEngineCard = {
  has_organization: boolean;
  overall_status?: string;
  open_incidents?: number;
  philosophy?: string;
};

export type StatusTransparencyEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  overall_status?: ServiceStatus | string;
  settings?: StatusTransparencySettings;
  component_status?: Record<string, Record<string, unknown>>;
  active_incidents: StatusEvent[];
  scheduled_maintenance: StatusEvent[];
  recent_resolutions: StatusEvent[];
  uptime_trends: StatusUptimeMetric[];
  incident_updates: StatusIncidentUpdate[];
  summary?: StatusSummary;
};
