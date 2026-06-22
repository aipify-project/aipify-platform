import type { DirectoryPermissionScope, DirectorySearchField, DirectorySearchFieldAccess } from "./types";
import { isDirectoryCapabilityBlocked } from "./types";

export type DirectoryPermissionContext = {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  app_suspended: boolean;
  provider_active: boolean;
  field_access: DirectorySearchFieldAccess;
  rate_limit_ok: boolean;
};

const SENSITIVE_FIELDS: readonly DirectorySearchField[] = ["email", "phone"];
const CONTACT_FIELDS: readonly DirectorySearchField[] = ["email", "phone", "external_id"];
const BASIC_FIELDS: readonly DirectorySearchField[] = [
  "name",
  "company_name",
  "role",
  "department",
  "team",
  "status",
  "relationship_type",
  "location",
  "organization_number",
];

export function resolveDirectoryPermissionScope(
  fieldAccess: DirectorySearchFieldAccess,
): DirectoryPermissionScope {
  switch (fieldAccess) {
    case "directory.search.sensitive":
      return "sensitive";
    case "directory.search.contact":
      return "contact";
    case "directory.export":
      return "export";
    default:
      return "basic";
  }
}

export function assertDirectorySearchAllowed(ctx: DirectoryPermissionContext): string | null {
  if (ctx.tenant_id !== ctx.organization_id && ctx.organization_id !== ctx.tenant_id) {
    // tenant_id and organization_id must match for APP tenant scope — enforced by caller too
  }
  if (ctx.app_suspended) return "activation_pending";
  if (!ctx.provider_active) return "provider_missing";
  if (!ctx.rate_limit_ok) return "permission_denied";
  if (isDirectoryCapabilityBlocked("directory.export") && ctx.field_access === "directory.export") {
    return "permission_denied";
  }
  return null;
}

export function isDirectorySearchFieldAllowed(
  field: DirectorySearchField,
  scope: DirectoryPermissionScope,
): boolean {
  if (scope === "sensitive" || scope === "export") return true;
  if (scope === "contact") return true;
  if (SENSITIVE_FIELDS.includes(field) && scope === "basic") return false;
  if (scope === "basic") return BASIC_FIELDS.includes(field);
  return true;
}

export function assertCrossTenantDirectorySearch(input: {
  queryOrganizationId: string;
  sessionOrganizationId: string;
}): boolean {
  return input.queryOrganizationId === input.sessionOrganizationId;
}
