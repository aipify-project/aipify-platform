import type { RpcClient } from "@/lib/core/rpc-client";

export async function getAnalyticsCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_analytics_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getExecutiveInsightsCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_executive_insights_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAnalyticsAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_analytics_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionAnalyticsContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_analytics_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyAnalyticsSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_analytics_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildAnalyticsManagementLabels } from "./labels";
export type { AnalyticsManagementLabels } from "./labels";
