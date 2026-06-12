/**
 * Global Stewardship & Collective Future Engine helpers (Phase 150).
 * Authoritative enforcement lives in Supabase RPCs (_gscfe_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const GLOBAL_STEWERSHIP_READINESS_LEVELS = [
  "emerging",
  "developing",
  "established",
  "mature",
  "leading",
] as const;
export type GlobalStewardshipReadinessLevel = (typeof GLOBAL_STEWERSHIP_READINESS_LEVELS)[number];

export const EXECUTIVE_STEWARDSHIP_REVIEW_TYPES = [
  "purpose_alignment",
  "employee_wellbeing",
  "technology_responsibility",
  "community_contribution",
  "gp_relationships",
  "knowledge_sharing",
  "future_preparedness",
  "stewardship_reflection",
] as const;
export type ExecutiveStewardshipReviewType = (typeof EXECUTIVE_STEWARDSHIP_REVIEW_TYPES)[number];

export const STEWARDSHIP_FUTURE_SCENARIO_TYPES = [
  "five_year_outlook",
  "ten_year_outlook",
  "intergenerational",
  "cultural_implications",
  "technology_impacts",
  "organizational_legacy",
  "sustainability_opportunity",
  "collective_future_dialogue",
] as const;
export type StewardshipFutureScenarioType = (typeof STEWARDSHIP_FUTURE_SCENARIO_TYPES)[number];

export async function getGlobalStewardshipCollectiveFutureEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_stewardship_collective_future_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGlobalStewardshipCollectiveFutureEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_global_stewardship_collective_future_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createGlobalStewardshipAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {},
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
