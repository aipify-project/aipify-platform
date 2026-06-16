/**
 * Wisdom Engine helpers (Phase A.93).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const WISDOM_INSIGHT_SOURCE_TYPES = [
  "memory",
  "lesson",
  "impact",
  "relationship",
  "kc",
  "reflection",
  "outcome",
] as const;
export type WisdomInsightSourceType = (typeof WISDOM_INSIGHT_SOURCE_TYPES)[number];

export const WISDOM_GUIDANCE_PROMPT_STATUSES = ["pending", "reviewed", "dismissed"] as const;
export type WisdomGuidancePromptStatus = (typeof WISDOM_GUIDANCE_PROMPT_STATUSES)[number];

export const WISDOM_ENGINE_PERMISSION_KEYS = [
  "wisdom_engine.view",
  "wisdom_engine.manage",
  "wisdom_engine.export",
  "wisdom_engine.guidance.review",
] as const;
export type WisdomEnginePermissionKey = (typeof WISDOM_ENGINE_PERMISSION_KEYS)[number];

export const WISDOM_ENGINE_MODULE_KEY = "wisdom_engine" as const;

export async function getWisdomEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_wisdom_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getWisdomEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_wisdom_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createWisdomEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
