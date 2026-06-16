/**
 * Legacy Engine helpers (Phase A.86).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const LEGACY_DIMENSIONS = ["knowledge", "people", "customer", "innovation"] as const;
export type LegacyDimension = (typeof LEGACY_DIMENSIONS)[number];

export const LEGACY_ENGINE_PERMISSION_KEYS = [
  "legacy_engine.view",
  "legacy_engine.manage",
  "legacy_engine.export",
  "legacy_engine.milestones.acknowledge",
] as const;
export type LegacyEnginePermissionKey = (typeof LEGACY_ENGINE_PERMISSION_KEYS)[number];

export const LEGACY_ENGINE_MODULE_KEY = "legacy_engine" as const;

export async function getLegacyEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_legacy_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getLegacyEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_legacy_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createLegacyEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
