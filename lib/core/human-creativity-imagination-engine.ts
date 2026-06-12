/**
 * HumanCreativityImagination Engine (Phase 174) helpers.
 * Authoritative enforcement lives in Supabase RPCs (_hcia_*).
 */
type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};
export async function getHumanCreativityImaginationEngineDashboard(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_human_creativity_imagination_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
export async function getHumanCreativityImaginationEngineCard(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_human_creativity_imagination_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
export function createHumanCreativityImaginationEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
