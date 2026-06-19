import type { RpcClient } from "@/lib/core/rpc-client";

export async function getProjectExecutionCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_project_execution_center", { p_section: section ?? null });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performProjectExecutionAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_project_execution_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionProjectExecutionContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_project_execution_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyProjectExecutionSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_project_execution_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildProjectExecutionLabels } from "./labels";
export type { ProjectExecutionLabels } from "./labels";
