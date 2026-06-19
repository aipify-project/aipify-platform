import type { SupabaseClient } from "@supabase/supabase-js";

export async function getPlatformCustomerSuccessHubCenter(
  supabase: SupabaseClient,
  section?: string
) {
  const { data, error } = await supabase.rpc("get_platform_customer_success_hub_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performPlatformCustomerSuccessHubAction(
  supabase: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase.rpc("perform_platform_customer_success_hub_action", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return data;
}
