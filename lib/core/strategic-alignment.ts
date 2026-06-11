/**
 * Strategic Alignment Engine helpers (Phase A.55).
 * Authoritative enforcement lives in Supabase RPCs.
 * Distinct from legacy Strategy Engine at /app/strategy (lib/aipify/strategy/).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const STRATEGIC_OBJECTIVE_PRIORITIES = ["low", "medium", "high", "strategic"] as const;
export type StrategicObjectivePriority = (typeof STRATEGIC_OBJECTIVE_PRIORITIES)[number];

export const STRATEGIC_OBJECTIVE_STATUSES = [
  "planned",
  "active",
  "completed",
  "paused",
  "cancelled",
] as const;
export type StrategicObjectiveStatus = (typeof STRATEGIC_OBJECTIVE_STATUSES)[number];

export const STRATEGIC_OBJECTIVE_LINK_TYPES = [
  "workflow",
  "improvement_initiative",
  "value_metric",
  "executive_priority",
  "business_pack",
] as const;
export type StrategicObjectiveLinkType = (typeof STRATEGIC_OBJECTIVE_LINK_TYPES)[number];

export async function getStrategicAlignmentEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_strategic_alignment_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getStrategicAlignmentEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_strategic_alignment_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveStrategicSummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_strategic_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createStrategicAlignmentAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
