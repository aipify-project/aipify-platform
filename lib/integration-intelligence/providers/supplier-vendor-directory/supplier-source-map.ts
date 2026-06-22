import type { DirectoryCapabilityKey } from "@/lib/integration-intelligence/directory/types";

export type SupplierDirectorySourceStatus =
  | "live"
  | "partial"
  | "placeholder"
  | "missing"
  | "specification_only";

export type SupplierDirectorySourceDefinition = {
  capability_key: DirectoryCapabilityKey;
  source_kind: "rpc";
  source_id: string;
  provider_key: "supplier_vendor_directory";
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string | null;
  status: SupplierDirectorySourceStatus;
  read_only: boolean;
  limitations: readonly string[];
};

export const SUPPLIER_VENDOR_DIRECTORY_SOURCE_MAP: readonly SupplierDirectorySourceDefinition[] = [
  {
    capability_key: "supplier.search",
    source_kind: "rpc",
    source_id: "get_procurement_operations_center",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_proc532_org()",
    available_fields: [
      "vendors[].id",
      "vendors[].vendor_number",
      "vendors[].vendor_name",
      "vendors[].contact_person",
      "vendors[].email",
      "vendors[].phone",
      "vendors[].organization_number",
      "vendors[].country",
      "vendors[].category_key",
      "vendors[].services",
      "vendors[].status",
      "vendors[].is_preferred",
      "vendors[].risk_status",
      "vendors[].health_status",
    ],
    required_permission: "procurement.view",
    status: "live",
    read_only: true,
    limitations: [
      "Canonical org supplier master from procurement operations — not marketplace candidates.",
      "Vendor list capped by procurement center response.",
    ],
  },
  {
    capability_key: "vendor.search",
    source_kind: "rpc",
    source_id: "get_procurement_operations_center",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_proc532_org()",
    available_fields: ["vendors[]", "suppliers[]"],
    required_permission: "procurement.view",
    status: "live",
    read_only: true,
    limitations: ["Vendor aliases map to supplier organizations — distinct from Aipify Partners."],
  },
  {
    capability_key: "supplier_contact.search",
    source_kind: "rpc",
    source_id: "get_procurement_operations_center",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_proc532_org()",
    available_fields: ["vendors[].contact_person", "vendors[].email", "vendors[].phone"],
    required_permission: "suppliers.view",
    status: "live",
    read_only: true,
    limitations: ["Supplier contacts derived from procurement vendor rows — not APP employees."],
  },
  {
    capability_key: "supplier_contract_status.read",
    source_kind: "rpc",
    source_id: "get_procurement_operations_center",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_proc532_org()",
    available_fields: ["contracts[].status", "contracts[].vendor_name", "contracts[].end_date"],
    required_permission: "contracts.view",
    status: "live",
    read_only: true,
    limitations: ["Active contracts only — historical purchase orders are not active contracts."],
  },
  {
    capability_key: "supplier_performance.read",
    source_kind: "rpc",
    source_id: "get_procurement_operations_center",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_proc532_org()",
    available_fields: [
      "vendors[].delivery_reliability_score",
      "vendors[].health_score",
      "vendors[].risk_status",
      "deliveries[].delivery_status",
    ],
    required_permission: "supplier_performance.view",
    status: "partial",
    read_only: true,
    limitations: ["Performance scores from procurement vendor health — no computed risk without source."],
  },
  {
    capability_key: "manufacturer.search",
    source_kind: "rpc",
    source_id: "get_procurement_operations_center",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_proc532_org()",
    available_fields: ["vendors[].category_key", "vendors[].services"],
    required_permission: "suppliers.view",
    status: "partial",
    read_only: true,
    limitations: ["Manufacturer classification inferred from category_key/services — not a separate registry."],
  },
  {
    capability_key: "distributor.search",
    source_kind: "rpc",
    source_id: "get_procurement_operations_center",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_proc532_org()",
    available_fields: ["vendors[].category_key", "vendors[].services"],
    required_permission: "suppliers.view",
    status: "partial",
    read_only: true,
    limitations: ["Distributor classification inferred from category_key/services."],
  },
  {
    capability_key: "assigned_buyer.read",
    source_kind: "rpc",
    source_id: "get_procurement_operations_center",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_proc532_org()",
    available_fields: ["purchase_requests[].requester_name"],
    required_permission: "procurement.view",
    status: "partial",
    read_only: true,
    limitations: ["Buyer reference from purchase request metadata when linked — not vendor master field."],
  },
  {
    capability_key: "supplier.read",
    source_kind: "rpc",
    source_id: "get_companion_procurement_operations_context",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_proc532_org()",
    available_fields: ["summary"],
    required_permission: "procurement.view",
    status: "partial",
    read_only: true,
    limitations: ["Companion procurement context provides aggregates only — not searchable supplier rows."],
  },
  {
    capability_key: "supplier.search",
    source_kind: "rpc",
    source_id: "get_organization_inventory_center",
    provider_key: "supplier_vendor_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_inv613_org()",
    available_fields: ["supplier_integration_links[]"],
    required_permission: "inventory.view",
    status: "partial",
    read_only: true,
    limitations: [
      "Inventory supplier integration links reference procurement master — no duplicate supplier registry.",
    ],
  },
];

export function getSupplierDirectorySourceDefinition(
  capabilityKey: DirectoryCapabilityKey,
): SupplierDirectorySourceDefinition | null {
  return (
    SUPPLIER_VENDOR_DIRECTORY_SOURCE_MAP.find((entry) => entry.capability_key === capabilityKey) ?? null
  );
}
