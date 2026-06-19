import type { RpcClient } from "@/lib/core/rpc-client";

export async function getInventoryOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_inventory_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performInventoryOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_inventory_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionInventoryOperationsContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_inventory_operations_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyInventoryOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_inventory_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildInventoryOperationsLabels } from "./labels";
export type { InventoryOperationsLabels } from "./labels";
