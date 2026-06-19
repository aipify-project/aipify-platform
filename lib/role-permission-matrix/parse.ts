import type {
  RolePermissionAuditEntry,
  RolePermissionMatrixCenter,
  RolePermissionMatrixRoleDetail,
  SuperAdminRolePermissionOverview,
} from "./types";

export function parseRolePermissionMatrixCenter(data: unknown): RolePermissionMatrixCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    visibility_rule: typeof row.visibility_rule === "string" ? row.visibility_rule : undefined,
    default_roles: Array.isArray(row.default_roles) ? (row.default_roles as string[]) : [],
    permission_categories: Array.isArray(row.permission_categories) ? (row.permission_categories as string[]) : [],
    roles: Array.isArray(row.roles) ? (row.roles as RolePermissionMatrixCenter["roles"]) : [],
    permissions: Array.isArray(row.permissions) ? (row.permissions as RolePermissionMatrixCenter["permissions"]) : [],
    templates: Array.isArray(row.templates) ? (row.templates as RolePermissionMatrixCenter["templates"]) : [],
    employees_route: typeof row.employees_route === "string" ? row.employees_route : undefined,
    module_access_route: typeof row.module_access_route === "string" ? row.module_access_route : undefined,
  };
}

export function parseRolePermissionMatrixAudit(data: unknown): { found: boolean; audit?: RolePermissionAuditEntry[] } | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    audit: Array.isArray(row.audit) ? (row.audit as RolePermissionAuditEntry[]) : [],
  };
}

export function parseRolePermissionMatrixRoleDetail(data: unknown): RolePermissionMatrixRoleDetail | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    role: row.role as RolePermissionMatrixRoleDetail["role"],
    permissions: Array.isArray(row.permissions)
      ? (row.permissions as RolePermissionMatrixRoleDetail["permissions"])
      : [],
    assigned_employees: Array.isArray(row.assigned_employees)
      ? (row.assigned_employees as RolePermissionMatrixRoleDetail["assigned_employees"])
      : [],
  };
}

export function parseSuperAdminRolePermissionOverview(data: unknown): SuperAdminRolePermissionOverview | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    catalog: row.catalog as Record<string, unknown> | undefined,
    adoption: row.adoption as Record<string, number> | undefined,
    templates: typeof row.templates === "number" ? row.templates : undefined,
    governance_note: typeof row.governance_note === "string" ? row.governance_note : undefined,
  };
}
