/**
 * Aipify Organizational Insights & Executive Intelligence Engine helpers (Phase 223).
 * Authoritative enforcement lives in Supabase RPCs (_aoieie_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyOrganizationalInsightsExecutiveIntelligenceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_organizational_insights_executive_intelligence_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyOrganizationalInsightsExecutiveIntelligenceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_organizational_insights_executive_intelligence_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyOrganizationalInsightsExecutiveIntelligenceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
