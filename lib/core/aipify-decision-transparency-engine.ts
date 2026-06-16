/**
 * Aipify Decision Transparency Engine helpers (Phase 197).
 * Authoritative enforcement lives in Supabase RPCs (_adte_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyDecisionTransparencyEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_decision_transparency_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyDecisionTransparencyEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_decision_transparency_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyDecisionTransparencyEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
