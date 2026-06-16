/**
 * Curiosity & Discovery Engine helpers (Phase A.87).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const DISCOVERY_CATEGORIES = [
  "operational",
  "customer",
  "knowledge",
  "innovation",
  "human",
] as const;
export type DiscoveryCategory = (typeof DISCOVERY_CATEGORIES)[number];

export const DISCOVERY_PROMPT_STATUSES = ["pending", "explored", "dismissed"] as const;
export type DiscoveryPromptStatus = (typeof DISCOVERY_PROMPT_STATUSES)[number];

export const DISCOVERY_CONFIDENCE_LEVELS = ["low", "moderate", "high"] as const;
export type DiscoveryConfidence = (typeof DISCOVERY_CONFIDENCE_LEVELS)[number];

export const DISCOVERY_PROMPT_CADENCES = ["weekly", "monthly", "quarterly"] as const;
export type DiscoveryPromptCadence = (typeof DISCOVERY_PROMPT_CADENCES)[number];

export const CURIOSITY_DISCOVERY_PERMISSION_KEYS = [
  "curiosity_discovery.view",
  "curiosity_discovery.manage",
  "curiosity_discovery.export",
  "curiosity_discovery.prompts.explore",
] as const;
export type CuriosityDiscoveryPermissionKey = (typeof CURIOSITY_DISCOVERY_PERMISSION_KEYS)[number];

export const CURIOSITY_DISCOVERY_ENGINE_MODULE_KEY = "curiosity_discovery_engine" as const;

export async function getCuriosityDiscoveryEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_curiosity_discovery_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCuriosityDiscoveryEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_curiosity_discovery_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCuriosityDiscoveryAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
