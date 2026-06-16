/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 243).
 * Authoritative enforcement lives in Supabase RPCs (_amkte_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyMentorshipKnowledgeTransferEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_mentorship_knowledge_transfer_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyMentorshipKnowledgeTransferEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_mentorship_knowledge_transfer_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyMentorshipKnowledgeTransferEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
