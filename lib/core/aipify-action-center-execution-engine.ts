/**
 * Aipify Action Center & Execution Engine helpers (Phase 205).
 * Authoritative enforcement lives in Supabase RPCs (_aacee_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyActionCenterExecutionEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_action_center_execution_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyActionCenterExecutionEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_action_center_execution_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyActionCenterExecutionEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
