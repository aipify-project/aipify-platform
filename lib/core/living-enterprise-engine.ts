/**
 * Living Enterprise & Organizational Transcendence Engine helpers (Phase 160).
 * Authoritative enforcement lives in Supabase RPCs (_lete_*).
 */

import type { RpcClient } from "./rpc-client";

export const LIVING_ENTERPRISE_MATURITY_STAGES = [
  "operational_excellence",
  "collaborative_maturity",
  "wisdom_integration",
  "purpose_alignment",
  "stewardship_leadership",
  "living_enterprise_readiness",
] as const;
export type LivingEnterpriseMaturityStage = (typeof LIVING_ENTERPRISE_MATURITY_STAGES)[number];

export const STEWARDSHIP_REVIEW_TYPES = [
  "org_health",
  "purpose_alignment",
  "wisdom_preservation",
  "resilience_assessment",
  "leadership_reflection",
  "companion_stewardship",
  "legacy_planning",
  "future_readiness",
] as const;
export type StewardshipReviewType = (typeof STEWARDSHIP_REVIEW_TYPES)[number];

export const FLOURISHING_DIMENSION_TYPES = [
  "employee_wellbeing_themes",
  "leadership_development",
  "community_relationships",
  "learning_participation",
  "knowledge_sharing",
  "gp_health_themes",
  "purpose_alignment",
] as const;
export type FlourishingDimensionType = (typeof FLOURISHING_DIMENSION_TYPES)[number];

export const LIVING_MEMORY_TYPES = [
  "leadership_narrative",
  "purpose_history",
  "transformation_lesson",
  "knowledge_contribution",
  "stewardship_review",
  "institutional_wisdom",
] as const;
export type LivingMemoryType = (typeof LIVING_MEMORY_TYPES)[number];

export async function getLivingEnterpriseEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_living_enterprise_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getLivingEnterpriseEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_living_enterprise_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createLivingEnterpriseAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
