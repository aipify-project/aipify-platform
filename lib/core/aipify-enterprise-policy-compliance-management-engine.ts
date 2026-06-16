/**
 * Aipify Enterprise Policy & Compliance Management Engine helpers (Phase 225).
 * Authoritative enforcement lives in Supabase RPCs (_aepcme_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterprisePolicyComplianceManagementEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_policy_compliance_management_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterprisePolicyComplianceManagementEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_policy_compliance_management_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterprisePolicyComplianceManagementEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
