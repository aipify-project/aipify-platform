/**
 * Aipify Enterprise Risk & Resilience Engine helpers (Phase 226).
 * Authoritative enforcement lives in Supabase RPCs (_aerre_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyEnterpriseRiskResilienceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_risk_resilience_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseRiskResilienceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_risk_resilience_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseRiskResilienceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
