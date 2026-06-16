/**
 * Humanity's Shared Legacy & Flourishing Engine helpers (Phase 190).
 * Authoritative enforcement lives in Supabase RPCs (_hslf_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getSharedLegacyFlourishingEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_legacy_flourishing_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSharedLegacyFlourishingEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_legacy_flourishing_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createSharedLegacyFlourishingEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
