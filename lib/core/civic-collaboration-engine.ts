/**
 * Civic Collaboration Engine helpers (Phase 161).
 * Authoritative enforcement lives in Supabase RPCs (_ccve_*).
 */

import type { RpcClient } from "./rpc-client";

export const CIVIC_COLLABORATION_MODES = ["guided", "community_led", "executive_sponsored"] as const;
export type CivicCollaborationMode = (typeof CIVIC_COLLABORATION_MODES)[number];

export const CIVIC_PARTNERSHIP_TYPES = [
  "education",
  "mentorship",
  "knowledge_sharing",
  "local_development",
  "professional_training",
  "economic_opportunity",
  "community_resilience",
] as const;
export type CivicPartnershipType = (typeof CIVIC_PARTNERSHIP_TYPES)[number];

export const CIVIC_INITIATIVE_TYPES = [
  "education_collaboration",
  "mentorship_program",
  "local_development",
  "knowledge_exchange",
  "volunteer_coordination",
  "trust_reflection",
  "stewardship_program",
  "community_resilience",
] as const;
export type CivicInitiativeType = (typeof CIVIC_INITIATIVE_TYPES)[number];

export const CIVIC_TRUST_REFLECTION_TYPES = [
  "community_perception",
  "responsibility_demonstration",
  "trust_strengthening",
  "relationship_investment",
  "positive_contribution",
  "stewardship_review",
] as const;
export type CivicTrustReflectionType = (typeof CIVIC_TRUST_REFLECTION_TYPES)[number];

export async function getCivicCollaborationEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civic_collaboration_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCivicCollaborationEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civic_collaboration_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCivicCollaborationAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
