import type { RpcClient } from "@/lib/core/rpc-client";

export async function getPeopleOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_people_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performPeopleOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_people_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionPeopleOperationsContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_people_operations_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyPeopleOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_people_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildPeopleOperationsLabels } from "./labels";
export type { PeopleOperationsLabels } from "./labels";
