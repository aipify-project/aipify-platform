/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 248).
 * Authoritative enforcement lives in Supabase RPCs (_aogae_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyOrganizationalGoalsAlignmentEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_organizational_goals_alignment_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyOrganizationalGoalsAlignmentEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_organizational_goals_alignment_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyOrganizationalGoalsAlignmentEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
