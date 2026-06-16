/**
 * Aipify Organizational Health & Early Warning Engine helpers (Phase 198).
 * Authoritative enforcement lives in Supabase RPCs (_aohew_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyOrganizationalHealthEarlyWarningEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_organizational_health_early_warning_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyOrganizationalHealthEarlyWarningEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_organizational_health_early_warning_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyOrganizationalHealthEarlyWarningEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
