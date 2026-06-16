/**
 * Enterprise Search Center Engine helpers (Phase 234).
 * Authoritative enforcement lives in Supabase RPCs (_aesuka_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseSearchUniversalKnowledgeAccessEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_search_universal_knowledge_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseSearchUniversalKnowledgeAccessEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_search_universal_knowledge_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseSearchUniversalKnowledgeAccessEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
