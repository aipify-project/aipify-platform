import type { RpcClient } from "@/lib/core/rpc-client";

export async function getMarketingBrandOperationsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_marketing_brand_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performMarketingBrandOperationsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_marketing_brand_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionMarketingBrandOperationsContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_marketing_brand_operations_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyMarketingBrandOperationsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_marketing_brand_operations_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildMarketingBrandOperationsLabels } from "./labels";
export type { MarketingBrandOperationsLabels } from "./labels";
