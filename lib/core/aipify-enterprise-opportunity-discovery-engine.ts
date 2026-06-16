/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 264).
 * Authoritative enforcement lives in Supabase RPCs (_aeode_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseOpportunityDiscoveryEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_opportunity_discovery_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseOpportunityDiscoveryEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_opportunity_discovery_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseOpportunityDiscoveryEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
