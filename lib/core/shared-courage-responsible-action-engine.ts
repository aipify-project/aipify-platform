/**
 * Humanity's Shared Courage & Responsible Action Engine helpers (Phase 187).
 * Authoritative enforcement lives in Supabase RPCs (_hscra_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getSharedCourageResponsibleActionEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_courage_responsible_action_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSharedCourageResponsibleActionEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_courage_responsible_action_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createSharedCourageResponsibleActionEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
