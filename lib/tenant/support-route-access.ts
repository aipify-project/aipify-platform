import { hasPermission, type PermissionKey } from "@/lib/core/permissions";
import type { OrganizationRole } from "@/lib/core/organization";
import type { UserRole } from "./types";

/** Maps legacy users.role to organization RBAC used by lib/core/permissions. */
export function mapLegacyUserRoleToOrganizationRole(role: UserRole): OrganizationRole {
  switch (role) {
    case "owner":
      return "owner";
    case "admin":
      return "administrator";
    case "support":
      return "support_agent";
    case "staff":
      return "manager";
    case "read_only":
    default:
      return "viewer";
  }
}

export const SUPPORT_ROUTE_PERMISSIONS = {
  knowledge: "self_support.view",
  contact: "self_support.view",
  requests: "self_support.view",
  assistant: "self_support.view",
  successCenter: "self_support.view",
  gettingStarted: "self_support.view",
  academy: "self_support.view",
  customerSuccess: "success.view",
  customerHealth: "success.view",
  history: "self_support.view",
} as const satisfies Record<string, PermissionKey>;

export type SupportRouteKey = keyof typeof SUPPORT_ROUTE_PERMISSIONS;

export function canAccessSupportRoute(
  role: UserRole,
  routeKey: SupportRouteKey = "history"
): boolean {
  const permission = SUPPORT_ROUTE_PERMISSIONS[routeKey];
  return hasPermission(mapLegacyUserRoleToOrganizationRole(role), permission);
}
