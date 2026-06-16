/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 281).
 * Authoritative enforcement lives in Supabase RPCs (_aeoce_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseOrganizationalConsciousnessEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_organizational_consciousness_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseOrganizationalConsciousnessEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_organizational_consciousness_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseOrganizationalConsciousnessEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
