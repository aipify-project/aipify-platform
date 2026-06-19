import type { RpcClient } from "@/lib/core/rpc-client";

export async function getGovernanceManagementCenter(supabase: RpcClient, section?: string) {
  const { data, error } = await supabase.rpc("get_governance_management_center", {
    p_section: section ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performGovernanceManagementAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_governance_management_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchGovernanceAudit(
  supabase: RpcClient,
  params: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("search_governance_audit", {
    p_user_id: (params.user_id as string) ?? null,
    p_department_id: (params.department_id as string) ?? null,
    p_business_pack_key: (params.business_pack_key as string) ?? null,
    p_domain_id: (params.domain_id as string) ?? null,
    p_event_category: (params.event_category as string) ?? null,
    p_event_type: (params.event_type as string) ?? null,
    p_from: (params.from as string) ?? null,
    p_to: (params.to as string) ?? null,
    p_limit: (params.limit as number) ?? 50,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionGovernanceContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_governance_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getMyGovernanceSummary(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_my_governance_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildGovernanceManagementLabels } from "./labels";
export type { GovernanceManagementLabels } from "./labels";
