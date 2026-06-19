import type { RpcClient } from "@/lib/core/rpc-client";

export async function getFormsDataCollectionCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_forms_data_collection_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performFormsDataCollectionAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_forms_data_collection_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionFormsDataCollectionContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_forms_data_collection_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyFormsDataCollectionSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_forms_data_collection_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildFormsDataCollectionLabels } from "./labels";
export type { FormsDataCollectionLabels } from "./labels";
