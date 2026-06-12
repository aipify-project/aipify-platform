/**
 * Resource Planning Engine helpers (Phase A.63).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const RESOURCE_TYPES = [
  "personnel",
  "time",
  "budget",
  "expertise",
  "external_partner",
  "technology",
] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const RESOURCE_PLAN_STATUSES = [
  "draft",
  "active",
  "under_review",
  "completed",
  "archived",
] as const;
export type ResourcePlanStatus = (typeof RESOURCE_PLAN_STATUSES)[number];

export async function getResourcePlanningEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_resource_planning_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getResourcePlanningEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_resource_planning_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveResourceSummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_resource_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createResourcePlanningAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
