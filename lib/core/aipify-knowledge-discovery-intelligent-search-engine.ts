/**
 * Aipify Knowledge Discovery & Intelligent Search Engine helpers (Phase 204).
 * Authoritative enforcement lives in Supabase RPCs (_akdise_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyKnowledgeDiscoveryIntelligentSearchEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_knowledge_discovery_intelligent_search_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyKnowledgeDiscoveryIntelligentSearchEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_knowledge_discovery_intelligent_search_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyKnowledgeDiscoveryIntelligentSearchEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
