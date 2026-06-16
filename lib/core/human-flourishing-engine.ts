/**
 * Human Flourishing Engine helpers (Phase 170).
 * Authoritative enforcement lives in Supabase RPCs (_cfhp_*).
 */

import type { RpcClient } from "./rpc-client";

export const HUMAN_FLOURISHING_DEVELOPMENT_MODES = [
  "guided",
  "community_led",
  "executive_sponsored",
] as const;
export type HumanFlourishingDevelopmentMode = (typeof HUMAN_FLOURISHING_DEVELOPMENT_MODES)[number];

export const EXECUTIVE_FLOURISHING_REVIEW_TYPES = [
  "people_thriving",
  "growth_barriers",
  "belonging_cultivation",
  "future_leaders_support",
  "purpose_strengthening",
  "learning_accessibility",
  "strengths_recognition",
  "community_contribution",
] as const;
export type ExecutiveFlourishingReviewType = (typeof EXECUTIVE_FLOURISHING_REVIEW_TYPES)[number];

export const BELONGING_REFLECTION_TYPES = [
  "recognition_culture",
  "mentorship_accessibility",
  "inclusive_leadership",
  "knowledge_communities",
  "cross_functional_learning",
  "gp_participation",
  "belonging_themes",
  "culture_review",
] as const;
export type BelongingReflectionType = (typeof BELONGING_REFLECTION_TYPES)[number];

export async function getHumanFlourishingEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_flourishing_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getHumanFlourishingEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_human_flourishing_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createHumanFlourishingAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
