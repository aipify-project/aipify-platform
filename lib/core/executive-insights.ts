/**
 * Executive Insights Engine helpers (Phase A.35).
 * Authoritative enforcement lives in Supabase RPCs (_eie_*).
 */

export const EXECUTIVE_REPORTING_PERIODS = ["daily", "weekly", "monthly", "quarterly"] as const;

export const EXECUTIVE_HEALTH_STATUSES = [
  "excellent",
  "healthy",
  "needs_attention",
  "action_recommended",
] as const;

export const EXECUTIVE_SOURCE_MODULES = [
  "analytics_insights_engine",
  "operations_dashboard_engine",
  "operations_center",
  "customer_success_engine",
  "strategic_intelligence",
  "quality_guardian_engine",
  "governance_policy_engine",
  "security_trust_engine",
  "support_ai_engine",
] as const;

export type ExecutiveReportingPeriod = (typeof EXECUTIVE_REPORTING_PERIODS)[number];
export type ExecutiveHealthStatus = (typeof EXECUTIVE_HEALTH_STATUSES)[number];

type ExecutiveRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function canViewExecutiveInsights(role: string): boolean {
  return ["owner", "administrator", "manager", "viewer", "support_agent"].includes(role);
}

export function canExportExecutiveReports(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export function canScheduleExecutiveReports(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export async function getExecutiveInsightsEngineDashboard(
  supabase: ExecutiveRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_insights_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function generateExecutiveReport(
  supabase: ExecutiveRpcClient,
  reportingPeriod: ExecutiveReportingPeriod = "weekly"
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("generate_executive_report", {
    p_reporting_period: reportingPeriod,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function exportExecutiveReport(
  supabase: ExecutiveRpcClient,
  reportId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("export_executive_report", {
    p_report_id: reportId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function saveExecutiveReportSchedule(
  supabase: ExecutiveRpcClient,
  reportingPeriod: ExecutiveReportingPeriod,
  enabled: boolean,
  deliveryChannels: string[] = ["dashboard"]
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("save_executive_report_schedule", {
    p_reporting_period: reportingPeriod,
    p_enabled: enabled,
    p_delivery_channels: deliveryChannels,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createExecutiveInsightsAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
