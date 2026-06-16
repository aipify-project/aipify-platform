/**
 * Aipify Business Continuity & Crisis Management Engine helpers (Phase 227).
 * Authoritative enforcement lives in Supabase RPCs (_abcce_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyBusinessContinuityCrisisManagementEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_business_continuity_crisis_management_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyBusinessContinuityCrisisManagementEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_business_continuity_crisis_management_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyBusinessContinuityCrisisManagementEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
