/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 253).
 * Authoritative enforcement lives in Supabase RPCs (_aegpae_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseGovernancePolicyAutomationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_governance_policy_automation_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseGovernancePolicyAutomationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_governance_policy_automation_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseGovernancePolicyAutomationEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
