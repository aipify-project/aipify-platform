/**
 * Aipify Onboarding & Adoption Acceleration Engine helpers (Phase 215).
 * Authoritative enforcement lives in Supabase RPCs (_aoaae_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyOnboardingAdoptionAccelerationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_onboarding_adoption_acceleration_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyOnboardingAdoptionAccelerationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_onboarding_adoption_acceleration_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyOnboardingAdoptionAccelerationEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
