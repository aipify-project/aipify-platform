import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCompanionMarketplaceCenter(supabase: SupabaseClient, section?: string) {
  const { data, error } = await supabase.rpc("get_organization_companion_marketplace_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performCompanionMarketplaceAction(
  supabase: SupabaseClient,
  action_type: string,
  payload: Record<string, unknown> = {}
) {
  const { data, error } = await supabase.rpc("perform_organization_companion_marketplace_action", {
    p_payload: { action_type, ...payload },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCompanionMarketplaceMobileSummary(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_organization_companion_marketplace_mobile_summary");
  if (error) throw new Error(error.message);
  return data;
}
