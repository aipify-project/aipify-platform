import type { RpcClient } from "@/lib/core/rpc-client";

export async function getAutomationOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_automation_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAutomationOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_automation_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionAutomationOperationsContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_automation_operations_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyAutomationOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_automation_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildAutomationOperationsLabels } from "./labels";
export type { AutomationOperationsLabels } from "./labels";
