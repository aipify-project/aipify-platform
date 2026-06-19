import type { RpcClient } from "@/lib/core/rpc-client";

export async function getSalesRevenuePipelineCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_sales_revenue_pipeline_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performSalesRevenuePipelineAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_sales_revenue_pipeline_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionSalesRevenuePipelineContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_sales_revenue_pipeline_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMySalesRevenuePipelineSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_sales_revenue_pipeline_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildSalesRevenuePipelineLabels } from "./labels";
export type { SalesRevenuePipelineLabels } from "./labels";
