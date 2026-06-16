/**
 * Aipify Ethical Evolution & Responsible Innovation Engine helpers (Phase 192).
 * Authoritative enforcement lives in Supabase RPCs (_aeeri_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEthicalEvolutionResponsibleInnovationEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_ethical_evolution_responsible_innovation_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEthicalEvolutionResponsibleInnovationEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_ethical_evolution_responsible_innovation_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEthicalEvolutionResponsibleInnovationEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
