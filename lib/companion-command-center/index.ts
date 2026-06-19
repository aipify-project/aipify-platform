import type { RpcClient } from "@/lib/core/rpc-client";

export async function getCompanionCommandCenter(
  supabase: RpcClient,
  viewMode?: string,
  section?: string,
) {
  const { data, error } = await supabase.rpc("get_companion_command_center", {
    p_view_mode: viewMode ?? null,
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performCompanionCommandCenterAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_companion_command_center_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionCommandCenterContext(
  supabase: RpcClient,
  query?: string,
  viewMode?: string,
) {
  const { data, error } = await supabase.rpc("get_companion_command_center_context", {
    p_query: query ?? null,
    p_view_mode: viewMode ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyCompanionCommandCenterSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_companion_command_center_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildCompanionCommandCenterLabels } from "./labels";
export type { CompanionCommandCenterLabels } from "./labels";
