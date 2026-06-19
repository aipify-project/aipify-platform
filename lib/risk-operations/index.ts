import type { RpcClient } from "@/lib/core/rpc-client";

export async function getRiskOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_risk_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performRiskOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_risk_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionRiskOperationsContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_risk_operations_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyRiskOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_risk_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildRiskOperationsLabels } from "./labels";
export type { RiskOperationsLabels } from "./labels";
