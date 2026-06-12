/**
 * Goals & OKR Engine helpers (Phase A.65).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const OKR_HIERARCHY_LEVELS = ["company", "department", "team", "individual"] as const;
export type OkrHierarchyLevel = (typeof OKR_HIERARCHY_LEVELS)[number];

export const OKR_PRIORITIES = ["low", "medium", "high", "strategic"] as const;
export type OkrPriority = (typeof OKR_PRIORITIES)[number];

export const OKR_STATUSES = ["draft", "active", "on_track", "at_risk", "completed", "archived"] as const;
export type OkrStatus = (typeof OKR_STATUSES)[number];

export async function getGoalsOkrEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_goals_okr_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGoalsOkrEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_goals_okr_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveOkrSummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_okr_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createGoalsOkrAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
