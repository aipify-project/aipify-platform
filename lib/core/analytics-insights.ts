/**
 * Analytics & Insights Engine helpers (Phase A.16).
 * Authoritative enforcement lives in Supabase RPCs (_aie_*).
 */

export const ANALYTICS_CATEGORIES = [
  "support_performance",
  "admin_assistant",
  "knowledge_center",
  "approval_workflows",
  "integration_reliability",
  "ai_recommendations",
  "onboarding_effectiveness",
] as const;

export const ANALYTICS_HEALTH_STATUSES = [
  "excellent",
  "healthy",
  "needs_attention",
  "critical",
] as const;

export const INSIGHT_SEVERITIES = ["informational", "moderate", "high", "critical"] as const;
export const INSIGHT_CONFIDENCE = ["low", "moderate", "high"] as const;
export const REPORT_TYPES = ["weekly", "monthly", "custom"] as const;

export type AnalyticsCategory = (typeof ANALYTICS_CATEGORIES)[number];
export type AnalyticsHealthStatus = (typeof ANALYTICS_HEALTH_STATUSES)[number];

type AnalyticsRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isCriticalAnalyticsHealth(status?: string): boolean {
  return status === "critical" || status === "needs_attention";
}

export function canManageAnalytics(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canExportAnalytics(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export async function refreshAnalyticsMetrics(
  supabase: AnalyticsRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("refresh_analytics_metrics");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function generateAnalyticsInsights(
  supabase: AnalyticsRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("generate_analytics_insights");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAnalyticsMetrics(
  supabase: AnalyticsRpcClient,
  category?: string,
  days = 30
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_analytics_metrics", {
    p_category: category ?? null,
    p_days: days,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAnalyticsTrends(
  supabase: AnalyticsRpcClient,
  category?: string,
  days = 30
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("get_analytics_trends", {
    p_category: category ?? null,
    p_days: days,
  });
  if (error) throw new Error(error.message);
  return (data as unknown[]) ?? [];
}

export async function createAnalyticsReport(
  supabase: AnalyticsRpcClient,
  reportType: string,
  periodStart?: string,
  periodEnd?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_analytics_report", {
    p_report_type: reportType,
    p_period_start: periodStart ?? null,
    p_period_end: periodEnd ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function exportAnalyticsReport(
  supabase: AnalyticsRpcClient,
  reportId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("export_analytics_report", {
    p_report_id: reportId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAnalyticsAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
