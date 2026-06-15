/**
 * Aipify Hosts — Property Acquisition & Expansion Intelligence (Phase Airbnb 06).
 * Authoritative enforcement lives in Supabase RPCs (_ahostexp_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsExpansionIntelligenceDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_expansion_intelligence_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsExpansionIntelligenceCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_expansion_intelligence_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
