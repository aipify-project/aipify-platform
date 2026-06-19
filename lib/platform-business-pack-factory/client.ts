import type { SupabaseClient } from "@supabase/supabase-js";

export async function getPlatformBusinessPackFactoryCenter(
  supabase: SupabaseClient,
  section?: string
) {
  const { data, error } = await supabase.rpc("get_platform_business_pack_factory_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performPlatformBusinessPackFactoryAction(
  supabase: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase.rpc("perform_platform_business_pack_factory_action", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return data;
}
