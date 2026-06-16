/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 270).
 * Authoritative enforcement lives in Supabase RPCs (_aecie_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseCollectiveIntelligenceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_collective_intelligence_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseCollectiveIntelligenceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_collective_intelligence_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseCollectiveIntelligenceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
