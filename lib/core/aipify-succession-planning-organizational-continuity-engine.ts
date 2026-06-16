/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 244).
 * Authoritative enforcement lives in Supabase RPCs (_aspoc_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifySuccessionPlanningOrganizationalContinuityEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_succession_planning_organizational_continuity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifySuccessionPlanningOrganizationalContinuityEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_succession_planning_organizational_continuity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifySuccessionPlanningOrganizationalContinuityEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
