/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 269).
 * Authoritative enforcement lives in Supabase RPCs (_aeooe_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseOrganizationalEnergyEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_organizational_energy_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseOrganizationalEnergyEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_organizational_energy_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseOrganizationalEnergyEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
