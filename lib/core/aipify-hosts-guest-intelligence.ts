/**
 * Aipify Hosts — Guest Intelligence & Loyalty (Phase Airbnb 04).
 * Authoritative enforcement lives in Supabase RPCs (_ahostguest_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsGuestIntelligenceDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_guest_intelligence_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsGuestIntelligenceCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_guest_intelligence_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
