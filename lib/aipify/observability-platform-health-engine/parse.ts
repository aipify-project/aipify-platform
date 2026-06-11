import type {
  ComponentHealth,
  MaintenanceWindow,
  ObservabilityPlatformHealthEngineCard,
  ObservabilityPlatformHealthEngineDashboard,
  ObservabilitySettings,
  PlatformHealthEvent,
  PlatformIncident,
  RecoveryProgress,
  ResponseTimeTrend,
} from "./types";

export function parseObservabilityPlatformHealthEngineCard(
  data: unknown
): ObservabilityPlatformHealthEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    overall_status: typeof d.overall_status === "string" ? d.overall_status : undefined,
    open_incidents: Number(d.open_incidents ?? 0),
    degraded_signals_24h: Number(d.degraded_signals_24h ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

function parseHealthEvent(item: unknown): PlatformHealthEvent {
  const e = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(e.id ?? ""),
    component: typeof e.component === "string" ? e.component : undefined,
    status: typeof e.status === "string" ? e.status : undefined,
    severity: typeof e.severity === "string" ? e.severity : undefined,
    message: typeof e.message === "string" ? e.message : undefined,
    metadata:
      typeof e.metadata === "object" && e.metadata
        ? (e.metadata as Record<string, unknown>)
        : undefined,
    detected_at: typeof e.detected_at === "string" ? e.detected_at : undefined,
    resolved_at: typeof e.resolved_at === "string" ? e.resolved_at : null,
  };
}

function parseIncident(item: unknown): PlatformIncident {
  const i = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(i.id ?? ""),
    incident_summary: String(i.incident_summary ?? ""),
    affected_services: i.affected_services,
    severity: typeof i.severity === "string" ? i.severity : undefined,
    status: typeof i.status === "string" ? i.status : undefined,
    mitigation_steps: typeof i.mitigation_steps === "string" ? i.mitigation_steps : null,
    resolution_notes: typeof i.resolution_notes === "string" ? i.resolution_notes : null,
    identified_at: typeof i.identified_at === "string" ? i.identified_at : undefined,
    resolved_at: typeof i.resolved_at === "string" ? i.resolved_at : null,
    created_at: typeof i.created_at === "string" ? i.created_at : undefined,
  };
}

function parseMaintenance(item: unknown): MaintenanceWindow {
  const m = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(m.id ?? ""),
    title: String(m.title ?? ""),
    description: typeof m.description === "string" ? m.description : null,
    scheduled_start: typeof m.scheduled_start === "string" ? m.scheduled_start : undefined,
    scheduled_end: typeof m.scheduled_end === "string" ? m.scheduled_end : undefined,
    status: typeof m.status === "string" ? m.status : undefined,
    notification_sent: typeof m.notification_sent === "boolean" ? m.notification_sent : undefined,
    post_review_notes: typeof m.post_review_notes === "string" ? m.post_review_notes : null,
    created_at: typeof m.created_at === "string" ? m.created_at : undefined,
  };
}

function parseTrend(item: unknown): ResponseTimeTrend {
  const t = (item ?? {}) as Record<string, unknown>;
  return {
    period_date: typeof t.period_date === "string" ? t.period_date : undefined,
    metric_key: typeof t.metric_key === "string" ? t.metric_key : undefined,
    metric_value: typeof t.metric_value === "number" ? t.metric_value : Number(t.metric_value ?? 0),
  };
}

function parseComponents(data: unknown): Record<string, ComponentHealth> {
  if (typeof data !== "object" || !data) return {};
  const result: Record<string, ComponentHealth> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const c = (value ?? {}) as Record<string, unknown>;
    result[key] = {
      status: typeof c.status === "string" ? c.status : undefined,
      severity: typeof c.severity === "string" ? c.severity : undefined,
      message: typeof c.message === "string" ? c.message : undefined,
      metadata:
        typeof c.metadata === "object" && c.metadata
          ? (c.metadata as Record<string, unknown>)
          : undefined,
    };
  }
  return result;
}

export function parseObservabilityPlatformHealthEngineDashboard(
  data: unknown
): ObservabilityPlatformHealthEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const settings =
    typeof d.settings === "object" && d.settings
      ? (d.settings as ObservabilitySettings)
      : undefined;
  const recovery =
    typeof d.recovery_progress === "object" && d.recovery_progress
      ? (d.recovery_progress as RecoveryProgress)
      : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    overall_status: typeof d.overall_status === "string" ? d.overall_status : undefined,
    settings,
    components: parseComponents(d.components),
    active_incidents: Array.isArray(d.active_incidents)
      ? d.active_incidents.map(parseIncident)
      : [],
    recent_outages: Array.isArray(d.recent_outages)
      ? d.recent_outages.map(parseHealthEvent)
      : [],
    response_time_trends: Array.isArray(d.response_time_trends)
      ? d.response_time_trends.map(parseTrend)
      : [],
    maintenance_windows: Array.isArray(d.maintenance_windows)
      ? d.maintenance_windows.map(parseMaintenance)
      : [],
    recent_events: Array.isArray(d.recent_events) ? d.recent_events.map(parseHealthEvent) : [],
    recovery_progress: recovery,
  };
}

export function parseObservabilitySettings(data: unknown): ObservabilitySettings {
  const d = (data ?? {}) as Record<string, unknown>;
  const settings =
    typeof d.settings === "object" && d.settings
      ? (d.settings as Record<string, unknown>)
      : d;

  return {
    response_time_threshold_ms: Number(settings.response_time_threshold_ms ?? 2000),
    integration_failure_threshold: Number(settings.integration_failure_threshold ?? 3),
    ai_failure_threshold: Number(settings.ai_failure_threshold ?? 5),
    queue_backlog_threshold: Number(settings.queue_backlog_threshold ?? 50),
    failed_login_threshold: Number(settings.failed_login_threshold ?? 10),
    notification_failure_threshold: Number(settings.notification_failure_threshold ?? 5),
    enabled_components:
      typeof settings.enabled_components === "object" && settings.enabled_components
        ? (settings.enabled_components as Record<string, boolean>)
        : undefined,
    alert_rules:
      typeof settings.alert_rules === "object" && settings.alert_rules
        ? (settings.alert_rules as Record<string, boolean>)
        : undefined,
    proactive_monitoring_enabled:
      typeof settings.proactive_monitoring_enabled === "boolean"
        ? settings.proactive_monitoring_enabled
        : true,
  };
}
