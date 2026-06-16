/**
 * Aipify Resource Capacity & Workload Balance Engine helpers (Phase 209).
 * Authoritative enforcement lives in Supabase RPCs (_arcwbe_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyResourceCapacityWorkloadBalanceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_resource_capacity_workload_balance_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyResourceCapacityWorkloadBalanceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_resource_capacity_workload_balance_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyResourceCapacityWorkloadBalanceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
