/**
 * Unified Task & Follow-Up Engine helpers (Phase A.62).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const ORGANIZATION_TASK_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type OrganizationTaskPriority = (typeof ORGANIZATION_TASK_PRIORITIES)[number];

export const ORGANIZATION_TASK_STATUSES = [
  "open",
  "in_progress",
  "awaiting_approval",
  "completed",
  "cancelled",
  "overdue",
] as const;
export type OrganizationTaskStatus = (typeof ORGANIZATION_TASK_STATUSES)[number];

export const TASK_SOURCE_TYPES = [
  "meeting",
  "support",
  "incident",
  "workflow",
  "executive_initiative",
  "improvement_program",
  "knowledge_center",
  "manual",
] as const;
export type TaskSourceType = (typeof TASK_SOURCE_TYPES)[number];

export async function getUnifiedTaskFollowUpEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_unified_task_follow_up_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getUnifiedTaskFollowUpEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_unified_task_follow_up_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveTaskSummary(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_executive_task_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createUnifiedTaskFollowUpAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
