/**
 * Aipify Customer Feedback & Voice of the Customer Engine helpers (Phase 224).
 * Authoritative enforcement lives in Supabase RPCs (_acfvotce_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyCustomerFeedbackVoiceOfTheCustomerEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_customer_feedback_voice_of_the_customer_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyCustomerFeedbackVoiceOfTheCustomerEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_customer_feedback_voice_of_the_customer_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyCustomerFeedbackVoiceOfTheCustomerEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
