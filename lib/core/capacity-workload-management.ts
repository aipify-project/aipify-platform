/**
 * Capacity & Workload Management Engine helpers (Phase A.64).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const WORKLOAD_SOURCE_TYPES = [
  "task",
  "support",
  "incident",
  "meeting",
  "project",
  "approval",
  "improvement_initiative",
  "workflow",
] as const;
export type WorkloadSourceType = (typeof WORKLOAD_SOURCE_TYPES)[number];

export const CAPACITY_PROFILE_STATUSES = [
  "planned",
  "active",
  "overloaded",
  "unavailable",
  "archived",
] as const;
export type CapacityProfileStatus = (typeof CAPACITY_PROFILE_STATUSES)[number];

export async function getCapacityWorkloadManagementEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_capacity_workload_management_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCapacityWorkloadManagementEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_capacity_workload_management_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveCapacitySummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_capacity_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCapacityWorkloadAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
