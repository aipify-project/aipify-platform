/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 251).
 * Authoritative enforcement lives in Supabase RPCs (_adire_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyDecisionIntelligenceRecommendationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_decision_intelligence_recommendation_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyDecisionIntelligenceRecommendationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_decision_intelligence_recommendation_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyDecisionIntelligenceRecommendationEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
