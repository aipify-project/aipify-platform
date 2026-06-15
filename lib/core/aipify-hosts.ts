/**
 * Aipify Hosts — Hospitality Business Pack (Phase Airbnb 01).
 * Authoritative enforcement lives in Supabase RPCs (_ahost_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
