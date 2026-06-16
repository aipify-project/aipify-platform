/**
 * Organization & Workspace Engine helpers (Phase A.75).
 * Authoritative enforcement lives in Supabase RPCs.
 */

import type { RpcClient } from "./rpc-client";

export const WORKSPACE_ROLES = [
  "owner",
  "administrator",
  "manager",
  "employee",
  "support_agent",
  "moderator",
  "viewer",
  "custom",
] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export const WORKSPACE_STATUSES = ["active", "inactive", "archived"] as const;
export type WorkspaceStatus = (typeof WORKSPACE_STATUSES)[number];

export const WORKSPACE_MEMBER_STATUSES = ["invited", "active", "suspended", "removed"] as const;
export type WorkspaceMemberStatus = (typeof WORKSPACE_MEMBER_STATUSES)[number];

export const WORKSPACE_PERMISSION_KEYS = [
  "workspaces.view",
  "workspaces.manage",
  "workspaces.create",
  "workspaces.members.manage",
  "workspaces.roles.manage",
  "workspaces.settings.manage",
  "workspaces.audit.view",
  "workspaces.switch",
] as const;
export type WorkspacePermissionKey = (typeof WORKSPACE_PERMISSION_KEYS)[number];

export async function getOrganizationWorkspaceEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organization_workspace_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOrganizationWorkspaceEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organization_workspace_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function listOrganizationWorkspaces(
  supabase: RpcClient
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("list_organization_workspaces");
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export async function getCurrentWorkspace(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_current_workspace");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function switchWorkspace(
  supabase: RpcClient,
  workspaceId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("switch_workspace", {
    p_workspace_id: workspaceId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createWorkspaceAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}

export async function saveOrganizationCompanionFoundation(
  supabase: RpcClient,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("save_organization_companion_foundation", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
