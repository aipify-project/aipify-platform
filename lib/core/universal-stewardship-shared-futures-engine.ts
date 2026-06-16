/**
 * Universal Stewardship & Shared Futures Engine helpers (Phase 181).
 * Authoritative enforcement lives in Supabase RPCs (_hsfus_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getUniversalStewardshipSharedFuturesEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_universal_stewardship_shared_futures_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getUniversalStewardshipSharedFuturesEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_universal_stewardship_shared_futures_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createUniversalStewardshipSharedFuturesEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
