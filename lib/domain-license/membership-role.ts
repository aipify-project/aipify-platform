/**
 * Domain and Website Kompis management follows the active organization
 * membership. The global users.role value is not a substitute for that
 * membership, even when the context payload copies it into organization_role.
 */
const DOMAIN_MANAGE_MEMBERSHIP_ROLES = new Set([
  "owner",
  "admin",
  "administrator",
  "organization_owner",
  "organization_admin",
]);

export function organizationMembershipCanManageDomains(context: {
  has_organization_membership?: boolean | null;
  organization_role?: string | null;
}): boolean {
  if (context.has_organization_membership !== true) return false;
  const role = context.organization_role?.trim().toLowerCase() ?? "";
  return DOMAIN_MANAGE_MEMBERSHIP_ROLES.has(role);
}
