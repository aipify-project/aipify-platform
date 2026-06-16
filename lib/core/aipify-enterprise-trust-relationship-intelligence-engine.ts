/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 262).
 * Authoritative enforcement lives in Supabase RPCs (_aetrie_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseTrustRelationshipIntelligenceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_trust_relationship_intelligence_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseTrustRelationshipIntelligenceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_trust_relationship_intelligence_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseTrustRelationshipIntelligenceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
