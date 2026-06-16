/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 265).
 * Authoritative enforcement lives in Supabase RPCs (_aeoae_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseOrganizationalAdaptabilityEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_organizational_adaptability_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseOrganizationalAdaptabilityEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_organizational_adaptability_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseOrganizationalAdaptabilityEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
