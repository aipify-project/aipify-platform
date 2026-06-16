/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 242).
 * Authoritative enforcement lives in Supabase RPCs (_aerce_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEmployeeRecognitionCelebrationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_employee_recognition_celebration_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEmployeeRecognitionCelebrationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_employee_recognition_celebration_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEmployeeRecognitionCelebrationEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
