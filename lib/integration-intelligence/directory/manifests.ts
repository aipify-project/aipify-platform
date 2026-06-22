import type { DirectoryCapabilityManifest, DirectoryProviderManifest } from "./types";

const DIRECTORY_VIEW = "directory.view";
const DIRECTORY_SEARCH = "directory.search";
const DIRECTORY_CONTACT = "directory.contact.read";
const DIRECTORY_SENSITIVE = "directory.sensitive.read";

function searchCapability(
  capability_key: DirectoryCapabilityManifest["capability_key"],
  entity: string,
  relationship_type: NonNullable<DirectoryCapabilityManifest["semantic"]>["relationship_type"],
  entity_type: "person" | "organization",
  permission: string | null = DIRECTORY_SEARCH,
  privacy_sensitive = true,
  supported_search_fields?: DirectoryCapabilityManifest["supported_search_fields"],
): DirectoryCapabilityManifest {
  return {
    capability_key,
    operation: "search",
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 2,
    entity,
    required_permission: permission,
    privacy_sensitive,
    supported_search_fields,
    relationship_types: [relationship_type],
    field_access: "directory.search.basic",
    semantic: {
      entity,
      relationship_type,
      entity_type,
      operations: ["search"],
    },
  };
}

function readCapability(
  capability_key: DirectoryCapabilityManifest["capability_key"],
  entity: string,
  permission: string | null = DIRECTORY_VIEW,
  privacy_sensitive = true,
): DirectoryCapabilityManifest {
  return {
    capability_key,
    operation: "read",
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1,
    entity,
    required_permission: permission,
    privacy_sensitive,
    field_access: "directory.search.basic",
  };
}

/** Organization Directory provider manifests — discovery-first, no false production_ready. */
export const DIRECTORY_PROVIDER_MANIFESTS: readonly DirectoryProviderManifest[] = [
  {
    provider_key: "organization_directory_core",
    display_name_key: "customerApp.companionPlatformKnowledge.directory.providers.organization_directory_core",
    source_engine: "organization_directory",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key: "customerApp.companionPlatformKnowledge.directory.searchTerms.organization_directory_core",
    capabilities: [
      readCapability("directory.search", "directory_record", DIRECTORY_SEARCH),
      readCapability("person.read", "person", DIRECTORY_VIEW, true),
      readCapability("organization.read", "organization", DIRECTORY_VIEW),
      readCapability("relationship.read", "relationship", DIRECTORY_VIEW),
    ],
  },
  {
    provider_key: "crm_customer_directory",
    display_name_key: "customerApp.companionPlatformKnowledge.directory.providers.crm_customer_directory",
    source_engine: "customer_relationship",
    implementation_status: "partial",
    business_pack_key: "sales_pack",
    search_terms_key: "customerApp.companionPlatformKnowledge.directory.searchTerms.crm_customer_directory",
    capabilities: [
      searchCapability("customer.search", "customer", "customer", "person", DIRECTORY_SEARCH, true, [
        "name",
        "email",
        "phone",
        "company_name",
        "external_id",
        "status",
      ]),
      searchCapability("lead.search", "lead", "lead", "person", DIRECTORY_SEARCH, true, [
        "name",
        "email",
        "phone",
        "company_name",
        "status",
        "location",
      ]),
      searchCapability("contact.search", "contact", "contact", "person", DIRECTORY_CONTACT, true, [
        "name",
        "email",
        "phone",
        "role",
      ]),
    ],
  },
  {
    provider_key: "hr_employee_directory",
    display_name_key: "customerApp.companionPlatformKnowledge.directory.providers.hr_employee_directory",
    source_engine: "workforce_employee_directory",
    implementation_status: "partial",
    business_pack_key: "hr_pack",
    search_terms_key: "customerApp.companionPlatformKnowledge.directory.searchTerms.hr_employee_directory",
    capabilities: [
      searchCapability("employee.search", "employee", "employee", "person", DIRECTORY_SEARCH, true, [
        "name",
        "email",
        "phone",
        "role",
        "status",
      ]),
    ],
  },
  {
    provider_key: "community_member_directory",
    display_name_key: "customerApp.companionPlatformKnowledge.directory.providers.community_member_directory",
    source_engine: "community_network_center",
    implementation_status: "specification_only",
    business_pack_key: "community_pack",
    search_terms_key: "customerApp.companionPlatformKnowledge.directory.searchTerms.community_member_directory",
    capabilities: [
      searchCapability("member.search", "member", "member", "person", DIRECTORY_SENSITIVE, true, [
        "name",
        "email",
        "phone",
        "external_id",
        "status",
      ]),
    ],
  },
  {
    provider_key: "partner_directory",
    display_name_key: "customerApp.companionPlatformKnowledge.directory.providers.partner_directory",
    source_engine: "growth_partner_attribution",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key: "customerApp.companionPlatformKnowledge.directory.searchTerms.partner_directory",
    capabilities: [
      searchCapability("partner.search", "partner", "partner", "organization", DIRECTORY_SEARCH, false, [
        "company_name",
        "organization_number",
        "status",
      ]),
      searchCapability("seller.search", "seller", "seller", "person", DIRECTORY_SEARCH, true, [
        "name",
        "email",
        "role",
      ]),
    ],
  },
  {
    provider_key: "commerce_customer_directory",
    display_name_key: "customerApp.companionPlatformKnowledge.directory.providers.commerce_customer_directory",
    source_engine: "commerce_customer",
    implementation_status: "partial",
    business_pack_key: "commerce_pack",
    search_terms_key: "customerApp.companionPlatformKnowledge.directory.searchTerms.commerce_customer_directory",
    capabilities: [
      searchCapability("customer.search", "customer", "customer", "person", DIRECTORY_SEARCH, true, [
        "name",
        "email",
        "phone",
        "external_id",
      ]),
    ],
  },
  {
    provider_key: "booking_customer_directory",
    display_name_key: "customerApp.companionPlatformKnowledge.directory.providers.booking_customer_directory",
    source_engine: "appointment_booking",
    implementation_status: "partial",
    business_pack_key: "appointments_services",
    search_terms_key: "customerApp.companionPlatformKnowledge.directory.searchTerms.booking_customer_directory",
    capabilities: [
      searchCapability("customer.search", "customer", "customer", "person", DIRECTORY_SEARCH, true, [
        "name",
        "email",
        "phone",
      ]),
    ],
  },
  {
    provider_key: "supplier_directory",
    display_name_key: "customerApp.companionPlatformKnowledge.directory.providers.supplier_directory",
    source_engine: "supplier_intelligence",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key: "customerApp.companionPlatformKnowledge.directory.searchTerms.supplier_directory",
    capabilities: [
      searchCapability("supplier.search", "supplier", "supplier", "organization", DIRECTORY_SEARCH, false, [
        "company_name",
        "organization_number",
        "status",
      ]),
    ],
  },
];
