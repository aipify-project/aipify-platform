/**
 * Human Legacy & Eternal Stewardship Engine helpers (Phase 180).
 * Authoritative enforcement lives in Supabase RPCs (_hles_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getHumanLegacyEternalStewardshipEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_legacy_eternal_stewardship_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getHumanLegacyEternalStewardshipEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_legacy_eternal_stewardship_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createHumanLegacyEternalStewardshipEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
