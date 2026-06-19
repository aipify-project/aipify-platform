import type { SupabaseClient } from "@supabase/supabase-js";

export async function getFutureReadinessCenter(supabase: SupabaseClient, section?: string) {
  const { data, error } = await supabase.rpc("get_organization_future_readiness_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performFutureReadinessAction(
  supabase: SupabaseClient,
  action_type: string,
  payload: Record<string, unknown> = {}
) {
  const { data, error } = await supabase.rpc("perform_organization_future_readiness_action", {
    p_payload: { action_type, ...payload },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getFutureReadinessMobileSummary(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_organization_future_readiness_mobile_summary");
  if (error) throw new Error(error.message);
  return data;
}
