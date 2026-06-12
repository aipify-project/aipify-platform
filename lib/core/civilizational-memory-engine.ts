/**
 * Global Knowledge Preservation & Civilizational Memory Engine helpers (Phase 163).
 * Authoritative enforcement lives in Supabase RPCs (_gcme_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const CURATION_STAGES = [
  "discernment_review",
  "essential_selection",
  "stewardship_curation",
  "legacy_integration",
  "cross_generational_readiness",
  "civilizational_stewardship",
] as const;
export type CurationStage = (typeof CURATION_STAGES)[number];

export const ARCHIVE_TYPES = [
  "wisdom_lesson",
  "operational_discovery",
  "governance_record",
  "support_innovation",
  "gp_contribution",
  "companion_best_practice",
  "transformation_insight",
  "leadership_experience",
] as const;
export type ArchiveType = (typeof ARCHIVE_TYPES)[number];

export const CIVILIZATIONAL_MEMORY_STEWARDSHIP_REVIEW_TYPES = [
  "essential_knowledge",
  "outdated_knowledge",
  "identity_shaping",
  "leadership_reflection",
  "archival_governance",
  "cross_generational_learning",
] as const;
export type CivilizationalMemoryStewardshipReviewType =
  (typeof CIVILIZATIONAL_MEMORY_STEWARDSHIP_REVIEW_TYPES)[number];

export const LEGACY_ENTRY_TYPES = [
  "leadership_narrative",
  "transformation_history",
  "gp_contribution",
  "governance_milestone",
  "lessons_learned",
  "companion_evolution",
] as const;
export type LegacyEntryType = (typeof LEGACY_ENTRY_TYPES)[number];

export async function getCivilizationalMemoryEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civilizational_memory_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCivilizationalMemoryEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_civilizational_memory_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCivilizationalMemoryAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
