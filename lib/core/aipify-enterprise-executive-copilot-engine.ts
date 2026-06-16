/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 267).
 * Authoritative enforcement lives in Supabase RPCs (_aeecpe_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseExecutiveCopilotEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_executive_copilot_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseExecutiveCopilotEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_executive_copilot_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseExecutiveCopilotEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
