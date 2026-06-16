/**
 * HumanWisdomAugmentedJudgment Engine (Phase 175) helpers.
 * Authoritative enforcement lives in Supabase RPCs (_hwaj_*).
 */
import type { RpcClient } from "./rpc-client";

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
