/**
 * Human Dignity & Technological Humility Engine (Phase 177) helpers (Phase 177).
 * Authoritative enforcement lives in Supabase RPCs (_hdth_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getHumanDignityHumilityEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_dignity_humility_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getHumanDignityHumilityEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_dignity_humility_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createHumanDignityHumilityEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
