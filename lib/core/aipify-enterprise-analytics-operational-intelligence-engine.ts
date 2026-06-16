/**
 * Enterprise Analytics Center Engine helpers (Phase 235).
 * Authoritative enforcement lives in Supabase RPCs (_aeaoie_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseAnalyticsOperationalIntelligenceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_analytics_operational_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseAnalyticsOperationalIntelligenceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_analytics_operational_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseAnalyticsOperationalIntelligenceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
