/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 278).
 * Authoritative enforcement lives in Supabase RPCs (_aeote_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseOrganizationalTrustEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_organizational_trust_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseOrganizationalTrustEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_organizational_trust_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseOrganizationalTrustEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
