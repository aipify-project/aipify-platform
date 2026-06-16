/**
 * Humanity's Collective Wisdom & Shared Learning Engine helpers (Phase 182).
 * Authoritative enforcement lives in Supabase RPCs (_hcwsl_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getCollectiveWisdomSharedLearningEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_collective_wisdom_shared_learning_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCollectiveWisdomSharedLearningEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_collective_wisdom_shared_learning_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCollectiveWisdomSharedLearningEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
