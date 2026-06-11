export type HealthComponent =
  | "authentication"
  | "support_ai"
  | "admin_assistant"
  | "knowledge_center"
  | "integrations"
  | "notifications"
  | "audit_log"
  | "dashboard"
  | "analytics";

export type HealthStatus = "healthy" | "degraded" | "unavailable" | "maintenance";
export type HealthSeverity = "informational" | "low" | "medium" | "high" | "critical";
export type IncidentStatus = "identified" | "investigating" | "monitoring" | "resolved";
export type MaintenanceStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type ComponentHealth = {
  status?: HealthStatus | string;
  severity?: HealthSeverity | string;
  message?: string;
  metadata?: Record<string, unknown>;
};

export type PlatformHealthEvent = {
  id: string;
  component?: HealthComponent | string;
  status?: HealthStatus | string;
  severity?: HealthSeverity | string;
  message?: string;
  metadata?: Record<string, unknown>;
  detected_at?: string;
  resolved_at?: string | null;
};

export type PlatformIncident = {
  id: string;
  incident_summary: string;
  affected_services?: string[] | unknown;
  severity?: HealthSeverity | string;
  status?: IncidentStatus | string;
  mitigation_steps?: string | null;
  resolution_notes?: string | null;
  identified_at?: string;
  resolved_at?: string | null;
  created_at?: string;
};

export type MaintenanceWindow = {
  id: string;
  title: string;
  description?: string | null;
  scheduled_start?: string;
  scheduled_end?: string;
  status?: MaintenanceStatus | string;
  notification_sent?: boolean;
  post_review_notes?: string | null;
  created_at?: string;
};

export type ObservabilitySettings = {
  response_time_threshold_ms?: number;
  integration_failure_threshold?: number;
  ai_failure_threshold?: number;
  queue_backlog_threshold?: number;
  failed_login_threshold?: number;
  notification_failure_threshold?: number;
  enabled_components?: Record<string, boolean>;
  alert_rules?: Record<string, boolean>;
  proactive_monitoring_enabled?: boolean;
};

export type ResponseTimeTrend = {
  period_date?: string;
  metric_key?: string;
  metric_value?: number;
};

export type RecoveryProgress = {
  resolved_incidents_30d?: number;
  open_incidents?: number;
  degraded_components?: number;
};

export type ObservabilityPlatformHealthEngineCard = {
  has_organization: boolean;
  overall_status?: string;
  open_incidents?: number;
  degraded_signals_24h?: number;
  philosophy?: string;
};

export type ObservabilityPlatformHealthEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  overall_status?: HealthStatus | string;
  settings?: ObservabilitySettings;
  components?: Record<string, ComponentHealth>;
  active_incidents: PlatformIncident[];
  recent_outages: PlatformHealthEvent[];
  response_time_trends: ResponseTimeTrend[];
  maintenance_windows: MaintenanceWindow[];
  recent_events: PlatformHealthEvent[];
  recovery_progress?: RecoveryProgress;
};
