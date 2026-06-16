/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 239).
 * Authoritative enforcement lives in Supabase RPCs (_aeogae_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseOnboardingGuidedAdoptionEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_onboarding_guided_adoption_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseOnboardingGuidedAdoptionEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_onboarding_guided_adoption_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseOnboardingGuidedAdoptionEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
