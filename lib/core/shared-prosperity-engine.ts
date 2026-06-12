/**
 * Civilizational Stewardship & Shared Prosperity Engine helpers (Phase 167).
 * Authoritative enforcement lives in Supabase RPCs (_cspe_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const SHARED_PROSPERITY_MATURITY_STAGES = [
  "emerging_stewardship",
  "opportunity_awareness",
  "ecosystem_engagement",
  "regenerative_prosperity",
  "shared_success_readiness",
] as const;
export type SharedProsperityMaturityStage = (typeof SHARED_PROSPERITY_MATURITY_STAGES)[number];

export const STEWARDSHIP_REVIEW_TYPES = [
  "who_benefits",
  "unintentional_exclusion",
  "accessible_opportunity",
  "responsibilities_of_growth",
  "legacy_creating",
  "companion_stewardship",
] as const;
export type StewardshipReviewType = (typeof STEWARDSHIP_REVIEW_TYPES)[number];

export const OPPORTUNITY_INITIATIVE_TYPES = [
  "mentorship",
  "leadership_development",
  "gp_enablement",
  "knowledge_sharing",
  "educational_contribution",
  "professional_advancement",
] as const;
export type OpportunityInitiativeType = (typeof OPPORTUNITY_INITIATIVE_TYPES)[number];

export const PROSPERITY_MEMORY_TYPES = [
  "leadership_reflection",
  "community_contribution",
  "gp_success_narrative",
  "knowledge_initiative",
  "stewardship_review",
  "institutional_milestone",
] as const;
export type ProsperityMemoryType = (typeof PROSPERITY_MEMORY_TYPES)[number];

export async function getSharedProsperityEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_shared_prosperity_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSharedProsperityEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_shared_prosperity_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createSharedProsperityAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
