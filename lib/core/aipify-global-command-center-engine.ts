/**
 * Aipify Global Command Center Engine helpers (Phase 201).
 * Authoritative enforcement lives in Supabase RPCs (_agcce_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyGlobalCommandCenterEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_global_command_center_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyGlobalCommandCenterEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_global_command_center_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyGlobalCommandCenterEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
