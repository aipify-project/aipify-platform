/**
 * Canonical organization role checks for Customer APP server gates.
 * Matches Core menu capability `owner_admin` / `manager_plus` semantics.
 */

export type OrganizationRoleRequirement = "any" | "owner_admin" | "manager_plus";

export function normalizeOrganizationRole(role: string | null | undefined): string {
  return (role ?? "").toLowerCase().replace(/\s+/g, "_");
}

export function isOrganizationOwnerAdminRole(role: string | null | undefined): boolean {
  const normalized = normalizeOrganizationRole(role);
  if (!normalized) return false;
  return (
    normalized.includes("owner") ||
    normalized.includes("admin") ||
    normalized === "organization_owner" ||
    normalized === "organization_admin"
  );
}

export function organizationRoleAllows(
  required: OrganizationRoleRequirement,
  role: string | null | undefined
): boolean {
  if (required === "any") return true;
  if (required === "owner_admin") return isOrganizationOwnerAdminRole(role);
  const normalized = normalizeOrganizationRole(role);
  return (
    isOrganizationOwnerAdminRole(role) ||
    normalized.includes("manager") ||
    normalized === "organization_manager"
  );
}
