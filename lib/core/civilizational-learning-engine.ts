/**
 * Civilizational Learning & Collective Adaptation Engine helpers (Phase 164).
 * Authoritative enforcement lives in Supabase RPCs (_clae_*).
 */

import type { RpcClient } from "./rpc-client";

export const CIVILIZATIONAL_LEARNING_MATURITY_STAGES = [
  "foundational_awareness",
  "reflective_learning",
  "collective_adaptation",
  "cross_generational_wisdom",
  "resilience_preparedness",
  "civilizational_readiness",
] as const;
export type CivilizationalLearningMaturityStage =
  (typeof CIVILIZATIONAL_LEARNING_MATURITY_STAGES)[number];

export const LEARNING_PROGRAM_TYPES = [
  "cross_generational_mentorship",
  "executive_learning_circle",
  "knowledge_stewardship",
  "resilience_learning",
  "future_preparedness",
  "community_learning_network",
  "gp_collaboration",
  "professional_association",
] as const;
export type LearningProgramType = (typeof LEARNING_PROGRAM_TYPES)[number];

export const ADAPTATION_REVIEW_TYPES = [
  "adaptation_evolution",
  "leadership_reflection",
  "underutilized_lessons",
  "change_resistance",
  "preserve_experiences",
  "future_leaders_prep",
  "collective_resilience",
  "preparedness_exercise",
] as const;
export type AdaptationReviewType = (typeof ADAPTATION_REVIEW_TYPES)[number];

export const LESSON_LEARNED_TYPES = [
  "transformation_lesson",
  "leadership_reflection",
  "gp_experience",
  "knowledge_contribution",
  "preparedness_exercise",
  "institutional_narrative",
  "assumption_revision",
  "emerging_reality",
] as const;
export type LessonLearnedType = (typeof LESSON_LEARNED_TYPES)[number];

export async function getCivilizationalLearningEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civilizational_learning_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCivilizationalLearningEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civilizational_learning_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCivilizationalLearningAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
