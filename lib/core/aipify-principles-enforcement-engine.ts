/**
 * Aipify Principles Enforcement Engine helpers (Phase 196).
 * Authoritative enforcement lives in Supabase RPCs (_apee_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyPrinciplesEnforcementEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_principles_enforcement_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyPrinciplesEnforcementEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_principles_enforcement_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyPrinciplesEnforcementEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
