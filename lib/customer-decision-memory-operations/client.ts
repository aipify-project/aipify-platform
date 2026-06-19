import type { SupabaseClient } from "@supabase/supabase-js";

export async function getDecisionMemoryCenter(supabase: SupabaseClient, section?: string) {
  const { data, error } = await supabase.rpc("get_organization_companion_decision_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function getDecisionMemoryDetail(supabase: SupabaseClient, decisionKey: string) {
  const { data, error } = await supabase.rpc("get_organization_companion_decision_detail", {
    p_decision_key: decisionKey,
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performDecisionMemoryAction(
  supabase: SupabaseClient,
  action_type: string,
  payload: Record<string, unknown> = {}
) {
  const { data, error } = await supabase.rpc("perform_organization_companion_decision_action", {
    p_payload: { action_type, ...payload },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getDecisionMemoryMobileSummary(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_organization_companion_decision_mobile_summary");
  if (error) throw new Error(error.message);
  return data;
}
