import type { RpcClient } from "@/lib/core/rpc-client";

export async function getEmployeeManagementCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_employee_management_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getEmployeeDirectory(
  supabase: RpcClient,
  params: { search?: string; departmentId?: string; role?: string; status?: string } = {},
) {
  const { data, error } = await supabase.rpc("get_employee_directory", {
    p_search: params.search ?? null,
    p_department_id: params.departmentId ?? null,
    p_role: params.role ?? null,
    p_status: params.status ?? null,
    p_manager_user_id: null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getEmployeeManagementInvitations(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_employee_management_invitations");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getEmployeeManagementDepartments(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_employee_management_departments");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getEmployeeAccessControl(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_employee_access_control");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getEmployeeActivityLog(supabase: RpcClient, limit = 50) {
  const { data, error } = await supabase.rpc("get_employee_activity_log", { p_limit: limit });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getEmployeeDashboard(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_employee_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performEmployeeManagementAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_employee_management_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildEmployeeManagementLabels } from "./labels";
export type { EmployeeManagementLabels } from "./labels";
