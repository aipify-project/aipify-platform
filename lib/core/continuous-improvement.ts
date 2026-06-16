/**
 * Continuous Improvement helpers (Phase).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export async function getContinuousImprovementEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_continuous_improvement_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function suggestImprovementInitiatives(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("suggest_improvement_initiatives");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createContinuousImprovementEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
