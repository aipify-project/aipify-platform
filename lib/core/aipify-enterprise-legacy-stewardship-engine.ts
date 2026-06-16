/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 280).
 * Authoritative enforcement lives in Supabase RPCs (_aelse_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseLegacyStewardshipEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_legacy_stewardship_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseLegacyStewardshipEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_legacy_stewardship_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseLegacyStewardshipEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
