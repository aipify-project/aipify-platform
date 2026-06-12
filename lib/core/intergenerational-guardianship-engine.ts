/**
 * Intergenerational Guardianship & Human Continuity Engine helpers (Phase 172).
 * Authoritative enforcement lives in Supabase RPCs (_ighce_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const GUARDIANSHIP_MODES = ["guided", "executive_led", "stewardship_focused"] as const;
export type GuardianshipMode = (typeof GUARDIANSHIP_MODES)[number];

export const EXECUTIVE_GUARDIANSHIP_REVIEW_TYPES = [
  "future_stewardship_themes",
  "values_continuity_handoff",
  "intergenerational_responsibility",
  "legacy_resilience_readiness",
  "leadership_guardianship_reflection",
] as const;
export type ExecutiveGuardianshipReviewType = (typeof EXECUTIVE_GUARDIANSHIP_REVIEW_TYPES)[number];

export const VALUES_CONTINUITY_REFLECTION_TYPES = [
  "dignity_reflection",
  "compassion_reflection",
  "integrity_reflection",
  "curiosity_reflection",
  "service_reflection",
  "stewardship_reflection",
  "human_continuity_themes",
  "values_preservation_themes",
] as const;
export type ValuesContinuityReflectionType = (typeof VALUES_CONTINUITY_REFLECTION_TYPES)[number];

export const LEGACY_RESILIENCE_ENTRY_TYPES = [
  "knowledge_transfer",
  "mentorship_continuity",
  "institutional_memory_bridge",
  "leadership_succession_readiness",
  "cultural_continuity",
  "values_transmission",
  "community_legacy_stewardship",
  "intergenerational_learning",
] as const;
export type LegacyResilienceEntryType = (typeof LEGACY_RESILIENCE_ENTRY_TYPES)[number];

export async function getIntergenerationalGuardianshipEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_intergenerational_guardianship_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getIntergenerationalGuardianshipEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_intergenerational_guardianship_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createIntergenerationalGuardianshipAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
