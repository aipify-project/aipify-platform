/**
 * Aipify Values Transmission & Cultural Continuity Engine helpers (Phase 195).
 * Authoritative enforcement lives in Supabase RPCs (_avtcce_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyValuesTransmissionCulturalContinuityEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_values_transmission_cultural_continuity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyValuesTransmissionCulturalContinuityEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_values_transmission_cultural_continuity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyValuesTransmissionCulturalContinuityEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
