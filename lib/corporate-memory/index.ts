import type { RpcClient } from "@/lib/core/rpc-client";

export async function getCorporateMemoryCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_corporate_memory_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performCorporateMemoryAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_corporate_memory_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionCorporateMemoryContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_corporate_memory_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyCorporateMemorySummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_corporate_memory_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildCorporateMemoryLabels } from "./labels";
export type { CorporateMemoryLabels } from "./labels";
