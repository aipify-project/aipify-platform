/**
 * Aipify Operations Orchestration Engine helpers (Phase 208).
 * Authoritative enforcement lives in Supabase RPCs (_aooe_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyOperationsOrchestrationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_operations_orchestration_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyOperationsOrchestrationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_operations_orchestration_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyOperationsOrchestrationEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
