/**
 * Enterprise Desktop Companion Engine helpers (Phase 236).
 * Authoritative enforcement lives in Supabase RPCs (_adccbe_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyDesktopCompanionCreativeBridgeEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_desktop_companion_creative_bridge_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyDesktopCompanionCreativeBridgeEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_desktop_companion_creative_bridge_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyDesktopCompanionCreativeBridgeEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
