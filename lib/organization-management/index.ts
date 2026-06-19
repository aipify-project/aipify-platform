import type { RpcClient } from "@/lib/core/rpc-client";

export async function getOrganizationManagementCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_organization_management_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOrganizationDepartmentDashboard(supabase: RpcClient, departmentId: string) {
  const { data, error } = await supabase.rpc("get_organization_department_dashboard", {
    p_department_id: departmentId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performOrganizationManagementAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_organization_management_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchOrganizationStructure(supabase: RpcClient, query: string) {
  const { data, error } = await supabase.rpc("search_organization_structure", { p_query: query });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionOrganizationContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_organization_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildOrganizationManagementLabels } from "./labels";
export type { OrganizationManagementLabels } from "./labels";
