import type { RpcClient } from "@/lib/core/rpc-client";

export async function getProcurementOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_procurement_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performProcurementOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_procurement_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionProcurementOperationsContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_procurement_operations_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyProcurementOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_procurement_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildProcurementOperationsLabels } from "./labels";
export type { ProcurementOperationsLabels } from "./labels";
