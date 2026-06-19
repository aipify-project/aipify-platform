import type { Translator } from "@/lib/i18n/translate";

export function buildRolePermissionMatrixLabels(t: Translator) {
  const p = "customerApp.rolePermissionMatrix";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    visibilityRule: t(`${p}.visibilityRule`),
    roles: t(`${p}.roles`),
    permissions: t(`${p}.permissions`),
    templates: t(`${p}.templates`),
    audit: t(`${p}.audit`),
    roleName: t(`${p}.roleName`),
    description: t(`${p}.description`),
    assignedEmployees: t(`${p}.assignedEmployees`),
    departmentScope: t(`${p}.departmentScope`),
    moduleAccess: t(`${p}.moduleAccess`),
    status: t(`${p}.status`),
    applyTemplate: t(`${p}.applyTemplate`),
    createRole: t(`${p}.createRole`),
    save: t(`${p}.save`),
    saved: t(`${p}.saved`),
    accessDenied: t(`${p}.accessDenied`),
    manageEmployees: t(`${p}.manageEmployees`),
    moduleAccessLink: t(`${p}.moduleAccessLink`),
    permissionCategories: t(`${p}.permissionCategories`),
    granted: t(`${p}.granted`),
    denied: t(`${p}.denied`),
    back: t(`${p}.back`),
    auditAction: t(`${p}.auditAction`),
    auditTimestamp: t(`${p}.auditTimestamp`),
    noAuditEntries: t(`${p}.noAuditEntries`),
    noPermissions: t(`${p}.noPermissions`),
  };
}

export type RolePermissionMatrixLabels = ReturnType<typeof buildRolePermissionMatrixLabels>;

export function buildSuperAdminRolePermissionMatrixLabels(t: Translator) {
  const p = "superAdmin.superPortal.rolePermissionMatrix";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    privacyNote: t(`${p}.privacyNote`),
    principle: t(`${p}.principle`),
    governanceNote: t(`${p}.governanceNote`),
    catalog: t(`${p}.catalog`),
    adoption: t(`${p}.adoption`),
    templates: t(`${p}.templates`),
    totalPermissions: t(`${p}.totalPermissions`),
    totalModules: t(`${p}.totalModules`),
    organizations: t(`${p}.organizations`),
    back: t(`${p}.back`),
  };
}
