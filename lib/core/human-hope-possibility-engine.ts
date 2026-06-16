/**
 * Human Hope & Collective Possibility Engine (Phase 178) helpers (Phase 178).
 * Authoritative enforcement lives in Supabase RPCs (_hhcp_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getHumanHopePossibilityEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_hope_possibility_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getHumanHopePossibilityEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_hope_possibility_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createHumanHopePossibilityEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
