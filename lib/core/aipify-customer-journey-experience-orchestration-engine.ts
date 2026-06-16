/**
 * Aipify Customer Journey & Experience Orchestration Engine helpers (Phase 214).
 * Authoritative enforcement lives in Supabase RPCs (_acjeoe_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyCustomerJourneyExperienceOrchestrationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_customer_journey_experience_orchestration_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyCustomerJourneyExperienceOrchestrationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_customer_journey_experience_orchestration_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyCustomerJourneyExperienceOrchestrationEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
