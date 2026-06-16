/**
 * Aipify Constitution & Perpetual Principles Engine helpers (Phase 191).
 * Authoritative enforcement lives in Supabase RPCs (_acpp_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyConstitutionPerpetualPrinciplesEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_constitution_perpetual_principles_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyConstitutionPerpetualPrinciplesEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_constitution_perpetual_principles_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyConstitutionPerpetualPrinciplesEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
