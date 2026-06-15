/**
 * Aipify Hosts — Reporting & Executive Insights (Phase Airbnb 12).
 * Authoritative enforcement lives in Supabase RPCs (_ahostrpt_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsReportsDashboard(
  supabase: RpcClient,
  filter = "last_30_days",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_reports_dashboard", { p_filter: filter });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsReportsCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_reports_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function requestAipifyHostsReportExport(
  supabase: RpcClient,
  category: string,
  format: "pdf" | "excel" | "csv" = "pdf",
  filter = "last_30_days",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("request_aipify_hosts_report_export", {
    p_category: category,
    p_format: format,
    p_filter: filter,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function scheduleAipifyHostsReport(
  supabase: RpcClient,
  category: string,
  cadence: "daily" | "weekly" | "monthly" = "weekly",
  deliveryMethod: "email" | "dashboard" = "dashboard",
  exportFormat: "pdf" | "excel" | "csv" = "pdf",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("schedule_aipify_hosts_report", {
    p_category: category,
    p_cadence: cadence,
    p_delivery_method: deliveryMethod,
    p_export_format: exportFormat,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
