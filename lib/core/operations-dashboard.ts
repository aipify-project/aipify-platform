/**
 * Operations Dashboard Engine helpers (Phase A.9).
 * Authoritative enforcement lives in Supabase RPCs (_ode_*).
 */

export const DASHBOARD_WIDGET_KEYS = [
  "since_last_login",
  "pending_tasks",
  "pending_approvals",
  "support_overview",
  "recent_notifications",
  "ai_recommendations",
  "integration_health",
  "knowledge_center_status",
  "audit_activity",
  "organization_health_score",
] as const;
export type DashboardWidgetKey = (typeof DASHBOARD_WIDGET_KEYS)[number];

export const HEALTH_STATUSES = ["excellent", "healthy", "needs_attention", "critical"] as const;
export type HealthStatus = (typeof HEALTH_STATUSES)[number];

export const ALERT_SEVERITIES = ["informational", "moderate", "high", "critical"] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

type DashboardRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isCriticalHealth(status?: string): boolean {
  return status === "critical" || status === "needs_attention";
}

export function canConfigureDashboard(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export async function getDashboardWidgetData(
  supabase: DashboardRpcClient,
  widgetKey: DashboardWidgetKey
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_dashboard_widget_data", {
    p_widget_key: widgetKey,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function saveDashboardPreferences(
  supabase: DashboardRpcClient,
  preferences: Array<{ widget_key: string; enabled?: boolean; display_order?: number }>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("save_dashboard_preferences", {
    p_preferences: preferences,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function dismissOperationsAlert(
  supabase: DashboardRpcClient,
  alertId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("dismiss_operations_alert", {
    p_alert_id: alertId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function acknowledgeCriticalAlert(
  supabase: DashboardRpcClient,
  alertId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("acknowledge_critical_alert", {
    p_alert_id: alertId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createDashboardAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
