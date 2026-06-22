import type { DirectoryPermissionContext } from "@/lib/integration-intelligence/directory/permissions";

export type SupplierDirectoryPermissionContext = DirectoryPermissionContext & {
  has_procurement_entitlement: boolean;
  can_view_suppliers: boolean;
  can_view_procurement: boolean;
  can_view_contracts: boolean;
  can_view_supplier_performance: boolean;
  can_search_directory_contact: boolean;
};

export function buildSupplierDirectoryPermissionContext(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  app_suspended: boolean;
  provider_active: boolean;
  has_procurement_entitlement?: boolean;
  can_view_suppliers?: boolean;
  can_view_procurement?: boolean;
  can_view_contracts?: boolean;
  can_view_supplier_performance?: boolean;
  can_search_directory_contact?: boolean;
  rate_limit_ok?: boolean;
}): SupplierDirectoryPermissionContext {
  const ownerOrAdmin = ["owner", "admin", "administrator"].includes(input.user_role.toLowerCase());
  const entitled = input.has_procurement_entitlement ?? true;
  const canProcurement = input.can_view_procurement ?? entitled;
  const canSuppliers = input.can_view_suppliers ?? canProcurement;
  const canContracts = input.can_view_contracts ?? canProcurement;
  const canPerformance = input.can_view_supplier_performance ?? canProcurement;
  const canContact = input.can_search_directory_contact ?? ownerOrAdmin;

  let fieldAccess: SupplierDirectoryPermissionContext["field_access"] = "directory.search.basic";
  if (canContact) fieldAccess = "directory.search.contact";
  if (canPerformance && canContracts) fieldAccess = "directory.search.sensitive";

  return {
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    app_suspended: input.app_suspended,
    provider_active: input.provider_active,
    field_access: fieldAccess,
    rate_limit_ok: input.rate_limit_ok ?? true,
    has_procurement_entitlement: entitled,
    can_view_suppliers: canSuppliers,
    can_view_procurement: canProcurement,
    can_view_contracts: canContracts,
    can_view_supplier_performance: canPerformance,
    can_search_directory_contact: canContact,
  };
}

export function assertSupplierDirectoryAllowed(ctx: SupplierDirectoryPermissionContext): string | null {
  if (!ctx.has_procurement_entitlement) return "provider_missing";
  if (ctx.app_suspended) return "activation_pending";
  if (!ctx.provider_active) return "provider_missing";
  if (!ctx.rate_limit_ok) return "permission_denied";
  if (!ctx.can_view_suppliers && !ctx.can_view_procurement) return "permission_denied";
  return null;
}

export function resolveSupplierDirectoryPermissionScope(
  ctx: SupplierDirectoryPermissionContext,
): "basic" | "contact" | "sensitive" {
  if (ctx.can_view_supplier_performance && ctx.can_view_contracts) return "sensitive";
  if (ctx.can_search_directory_contact) return "contact";
  return "basic";
}

export function resolveSupplierRelationshipPresentation(input: {
  is_marketplace_candidate?: boolean;
  is_partner?: boolean;
  is_customer?: boolean;
}): {
  is_active_supplier: boolean;
  is_partner: false;
  is_customer: false;
  marketplace_is_not_supplier: true;
} {
  return {
    is_active_supplier: input.is_marketplace_candidate !== true,
    is_partner: false,
    is_customer: false,
    marketplace_is_not_supplier: true,
  };
}
