import type { RpcClient } from "@/lib/core/rpc-client";

export async function getFinanceOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_finance_operations_center", { p_section: section ?? null });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performFinanceOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_finance_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionFinanceOperationsContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_finance_operations_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyFinanceOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_finance_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildFinanceOperationsLabels } from "./labels";
export type { FinanceOperationsLabels } from "./labels";
