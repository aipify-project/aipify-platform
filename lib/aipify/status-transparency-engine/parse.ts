import type {
  StatusEvent,
  StatusIncidentUpdate,
  StatusSummary,
  StatusTransparencyEngineCard,
  StatusTransparencyEngineDashboard,
  StatusTransparencySettings,
  StatusUptimeMetric,
} from "./types";

export function parseStatusTransparencyEngineCard(data: unknown): StatusTransparencyEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    overall_status: typeof d.overall_status === "string" ? d.overall_status : undefined,
    open_incidents: Number(d.open_incidents ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

function parseStatusEvent(item: unknown): StatusEvent {
  const e = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(e.id ?? ""),
    component: typeof e.component === "string" ? e.component : undefined,
    status: typeof e.status === "string" ? e.status : undefined,
    severity: typeof e.severity === "string" ? e.severity : undefined,
    title: typeof e.title === "string" ? e.title : undefined,
    description: typeof e.description === "string" ? e.description : null,
    public_visibility: typeof e.public_visibility === "boolean" ? e.public_visibility : undefined,
    metadata:
      typeof e.metadata === "object" && e.metadata
        ? (e.metadata as Record<string, unknown>)
        : undefined,
    started_at: typeof e.started_at === "string" ? e.started_at : undefined,
    resolved_at: typeof e.resolved_at === "string" ? e.resolved_at : null,
    created_at: typeof e.created_at === "string" ? e.created_at : undefined,
    updated_at: typeof e.updated_at === "string" ? e.updated_at : undefined,
  };
}

function parseIncidentUpdate(item: unknown): StatusIncidentUpdate {
  const u = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(u.id ?? ""),
    status_event_id: typeof u.status_event_id === "string" ? u.status_event_id : undefined,
    update_type: typeof u.update_type === "string" ? u.update_type : undefined,
    message: typeof u.message === "string" ? u.message : undefined,
    public_visibility: typeof u.public_visibility === "boolean" ? u.public_visibility : undefined,
    created_at: typeof u.created_at === "string" ? u.created_at : undefined,
  };
}

function parseUptimeMetric(item: unknown): StatusUptimeMetric {
  const m = (item ?? {}) as Record<string, unknown>;
  return {
    id: String(m.id ?? ""),
    component: typeof m.component === "string" ? m.component : undefined,
    measurement_period: typeof m.measurement_period === "string" ? m.measurement_period : undefined,
    period_start: typeof m.period_start === "string" ? m.period_start : undefined,
    period_end: typeof m.period_end === "string" ? m.period_end : undefined,
    uptime_percentage:
      typeof m.uptime_percentage === "number"
        ? m.uptime_percentage
        : Number(m.uptime_percentage ?? 0),
    incident_count: Number(m.incident_count ?? 0),
  };
}

export function parseStatusTransparencyEngineDashboard(
  data: unknown
): StatusTransparencyEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const settings =
    typeof d.settings === "object" && d.settings
      ? (d.settings as StatusTransparencySettings)
      : undefined;
  const summary =
    typeof d.summary === "object" && d.summary ? (d.summary as StatusSummary) : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    overall_status: typeof d.overall_status === "string" ? d.overall_status : undefined,
    settings,
    component_status:
      typeof d.component_status === "object" && d.component_status
        ? (d.component_status as Record<string, Record<string, unknown>>)
        : undefined,
    active_incidents: Array.isArray(d.active_incidents)
      ? d.active_incidents.map(parseStatusEvent)
      : [],
    scheduled_maintenance: Array.isArray(d.scheduled_maintenance)
      ? d.scheduled_maintenance.map(parseStatusEvent)
      : [],
    recent_resolutions: Array.isArray(d.recent_resolutions)
      ? d.recent_resolutions.map(parseStatusEvent)
      : [],
    uptime_trends: Array.isArray(d.uptime_trends) ? d.uptime_trends.map(parseUptimeMetric) : [],
    incident_updates: Array.isArray(d.incident_updates)
      ? d.incident_updates.map(parseIncidentUpdate)
      : [],
    summary,
  };
}
