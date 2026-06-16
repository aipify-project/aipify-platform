/**
 * Aipify Unified Workspace Engine helpers (Phase 202).
 * Authoritative enforcement lives in Supabase RPCs (_auwe_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyUnifiedWorkspaceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_unified_workspace_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyUnifiedWorkspaceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_unified_workspace_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyUnifiedWorkspaceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
