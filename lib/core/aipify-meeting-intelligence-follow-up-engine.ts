/**
 * Aipify Meeting Intelligence & Follow-Up Engine helpers (Phase 206).
 * Authoritative enforcement lives in Supabase RPCs (_amifue_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyMeetingIntelligenceFollowUpEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_meeting_intelligence_follow_up_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyMeetingIntelligenceFollowUpEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_meeting_intelligence_follow_up_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyMeetingIntelligenceFollowUpEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
