/**
 * Humanity's Shared Trust & Cooperative Intelligence Engine helpers (Phase 185).
 * Authoritative enforcement lives in Supabase RPCs (_hstci_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getSharedTrustCooperativeIntelligenceEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_trust_cooperative_intelligence_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSharedTrustCooperativeIntelligenceEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_humanity_shared_trust_cooperative_intelligence_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createSharedTrustCooperativeIntelligenceEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
