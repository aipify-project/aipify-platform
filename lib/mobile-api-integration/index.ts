import type { RpcClient } from "@/lib/core/rpc-client";

export async function getMobileApiIntegrationCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_mobile_api_integration_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performMobileApiIntegrationAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_mobile_api_integration_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionMobileApiIntegrationContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_mobile_api_integration_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildMobileApiIntegrationLabels } from "./labels";
export type { MobileApiIntegrationLabels } from "./labels";
