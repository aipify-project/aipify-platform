/**
 * Proactive Companion Engine helpers (Phase A.79).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const PROACTIVE_COMPANION_CATEGORIES = [
  "operational",
  "support",
  "knowledge",
  "executive",
  "team_awareness",
] as const;
export type ProactiveCompanionCategory = (typeof PROACTIVE_COMPANION_CATEGORIES)[number];

export const PROACTIVE_COMPANION_FREQUENCIES = ["low", "normal", "high"] as const;
export type ProactiveCompanionFrequency = (typeof PROACTIVE_COMPANION_FREQUENCIES)[number];

export const PROACTIVE_COMPANION_STYLES = ["supportive", "balanced", "minimal"] as const;
export type ProactiveCompanionStyle = (typeof PROACTIVE_COMPANION_STYLES)[number];

export const PROACTIVE_NUDGE_STATUSES = ["pending", "dismissed", "acted", "snoozed"] as const;
export type ProactiveNudgeStatus = (typeof PROACTIVE_NUDGE_STATUSES)[number];

export const PROACTIVE_NUDGE_PRIORITIES = ["low", "normal", "high"] as const;
export type ProactiveNudgePriority = (typeof PROACTIVE_NUDGE_PRIORITIES)[number];

export const PROACTIVE_COMPANION_PERMISSION_KEYS = [
  "proactive_companion.view",
  "proactive_companion.manage",
  "proactive_companion.nudges.dismiss",
  "proactive_companion.preferences.manage",
] as const;
export type ProactiveCompanionPermissionKey = (typeof PROACTIVE_COMPANION_PERMISSION_KEYS)[number];

export async function getProactiveCompanionEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_proactive_companion_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getProactiveCompanionEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_proactive_companion_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function listProactiveCompanionNudges(
  supabase: RpcClient,
  status = "pending"
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("list_proactive_companion_nudges", { p_status: status });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export function createProactiveCompanionAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
