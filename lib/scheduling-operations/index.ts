import type { RpcClient } from "@/lib/core/rpc-client";

export async function getSchedulingOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_scheduling_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performSchedulingOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_scheduling_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionSchedulingOperationsContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_scheduling_operations_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMySchedulingOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_scheduling_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildSchedulingOperationsLabels } from "./labels";
export type { SchedulingOperationsLabels } from "./labels";
