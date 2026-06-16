/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 261).
 * Authoritative enforcement lives in Supabase RPCs (_aerbce_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseResilienceBusinessContinuityEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_resilience_business_continuity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseResilienceBusinessContinuityEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_resilience_business_continuity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseResilienceBusinessContinuityEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
