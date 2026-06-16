/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 255).
 * Authoritative enforcement lives in Supabase RPCs (_aeeimae_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseExternalIntelligenceMarketAwarenessEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_external_intelligence_market_awareness_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseExternalIntelligenceMarketAwarenessEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_external_intelligence_market_awareness_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseExternalIntelligenceMarketAwarenessEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
