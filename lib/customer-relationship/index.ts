import type { RpcClient } from "@/lib/core/rpc-client";

export async function getCustomerRelationshipCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_customer_relationship_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getLeadManagementCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_lead_management_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performCustomerRelationshipAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_customer_relationship_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchCustomerRelationshipRecords(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("search_customer_relationship_records", {
    p_query: query ?? "",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionCustomerRelationshipContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_customer_relationship_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyCustomerRelationshipSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_customer_relationship_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildCustomerRelationshipLabels } from "./labels";
export type { CustomerRelationshipLabels } from "./labels";
