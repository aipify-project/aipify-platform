/**
 * Growth & Evolution Engine helpers (Phase A.81).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const GROWTH_EVOLUTION_DIMENSIONS = [
  "operational",
  "knowledge",
  "human",
  "customer",
  "strategic",
] as const;
export type GrowthEvolutionDimension = (typeof GROWTH_EVOLUTION_DIMENSIONS)[number];

export const GROWTH_SIGNAL_TYPES = [
  "improvement_pattern",
  "stagnation_risk",
  "emerging_opportunity",
  "capability_development",
  "healthy_adaptation",
] as const;
export type GrowthSignalType = (typeof GROWTH_SIGNAL_TYPES)[number];

export const GROWTH_RECOMMENDATION_STATUSES = ["pending", "accepted", "dismissed", "deferred"] as const;
export type GrowthRecommendationStatus = (typeof GROWTH_RECOMMENDATION_STATUSES)[number];

export const GROWTH_LEARNING_CYCLE_CADENCES = ["weekly", "biweekly", "monthly", "quarterly"] as const;
export type GrowthLearningCycleCadence = (typeof GROWTH_LEARNING_CYCLE_CADENCES)[number];

export const GROWTH_EVOLUTION_PERMISSION_KEYS = [
  "growth_evolution.view",
  "growth_evolution.manage",
  "growth_evolution.recommendations.review",
  "growth_evolution.export",
] as const;
export type GrowthEvolutionPermissionKey = (typeof GROWTH_EVOLUTION_PERMISSION_KEYS)[number];

export async function getGrowthEvolutionEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_growth_evolution_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGrowthEvolutionEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_growth_evolution_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function listGrowthEvolutionRecommendations(
  supabase: RpcClient,
  status = "pending"
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("list_growth_evolution_recommendations", { p_status: status });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export function createGrowthEvolutionAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
