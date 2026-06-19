import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCustomerRevenueOperationsCenter(supabase: SupabaseClient, section?: string) {
  const { data, error } = await supabase.rpc("get_organization_revenue_operations_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performCustomerRevenueOperationsAction(
  supabase: SupabaseClient,
  action_type: string,
  payload: Record<string, unknown> = {}
) {
  const { data, error } = await supabase.rpc("perform_organization_revenue_operations_action", {
    p_action_type: action_type,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCustomerRevenueOperationsMobileSummary(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_organization_revenue_operations_mobile_summary");
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}
