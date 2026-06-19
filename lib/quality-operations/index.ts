import type { RpcClient } from "@/lib/core/rpc-client";

export async function getQualityOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_quality_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performQualityOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_quality_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionQualityOperationsContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_quality_operations_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyQualityOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_quality_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildQualityOperationsLabels } from "./labels";
export type { QualityOperationsLabels } from "./labels";
