/**
 * Enterprise Calendar Assistant Engine helpers (Phase 237).
 * Authoritative enforcement lives in Supabase RPCs (_aecpae_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseCalendarPersonalAssistantEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_calendar_personal_assistant_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseCalendarPersonalAssistantEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_calendar_personal_assistant_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseCalendarPersonalAssistantEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
