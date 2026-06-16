/**
 * Enterprise __TRANSLATE_CENTER__ Engine helpers (Phase 272).
 * Authoritative enforcement lives in Supabase RPCs (_aepvae_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterprisePurposeValuesAlignmentEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_purpose_values_alignment_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterprisePurposeValuesAlignmentEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_purpose_values_alignment_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterprisePurposeValuesAlignmentEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
