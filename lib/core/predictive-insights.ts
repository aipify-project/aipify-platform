/**
 * Predictive Insights Engine helpers (Phase A.66).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const PREDICTION_TYPES = [
  "support_backlog",
  "workload_overload",
  "missed_objective",
  "declining_adoption",
  "capacity_shortage",
  "customer_satisfaction",
  "training_completion",
] as const;
export type PredictionType = (typeof PREDICTION_TYPES)[number];

export const PREDICTION_CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;
export type PredictionConfidence = (typeof PREDICTION_CONFIDENCE_LEVELS)[number];

export const PREDICTION_RISK_LEVELS = ["low", "medium", "high", "critical"] as const;
export type PredictionRiskLevel = (typeof PREDICTION_RISK_LEVELS)[number];

export const PREDICTION_STATUSES = ["active", "dismissed", "expired", "resolved"] as const;
export type PredictionStatus = (typeof PREDICTION_STATUSES)[number];

export async function getPredictiveInsightsEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_predictive_insights_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPredictiveInsightsEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_predictive_insights_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutivePredictiveSummary(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_predictive_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createPredictiveInsightsAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
