/**
 * Identity, Roles & Permission Engine helpers (Phase A.2).
 * Authoritative enforcement lives in Supabase RPCs (_irp_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const ORGANIZATION_ROLES = [
  "owner",
  "administrator",
  "manager",
  "support_agent",
  "viewer",
] as const;
export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export const BLUEPRINT_DEFAULT_ROLES = [
  "super_admin",
  "owner",
  "administrator",
  "executive",
  "manager",
  "support_agent",
  "moderator",
  "employee",
  "viewer",
  "custom",
] as const;

export const PERMISSION_CATEGORIES = [
  "organization",
  "workspace",
  "knowledge",
  "support",
  "companion",
  "admin",
] as const;
export type PermissionCategory = (typeof PERMISSION_CATEGORIES)[number];

export const USER_STATUSES = ["active", "inactive", "invited", "suspended"] as const;

export async function getIdentityPermissionsDashboard(client: RpcClient) {
  return client.rpc("get_identity_permissions_dashboard");
}

export async function getIdentityPermissionsCard(client: RpcClient) {
  return client.rpc("get_identity_permissions_card");
}

export async function saveIdentityAccessReviewSettings(
  client: RpcClient,
  payload: Record<string, unknown>
) {
  return client.rpc("save_identity_access_review_settings", { p_payload: payload });
}

export async function saveIdentityCompanionPermissionPrefs(
  client: RpcClient,
  payload: Record<string, unknown>
) {
  return client.rpc("save_identity_companion_permission_prefs", { p_payload: payload });
}
