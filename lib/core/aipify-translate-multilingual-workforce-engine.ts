/**
 * Enterprise Translate Engine helpers (Phase 238).
 * Authoritative enforcement lives in Supabase RPCs (_atmwfe_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyTranslateMultilingualWorkforceEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_translate_multilingual_workforce_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyTranslateMultilingualWorkforceEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_translate_multilingual_workforce_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyTranslateMultilingualWorkforceEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
