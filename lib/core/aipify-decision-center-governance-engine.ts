/**
 * Aipify Decision Center & Governance Engine helpers (Phase 207).
 * Authoritative enforcement lives in Supabase RPCs (_adcge_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyDecisionCenterGovernanceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_decision_center_governance_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyDecisionCenterGovernanceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_decision_center_governance_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyDecisionCenterGovernanceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
