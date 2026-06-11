/**
 * Value Realization Engine helpers (Phase A.48).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const VALUE_CATEGORIES = [
  "support_efficiency",
  "admin_time_savings",
  "onboarding_improvements",
  "repetitive_work_reduction",
  "faster_decision_making",
  "customer_satisfaction",
  "workflow_optimization",
] as const;

export type ValueCategory = (typeof VALUE_CATEGORIES)[number];

export const MEASUREMENT_PERIODS = ["monthly", "quarterly", "annually"] as const;
export type MeasurementPeriod = (typeof MEASUREMENT_PERIODS)[number];

export const BASELINE_TYPES = [
  "support_response_time",
  "resolution_time",
  "manual_task_estimate",
  "approval_turnaround",
  "training_completion",
] as const;

export type BaselineType = (typeof BASELINE_TYPES)[number];

export const VALUE_REPORT_TYPES = [
  "roi",
  "operational_impact",
  "value_realization",
  "strategic_improvement",
] as const;

export type ValueReportType = (typeof VALUE_REPORT_TYPES)[number];

export async function getValueRealizationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_value_realization_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getValueRealizationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_value_realization_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createValueRealizationAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
