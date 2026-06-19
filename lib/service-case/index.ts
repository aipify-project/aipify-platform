import type { RpcClient } from "@/lib/core/rpc-client";

export async function getServiceCaseCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_service_case_center", { p_section: section ?? null });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getServiceCustomerSuccessCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_service_customer_success_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performServiceCaseAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_service_case_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionServiceCaseContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_service_case_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyServiceCaseSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_service_case_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildServiceCaseLabels } from "./labels";
export type { ServiceCaseLabels } from "./labels";
