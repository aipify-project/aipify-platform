import type { DirectoryCapabilityKey } from "@/lib/integration-intelligence/directory/types";

export type CrmDirectorySourceStatus = "live" | "partial" | "placeholder" | "missing";

export type CrmDirectorySourceDefinition = {
  capability_key: DirectoryCapabilityKey;
  source_kind: "rpc";
  source_id: string;
  provider_key: "crm_customer_directory";
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string | null;
  status: CrmDirectorySourceStatus;
  read_only: boolean;
  limitations: readonly string[];
};

export const CRM_CUSTOMER_DIRECTORY_SOURCE_MAP: readonly CrmDirectorySourceDefinition[] = [
  {
    capability_key: "customer.search",
    source_kind: "rpc",
    source_id: "get_customer_relationship_center",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_crm531_org()",
    available_fields: [
      "customers[].id",
      "customers[].name",
      "customers[].company_name",
      "customers[].email",
      "customers[].phone",
      "customers[].organization_number",
      "customers[].customer_number",
      "customers[].status",
      "customers[].assigned_employee_name",
      "customers[].health_status",
    ],
    required_permission: "customers.view",
    status: "live",
    read_only: true,
    limitations: ["Customer list capped at 100 records from relationship center — use search RPC for targeted lookup."],
  },
  {
    capability_key: "lead.search",
    source_kind: "rpc",
    source_id: "get_lead_management_center",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_crm531_org()",
    available_fields: [
      "leads[].id",
      "leads[].lead_number",
      "leads[].company_name",
      "leads[].contact_name",
      "leads[].email",
      "leads[].status",
      "leads[].lead_source",
      "leads[].follow_up_date",
    ],
    required_permission: "sales.view",
    status: "live",
    read_only: true,
    limitations: ["Open leads from lead management center — distinct from converted customers."],
  },
  {
    capability_key: "customer.search",
    source_kind: "rpc",
    source_id: "search_customer_relationship_records",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_crm517_org()",
    available_fields: ["customers[]", "contacts[]", "leads[]"],
    required_permission: "customers.view",
    status: "live",
    read_only: true,
    limitations: ["Targeted search across customers, contacts, and leads."],
  },
  {
    capability_key: "contact.search",
    source_kind: "rpc",
    source_id: "get_customer_relationship_center",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_crm531_org()",
    available_fields: ["contacts[].full_name", "contacts[].email", "contacts[].customer_name", "contacts[].contact_role"],
    required_permission: "customers.view",
    status: "live",
    read_only: true,
    limitations: ["Contacts linked to customer organizations — not partner ownership."],
  },
  {
    capability_key: "prospect.search",
    source_kind: "rpc",
    source_id: "get_customer_relationship_center",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_crm531_org()",
    available_fields: ["prospects[]"],
    required_permission: "sales.view",
    status: "live",
    read_only: true,
    limitations: ["Prospects are CRM customers with status prospect — not converted accounts."],
  },
  {
    capability_key: "organization.read",
    source_kind: "rpc",
    source_id: "get_customer_relationship_center",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_crm531_org()",
    available_fields: ["organizations[].company_name", "organizations[].organization_number", "organizations[].industry"],
    required_permission: "customers.view",
    status: "live",
    read_only: true,
    limitations: ["Business customer organizations — partner type is attribution metadata only."],
  },
  {
    capability_key: "pipeline.read",
    source_kind: "rpc",
    source_id: "get_customer_relationship_center",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_crm531_org()",
    available_fields: ["pipeline", "opportunities[].stage"],
    required_permission: "sales.view",
    status: "partial",
    read_only: true,
    limitations: ["Pipeline stage counts from relationship center — not full deal write surface."],
  },
  {
    capability_key: "attribution.read",
    source_kind: "rpc",
    source_id: "get_customer_relationship_center",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_crm531_org()",
    available_fields: ["opportunities[].partner_owned"],
    required_permission: "sales.view",
    status: "partial",
    read_only: true,
    limitations: ["Partner attribution on opportunities — never customer ownership."],
  },
  {
    capability_key: "customer.read",
    source_kind: "rpc",
    source_id: "get_companion_customer_relationship_context",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_crm531_org()",
    available_fields: ["summary"],
    required_permission: "customers.view",
    status: "partial",
    read_only: true,
    limitations: ["Companion context provides aggregates only — not searchable customer rows."],
  },
  {
    capability_key: "opportunity.read",
    source_kind: "rpc",
    source_id: "get_sales_revenue_pipeline_center",
    provider_key: "crm_customer_directory",
    auth_model: "supabase_session_rls_organization_id",
    tenant_filter: "_srp521_org()",
    available_fields: ["opportunities[]"],
    required_permission: "sales.view",
    status: "partial",
    read_only: true,
    limitations: ["Revenue pipeline center — opportunity metadata for directory enrichment only."],
  },
];

export function getCrmDirectorySourceDefinition(
  capabilityKey: DirectoryCapabilityKey,
): CrmDirectorySourceDefinition | null {
  return CRM_CUSTOMER_DIRECTORY_SOURCE_MAP.find((entry) => entry.capability_key === capabilityKey) ?? null;
}
