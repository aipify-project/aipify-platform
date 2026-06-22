import type { DirectoryPermissionContext } from "@/lib/integration-intelligence/directory/permissions";

export type AppEmployeePermissionContext = DirectoryPermissionContext & {
  has_organization_membership: boolean;
  can_view_employees: boolean;
  can_search_directory_basic: boolean;
  can_search_directory_contact: boolean;
  can_view_roles: boolean;
  can_view_permissions: boolean;
};

export function buildAppEmployeePermissionContext(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  app_suspended: boolean;
  provider_active: boolean;
  has_organization_membership: boolean;
  can_view_employees?: boolean;
  can_search_directory_contact?: boolean;
  can_view_roles?: boolean;
  can_view_permissions?: boolean;
  rate_limit_ok?: boolean;
}): AppEmployeePermissionContext {
  const ownerOrAdmin = ["owner", "admin", "administrator"].includes(input.user_role.toLowerCase());
  const canViewEmployees =
    input.can_view_employees ?? (ownerOrAdmin || input.has_organization_membership);
  const canContact = input.can_search_directory_contact ?? ownerOrAdmin;
  const canRoles = input.can_view_roles ?? ownerOrAdmin;
  const canPermissions = input.can_view_permissions ?? ownerOrAdmin;

  let fieldAccess: AppEmployeePermissionContext["field_access"] = "directory.search.basic";
  if (canContact) fieldAccess = "directory.search.contact";
  if (canPermissions) fieldAccess = "directory.search.sensitive";

  return {
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    app_suspended: input.app_suspended,
    provider_active: input.provider_active,
    field_access: fieldAccess,
    rate_limit_ok: input.rate_limit_ok ?? true,
    has_organization_membership: input.has_organization_membership,
    can_view_employees: canViewEmployees && input.has_organization_membership,
    can_search_directory_basic: canViewEmployees && input.has_organization_membership,
    can_search_directory_contact: canContact && input.has_organization_membership,
    can_view_roles: canRoles && input.has_organization_membership,
    can_view_permissions: canPermissions && input.has_organization_membership,
  };
}

export function assertAppEmployeeDirectoryAllowed(ctx: AppEmployeePermissionContext): string | null {
  if (!ctx.has_organization_membership) return "permission_denied";
  if (ctx.app_suspended) return "activation_pending";
  if (!ctx.provider_active) return "provider_missing";
  if (!ctx.rate_limit_ok) return "permission_denied";
  if (!ctx.can_view_employees) return "permission_denied";
  return null;
}

export function resolveAppEmployeePermissionScope(
  ctx: AppEmployeePermissionContext,
): "basic" | "contact" | "sensitive" {
  if (ctx.can_view_permissions) return "sensitive";
  if (ctx.can_search_directory_contact) return "contact";
  return "basic";
}
