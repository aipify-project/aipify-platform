/**
 * Civilizational Peacebuilding & Constructive Dialogue Engine helpers (Phase 168).
 * Authoritative enforcement lives in Supabase RPCs (_cpde_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const CONSTRUCTIVE_DIALOGUE_MATURITY_STAGES = [
  "foundational_awareness",
  "respectful_engagement",
  "conflict_navigation",
  "relationship_resilience",
  "perspective_expansion",
  "peacebuilding_readiness",
] as const;
export type ConstructiveDialogueMaturityStage =
  (typeof CONSTRUCTIVE_DIALOGUE_MATURITY_STAGES)[number];

export const DIALOGUE_REVIEW_TYPES = [
  "communication_breakdown",
  "unheard_perspectives",
  "pressure_responses",
  "psychological_safety",
  "relationship_repair",
  "leader_modeling",
  "trust_practices",
  "cultivate_understanding",
] as const;
export type DialogueReviewType = (typeof DIALOGUE_REVIEW_TYPES)[number];

export const DIALOGUE_PROGRAM_TYPES = [
  "communication_learning",
  "perspective_expansion_workshop",
  "leadership_reflection",
  "relationship_health_review",
  "cross_sector_forum",
  "dialogue_framework_training",
  "mentorship_dialogue",
  "constructive_feedback_system",
] as const;
export type DialogueProgramType = (typeof DIALOGUE_PROGRAM_TYPES)[number];

export const DIALOGUE_MEMORY_TYPES = [
  "leadership_reflection",
  "communication_lesson",
  "relationship_success_narrative",
  "knowledge_contribution",
  "cultural_insight",
  "organizational_learning",
  "dialogue_lesson",
  "repair_conversation_scaffold",
] as const;
export type DialogueMemoryType = (typeof DIALOGUE_MEMORY_TYPES)[number];

export async function getConstructiveDialogueEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_constructive_dialogue_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getConstructiveDialogueEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_constructive_dialogue_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createConstructiveDialogueAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
