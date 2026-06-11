/**
 * Observability & Platform Health Engine helpers (Phase A.19).
 * Authoritative enforcement lives in Supabase RPCs (_ophe_*).
 * Distinct from A.13 Quality Guardian — monitors platform/service health.
 */

export const HEALTH_COMPONENTS = [
  "authentication",
  "support_ai",
  "admin_assistant",
  "knowledge_center",
  "integrations",
  "notifications",
  "audit_log",
  "dashboard",
  "analytics",
] as const;

export const PLATFORM_HEALTH_STATUSES = ["healthy", "degraded", "unavailable", "maintenance"] as const;
export const HEALTH_SEVERITIES = ["informational", "low", "medium", "high", "critical"] as const;
export const INCIDENT_STATUSES = ["identified", "investigating", "monitoring", "resolved"] as const;
export const MAINTENANCE_STATUSES = ["scheduled", "in_progress", "completed", "cancelled"] as const;

export type HealthComponent = (typeof HEALTH_COMPONENTS)[number];
export type PlatformHealthStatus = (typeof PLATFORM_HEALTH_STATUSES)[number];
export type HealthSeverity = (typeof HEALTH_SEVERITIES)[number];
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number];

type ObservabilityRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isCriticalHealthSeverity(severity?: string): boolean {
  return severity === "critical" || severity === "high";
}

export function canManageObservability(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canManageIncidents(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export function canManageMaintenance(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export async function recordHealthEvent(
  supabase: ObservabilityRpcClient,
  params: {
    component: HealthComponent;
    status?: PlatformHealthStatus;
    severity?: HealthSeverity;
    message: string;
    metadata?: Record<string, unknown>;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_health_event", {
    p_component: params.component,
    p_status: params.status ?? "healthy",
    p_severity: params.severity ?? "informational",
    p_message: params.message,
    p_metadata: params.metadata ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createIncident(
  supabase: ObservabilityRpcClient,
  params: {
    incident_summary: string;
    affected_services?: string[];
    severity?: HealthSeverity;
    mitigation_steps?: string | null;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_platform_incident", {
    p_incident_summary: params.incident_summary,
    p_affected_services: params.affected_services ?? [],
    p_severity: params.severity ?? "medium",
    p_mitigation_steps: params.mitigation_steps ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function resolveIncident(
  supabase: ObservabilityRpcClient,
  incidentId: string,
  resolutionNotes?: string | null
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("resolve_platform_incident", {
    p_incident_id: incidentId,
    p_resolution_notes: resolutionNotes ?? null,
    p_status: "resolved",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function scheduleMaintenance(
  supabase: ObservabilityRpcClient,
  params: {
    title: string;
    description?: string | null;
    scheduled_start?: string | null;
    scheduled_end?: string | null;
    send_notification?: boolean;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("schedule_maintenance_window", {
    p_title: params.title,
    p_description: params.description ?? null,
    p_scheduled_start: params.scheduled_start ?? null,
    p_scheduled_end: params.scheduled_end ?? null,
    p_send_notification: params.send_notification ?? true,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPlatformStatus(
  supabase: ObservabilityRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_platform_status");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function sendHealthAlert(
  supabase: ObservabilityRpcClient,
  params: {
    title: string;
    message?: string | null;
    component?: HealthComponent | null;
    severity?: HealthSeverity;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("send_health_alert", {
    p_title: params.title,
    p_message: params.message ?? null,
    p_component: params.component ?? null,
    p_severity: params.severity ?? "high",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function runHealthCheck(
  supabase: ObservabilityRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("run_health_check");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function saveObservabilitySettings(
  supabase: ObservabilityRpcClient,
  settings: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("save_observability_settings", {
    p_response_time_threshold_ms: settings.response_time_threshold_ms ?? null,
    p_integration_failure_threshold: settings.integration_failure_threshold ?? null,
    p_ai_failure_threshold: settings.ai_failure_threshold ?? null,
    p_queue_backlog_threshold: settings.queue_backlog_threshold ?? null,
    p_failed_login_threshold: settings.failed_login_threshold ?? null,
    p_notification_failure_threshold: settings.notification_failure_threshold ?? null,
    p_enabled_components: settings.enabled_components ?? null,
    p_alert_rules: settings.alert_rules ?? null,
    p_proactive_monitoring_enabled: settings.proactive_monitoring_enabled ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createObservabilityAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
