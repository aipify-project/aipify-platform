/**
 * Aipify Innovation & Opportunity Discovery Engine helpers (Phase 212).
 * Authoritative enforcement lives in Supabase RPCs (_aiode_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyInnovationOpportunityDiscoveryEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_innovation_opportunity_discovery_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyInnovationOpportunityDiscoveryEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_innovation_opportunity_discovery_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyInnovationOpportunityDiscoveryEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
