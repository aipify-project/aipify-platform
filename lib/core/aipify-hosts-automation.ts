/**
 * Aipify Hosts — Hospitality Automation (Phase Airbnb 03).
 * Authoritative enforcement lives in Supabase RPCs (_ahostauto_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsAutomationDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_automation_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsAutomationCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_automation_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
