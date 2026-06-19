import type { RpcClient } from "@/lib/core/rpc-client";

export async function getStrategicIntelligenceCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_strategic_intelligence_operations_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performStrategicIntelligenceAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_strategic_intelligence_operations_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionStrategicIntelligenceContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_strategic_intelligence_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyStrategicIntelligenceSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_strategic_intelligence_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildStrategicIntelligenceLabels } from "./labels";
export type { StrategicIntelligenceLabels } from "./labels";
