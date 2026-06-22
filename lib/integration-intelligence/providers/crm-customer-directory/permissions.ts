import type { DirectoryPermissionContext } from "@/lib/integration-intelligence/directory/permissions";

export type CrmDirectoryPermissionContext = DirectoryPermissionContext & {
  has_crm_entitlement: boolean;
  can_view_customers: boolean;
  can_view_sales: boolean;
  can_view_attribution: boolean;
  can_search_directory_contact: boolean;
  can_view_customer_health: boolean;
};

export function buildCrmDirectoryPermissionContext(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  app_suspended: boolean;
  provider_active: boolean;
  has_crm_entitlement?: boolean;
  can_view_customers?: boolean;
  can_view_sales?: boolean;
  can_view_attribution?: boolean;
  can_search_directory_contact?: boolean;
  can_view_customer_health?: boolean;
  rate_limit_ok?: boolean;
}): CrmDirectoryPermissionContext {
  const ownerOrAdmin = ["owner", "admin", "administrator"].includes(input.user_role.toLowerCase());
  const entitled = input.has_crm_entitlement ?? true;
  const canCustomers = input.can_view_customers ?? entitled;
  const canSales = input.can_view_sales ?? entitled;
  const canAttribution = input.can_view_attribution ?? canSales;
  const canContact = input.can_search_directory_contact ?? ownerOrAdmin;
  const canHealth = input.can_view_customer_health ?? canSales;

  let fieldAccess: CrmDirectoryPermissionContext["field_access"] = "directory.search.basic";
  if (canContact) fieldAccess = "directory.search.contact";
  if (canHealth && canAttribution) fieldAccess = "directory.search.sensitive";

  return {
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    app_suspended: input.app_suspended,
    provider_active: input.provider_active,
    field_access: fieldAccess,
    rate_limit_ok: input.rate_limit_ok ?? true,
    has_crm_entitlement: entitled,
    can_view_customers: canCustomers,
    can_view_sales: canSales,
    can_view_attribution: canAttribution,
    can_search_directory_contact: canContact,
    can_view_customer_health: canHealth,
  };
}

export function assertCrmDirectoryAllowed(ctx: CrmDirectoryPermissionContext): string | null {
  if (!ctx.has_crm_entitlement) return "provider_missing";
  if (ctx.app_suspended) return "activation_pending";
  if (!ctx.provider_active) return "provider_missing";
  if (!ctx.rate_limit_ok) return "permission_denied";
  if (!ctx.can_view_customers && !ctx.can_view_sales) return "permission_denied";
  return null;
}

export function resolveCrmDirectoryPermissionScope(
  ctx: CrmDirectoryPermissionContext,
): "basic" | "contact" | "sensitive" {
  if (ctx.can_view_customer_health && ctx.can_view_attribution) return "sensitive";
  if (ctx.can_search_directory_contact) return "contact";
  return "basic";
}

export function resolveCrmOwnershipPresentation(input: {
  customer_type?: string | null;
  partner_owned?: boolean;
  assigned_seller?: string | null;
  partner_attribution?: string | null;
}): {
  platform_ownership: true;
  owner_reference: string | null;
  attribution_reference: string | null;
  partner_is_owner: false;
} {
  return {
    platform_ownership: true,
    owner_reference: input.assigned_seller ?? null,
    attribution_reference:
      input.partner_owned === true
        ? input.partner_attribution ?? "partner_attribution"
        : input.customer_type === "partner"
          ? "referring_partner"
          : null,
    partner_is_owner: false,
  };
}
