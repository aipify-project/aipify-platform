/**
 * HumanAgencyAutonomy Engine (Phase 176) helpers.
 * Authoritative enforcement lives in Supabase RPCs (_haar_*).
 */
type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};
export async function getHumanAgencyAutonomyEngineDashboard(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_human_agency_autonomy_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
export async function getHumanAgencyAutonomyEngineCard(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_human_agency_autonomy_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
export function createHumanAgencyAutonomyEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
