/**
 * Priority & Focus Engine helpers (Phase A.80).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const PRIORITY_FOCUS_DIMENSIONS = [
  "operational",
  "strategic",
  "human",
  "knowledge",
  "relationship",
] as const;
export type PriorityFocusDimension = (typeof PRIORITY_FOCUS_DIMENSIONS)[number];

export const PRIORITY_FOCUS_LEVELS = [1, 2, 3, 4] as const;
export type PriorityFocusLevel = (typeof PRIORITY_FOCUS_LEVELS)[number];

export const PRIORITY_ITEM_STATUSES = ["active", "completed", "paused", "archived"] as const;
export type PriorityItemStatus = (typeof PRIORITY_ITEM_STATUSES)[number];

export const FOCUS_RECOMMENDATION_TYPES = [
  "focus_suggestion",
  "reprioritize",
  "wellbeing",
  "capacity",
  "alignment",
] as const;
export type FocusRecommendationType = (typeof FOCUS_RECOMMENDATION_TYPES)[number];

export const FOCUS_RECOMMENDATION_STATUSES = ["pending", "resolved", "dismissed"] as const;
export type FocusRecommendationStatus = (typeof FOCUS_RECOMMENDATION_STATUSES)[number];

export const PRIORITY_FOCUS_PERMISSION_KEYS = [
  "priority_focus.view",
  "priority_focus.manage",
  "priority_focus.recommendations.resolve",
] as const;
export type PriorityFocusPermissionKey = (typeof PRIORITY_FOCUS_PERMISSION_KEYS)[number];

export async function getPriorityFocusEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_priority_focus_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPriorityFocusEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_priority_focus_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function listPriorityFocusItems(
  supabase: RpcClient,
  status = "active",
  priorityLevel?: number
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("list_priority_focus_items", {
    p_status: status,
    p_priority_level: priorityLevel ?? null,
  });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export function createPriorityFocusAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
