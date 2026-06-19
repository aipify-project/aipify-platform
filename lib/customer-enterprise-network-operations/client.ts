import type { SupabaseClient } from "@supabase/supabase-js";

export async function getEnterpriseNetworkCenter(supabase: SupabaseClient, section?: string) {
  const { data, error } = await supabase.rpc("get_organization_enterprise_network_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performEnterpriseNetworkAction(
  supabase: SupabaseClient,
  action_type: string,
  payload: Record<string, unknown> = {}
) {
  const { data, error } = await supabase.rpc("perform_organization_enterprise_network_action", {
    p_payload: { action_type, ...payload },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getEnterpriseNetworkMobileSummary(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_organization_enterprise_network_mobile_summary");
  if (error) throw new Error(error.message);
  return data;
}
