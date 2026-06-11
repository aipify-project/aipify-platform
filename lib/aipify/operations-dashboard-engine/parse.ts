import type { OperationsDashboardEngineCard, OperationsDashboardEngineDashboard } from "./types";

export function parseOperationsDashboardEngineCard(data: unknown): OperationsDashboardEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    health_status: typeof d.health_status === "string" ? d.health_status : undefined,
    health_score: Number(d.health_score ?? 0),
    active_alerts: Number(d.active_alerts ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseOperationsDashboardEngineDashboard(
  data: unknown
): OperationsDashboardEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    user_role: typeof d.user_role === "string" ? d.user_role : undefined,
    allowed_widgets: Array.isArray(d.allowed_widgets) ? (d.allowed_widgets as string[]) : undefined,
    preferences: Array.isArray(d.preferences)
      ? (d.preferences as OperationsDashboardEngineDashboard["preferences"])
      : [],
    widgets:
      typeof d.widgets === "object" && d.widgets ? (d.widgets as Record<string, unknown>) : undefined,
    active_alerts: Array.isArray(d.active_alerts)
      ? (d.active_alerts as OperationsDashboardEngineDashboard["active_alerts"])
      : [],
    organization_health:
      typeof d.organization_health === "object" && d.organization_health
        ? (d.organization_health as OperationsDashboardEngineDashboard["organization_health"])
        : undefined,
  };
}
