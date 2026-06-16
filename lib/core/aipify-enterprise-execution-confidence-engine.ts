/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 276).
 * Authoritative enforcement lives in Supabase RPCs (_aeexce_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseExecutionConfidenceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_execution_confidence_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseExecutionConfidenceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_execution_confidence_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseExecutionConfidenceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
