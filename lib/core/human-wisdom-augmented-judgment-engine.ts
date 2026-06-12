/**
 * HumanWisdomAugmentedJudgment Engine (Phase 175) helpers.
 * Authoritative enforcement lives in Supabase RPCs (_hwaj_*).
 */
type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};
export async function getHumanWisdomAugmentedJudgmentEngineDashboard(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_human_wisdom_augmented_judgment_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
export async function getHumanWisdomAugmentedJudgmentEngineCard(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_human_wisdom_augmented_judgment_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
export function createHumanWisdomAugmentedJudgmentEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
