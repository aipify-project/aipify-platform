/**
 * Civilizational Trust & Social Cohesion Engine helpers (Phase 169).
 * Authoritative enforcement lives in Supabase RPCs (_cstce_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const SOCIAL_COHESION_TRUST_MODES = ["guided", "executive_led", "stewardship_focused"] as const;
export type SocialCohesionTrustMode = (typeof SOCIAL_COHESION_TRUST_MODES)[number];

export const EXECUTIVE_TRUST_REVIEW_TYPES = [
  "ecosystem_trust_evolution",
  "confidence_weakening_themes",
  "unfulfilled_commitments_themes",
  "credibility_strengthening",
  "stewardship_demonstration",
  "leadership_credibility_review",
] as const;
export type ExecutiveTrustReviewType = (typeof EXECUTIVE_TRUST_REVIEW_TYPES)[number];

export const RELATIONSHIP_HEALTH_TYPES = [
  "people_feel_heard_themes",
  "leader_integrity_modeling",
  "gp_support_themes",
  "trust_repair_readiness",
  "contribution_recognition",
  "relationship_reflection",
] as const;
export type RelationshipHealthType = (typeof RELATIONSHIP_HEALTH_TYPES)[number];

export const TRUST_REPAIR_TYPES = [
  "acknowledgment",
  "accountability",
  "transparent_communication",
  "relationship_repair",
  "learning_review",
  "commitment_improvement",
] as const;
export type TrustRepairType = (typeof TRUST_REPAIR_TYPES)[number];

export const TRUST_MEMORY_TYPES = [
  "leadership_reflection",
  "relationship_success_narrative",
  "gp_experience",
  "communication_lesson",
  "knowledge_contribution",
  "institutional_milestone",
] as const;
export type TrustMemoryType = (typeof TRUST_MEMORY_TYPES)[number];

export async function getSocialCohesionEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_social_cohesion_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSocialCohesionEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_social_cohesion_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createSocialCohesionAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
