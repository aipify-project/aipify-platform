import type { RpcClient } from "@/lib/core/rpc-client";

export async function getRolePermissionMatrixCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_role_permission_matrix_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getRolePermissionMatrixRole(supabase: RpcClient, roleKey: string) {
  const { data, error } = await supabase.rpc("get_role_permission_matrix_role", { p_role_key: roleKey });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getRolePermissionMatrixAudit(supabase: RpcClient, limit = 50) {
  const { data, error } = await supabase.rpc("get_role_permission_matrix_audit", { p_limit: limit });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performRolePermissionMatrixAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_role_permission_matrix_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSuperAdminRolePermissionMatrixOverview(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_super_admin_role_permission_matrix_overview");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export {
  buildRolePermissionMatrixLabels,
  buildSuperAdminRolePermissionMatrixLabels,
} from "./labels";
export type {
  RolePermissionMatrixLabels,
} from "./labels";
