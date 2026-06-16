/**
 * Global Talent & Expert Network Engine helpers (Phase 147).
 * Authoritative enforcement lives in Supabase RPCs (_gtene_*).
 */

import type { RpcClient } from "./rpc-client";

export const GLOBAL_EXPERT_PROFILE_STATUSES = [
  "draft",
  "active",
  "under_review",
  "archived",
] as const;
export type GlobalExpertProfileStatus = (typeof GLOBAL_EXPERT_PROFILE_STATUSES)[number];

export const GLOBAL_EXPERT_ENGAGEMENT_STATUSES = [
  "draft",
  "in_review",
  "active",
  "completed",
  "archived",
] as const;
export type GlobalExpertEngagementStatus = (typeof GLOBAL_EXPERT_ENGAGEMENT_STATUSES)[number];

export const GLOBAL_EXPERT_CONTRIBUTION_TYPES = [
  "knowledge_publication",
  "community_leadership",
  "executive_education",
  "training_development",
  "gp_mentorship",
  "operational_excellence",
] as const;
export type GlobalExpertContributionType = (typeof GLOBAL_EXPERT_CONTRIBUTION_TYPES)[number];

export async function getGlobalTalentExpertNetworkEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_talent_expert_network_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGlobalTalentExpertNetworkEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_talent_expert_network_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createGlobalTalentExpertNetworkAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
