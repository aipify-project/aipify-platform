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
  adapter_available = false,
  entity_aliases?: DirectoryCapabilityManifest["semantic"] extends infer S
    ? S extends { entity_aliases?: infer A }
      ? A
      : never
    : never,
): DirectoryCapabilityManifest {
  return {
    capability_key,
    operation: "search",
    adapter_available,
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
      operations: ["search", "find", "list", "count", "inspect"],
      entity_aliases: entity_aliases as DirectoryCapabilityManifest["semantic"] extends infer S
        ? S extends { entity_aliases?: infer A }
          ? A
          : undefined
        : undefined,
    },
  };
}

function readCapability(
  capability_key: DirectoryCapabilityManifest["capability_key"],
  entity: string,
  permission: string | null = DIRECTORY_VIEW,
  privacy_sensitive = true,
  adapter_available = false,
): DirectoryCapabilityManifest {
  return {
    capability_key,
    operation: "read",
    adapter_available,
    approval_required: false,
    reversible: true,
    risk_level: 1,
    entity,
    required_permission: permission,
    privacy_sensitive,
    field_access: "directory.search.basic",
  };
}

const EMPLOYEES_VIEW = "employees.view";
const ROLES_VIEW = "roles.view";
const CUSTOMERS_VIEW = "customers.view";
const SALES_VIEW = "sales.view";

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
      readCapability("directory.search", "directory_record", DIRECTORY_SEARCH, false, true),
      readCapability("person.read", "person", CUSTOMERS_VIEW, true, true),
      readCapability("organization.read", "organization", CUSTOMERS_VIEW, true, true),
      readCapability("relationship.read", "relationship", CUSTOMERS_VIEW, false, true),
      searchCapability(
        "customer.search",
        "customer",
        "customer",
        "person",
        CUSTOMERS_VIEW,
        true,
        ["name", "email", "phone", "company_name", "organization_number", "external_id", "customer_id", "status", "owner", "location"],
        true,
        {
          en: ["customer", "customers", "client", "account"],
          no: ["kunde", "kunder", "kunden"],
          sv: ["kund", "kunder"],
          da: ["kunde", "kunder"],
          es: ["cliente", "clientes"],
          pl: ["klient", "klienci", "klienta"],
          uk: ["клієнт", "клієнти"],
        },
      ),
      readCapability("customer.read", "customer", CUSTOMERS_VIEW, true, true),
      searchCapability(
        "lead.search",
        "lead",
        "lead",
        "person",
        SALES_VIEW,
        true,
        ["name", "email", "phone", "company_name", "lead_id", "status", "lead_source", "owner", "pipeline_stage"],
        true,
        {
          en: ["lead", "leads", "prospect"],
          no: ["lead", "leads", "prospekt"],
          sv: ["lead", "leads", "prospekt"],
          da: ["lead", "leads", "prospekt"],
          es: ["lead", "leads", "prospecto"],
          pl: ["lead", "leads", "prospekt"],
          uk: ["лід", "ліди"],
        },
      ),
      readCapability("lead.read", "lead", SALES_VIEW, true, true),
      searchCapability(
        "prospect.search",
        "prospect",
        "prospect",
        "person",
        SALES_VIEW,
        true,
        ["name", "company_name", "email", "status"],
        true,
        {
          en: ["prospect", "prospects"],
          no: ["prospekt", "prospekter"],
          sv: ["prospekt", "prospekt"],
          da: ["prospekt", "prospekter"],
          es: ["prospecto", "prospectos"],
          pl: ["prospekt", "prospekty"],
          uk: ["проспект", "проспекти"],
        },
      ),
      searchCapability(
        "contact.search",
        "contact",
        "contact",
        "person",
        CUSTOMERS_VIEW,
        true,
        ["name", "email", "phone", "role", "company_name"],
        true,
        {
          en: ["contact", "contacts"],
          no: ["kontakt", "kontaktperson"],
          sv: ["kontakt", "kontaktperson"],
          da: ["kontakt", "kontaktperson"],
          es: ["contacto", "contactos"],
          pl: ["kontakt", "kontakty"],
          uk: ["контакт", "контакти"],
        },
      ),
      readCapability("contact.read", "contact", CUSTOMERS_VIEW, true, true),
      readCapability("opportunity.read", "opportunity", SALES_VIEW, true, true),
      readCapability("pipeline.read", "pipeline", SALES_VIEW, false, true),
      readCapability("customer_owner.read", "customer_owner", CUSTOMERS_VIEW, false, true),
      readCapability("attribution.read", "attribution", SALES_VIEW, false, true),
    ],
  },
  {
    provider_key: "app_employee_directory",
    display_name_key: "customerApp.companionPlatformKnowledge.directory.providers.app_employee_directory",
    source_engine: "app_organization_employee_directory",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key: "customerApp.companionPlatformKnowledge.directory.searchTerms.app_employee_directory",
    capabilities: [
      readCapability("directory.search", "directory_record", DIRECTORY_SEARCH, false, true),
      readCapability("person.read", "person", EMPLOYEES_VIEW, true, true),
      readCapability("relationship.read", "relationship", EMPLOYEES_VIEW, false, true),
      searchCapability(
        "employee.search",
        "employee",
        "employee",
        "person",
        EMPLOYEES_VIEW,
        true,
        ["name", "email", "phone", "role", "department", "team", "status", "external_id"],
        true,
        {
          en: ["employee", "employees", "staff", "team member", "colleague"],
          no: ["ansatt", "ansatte", "medarbeider", "kollega"],
          sv: ["anställd", "anställda", "medarbetare"],
          da: ["medarbejder", "medarbejdere", "ansat"],
          es: ["empleado", "empleados", "personal"],
          pl: ["pracownik", "pracownicy", "zespół"],
          uk: ["співробітник", "співробітники", "працівник"],
        },
      ),
      readCapability("employee.read", "employee", EMPLOYEES_VIEW, true, true),
      readCapability("role.read", "role", ROLES_VIEW, false, true),
      readCapability("team.read", "team", EMPLOYEES_VIEW, false, true),
      readCapability("department.read", "department", EMPLOYEES_VIEW, false, true),
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
