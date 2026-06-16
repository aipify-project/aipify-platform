/**
 * Aipify Continuous Improvement & Optimization Engine helpers (Phase 211).
 * Authoritative enforcement lives in Supabase RPCs (_acioe_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyContinuousImprovementOptimizationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_continuous_improvement_optimization_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyContinuousImprovementOptimizationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_continuous_improvement_optimization_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyContinuousImprovementOptimizationEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
