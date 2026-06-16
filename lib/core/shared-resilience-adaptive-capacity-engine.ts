/**
 * Humanity's Shared Resilience & Adaptive Capacity Engine helpers (Phase 184).
 * Authoritative enforcement lives in Supabase RPCs (_hsrac_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getSharedResilienceAdaptiveCapacityEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_resilience_adaptive_capacity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSharedResilienceAdaptiveCapacityEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_resilience_adaptive_capacity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createSharedResilienceAdaptiveCapacityEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
