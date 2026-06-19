import type { SupabaseClient } from "@supabase/supabase-js";

export async function getKnowledgeNetworkCenter(supabase: SupabaseClient, section?: string) {
  const { data, error } = await supabase.rpc("get_organization_knowledge_network_center", {
    p_section: section ?? "overview",
  });
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function performKnowledgeNetworkAction(
  supabase: SupabaseClient,
  action_type: string,
  payload: Record<string, unknown> = {}
) {
  const { data, error } = await supabase.rpc("perform_organization_knowledge_network_action", {
    p_action_type: action_type,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getKnowledgeNetworkMobileSummary(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_organization_knowledge_network_mobile_summary");
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}
