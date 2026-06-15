/**
 * Aipify Hosts — Owner Portal & Hospitality Companion (Phase Airbnb 07).
 * Authoritative enforcement lives in Supabase RPCs (_ahostcomp_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsCompanionDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_companion_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsCompanionCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_companion_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
