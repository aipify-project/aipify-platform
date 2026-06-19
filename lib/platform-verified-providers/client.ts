import type { SupabaseClient } from "@supabase/supabase-js";

export async function getVerifiedProviderRegistry(supabase: SupabaseClient, section?: string) {
  const { data, error } = await supabase.rpc("get_platform_verified_provider_registry", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performVerifiedProviderAction(
  supabase: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { data, error } = await supabase.rpc("perform_platform_verified_provider_action", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getVerifiedProviderMobileSummary(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_platform_verified_provider_mobile_summary");
  if (error) throw new Error(error.message);
  return data;
}
