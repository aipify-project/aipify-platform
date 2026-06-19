import type { SupabaseClient } from "@supabase/supabase-js";

export async function getMarketObservatoryCenter(supabase: SupabaseClient, section?: string) {
  const { data, error } = await supabase.rpc("get_organization_market_observatory_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performMarketObservatoryAction(
  supabase: SupabaseClient,
  action_type: string,
  payload: Record<string, unknown> = {}
) {
  const { data, error } = await supabase.rpc("perform_organization_market_observatory_action", {
    p_action_type: action_type,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getMarketObservatoryMobileSummary(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_organization_market_observatory_mobile_summary");
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}
