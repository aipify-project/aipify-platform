/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 245).
 * Authoritative enforcement lives in Supabase RPCs (_aohwie_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyOrganizationalHealthWorkforceInsightsEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_organizational_health_workforce_insights_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyOrganizationalHealthWorkforceInsightsEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_organizational_health_workforce_insights_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyOrganizationalHealthWorkforceInsightsEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
