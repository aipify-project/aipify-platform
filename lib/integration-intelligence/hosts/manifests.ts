import type { HostsProviderManifest } from "./types";

const HOSTS_PACK = "aipify_hosts";
const HOSTS_VIEW = "aipify_hosts.view";
const HOSTS_MANAGE = "aipify_hosts.manage";

function readCapability(
  capability_key: HostsProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = HOSTS_VIEW,
  privacy_sensitive = false,
) {
  return {
    capability_key,
    operation: "read" as const,
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1 as const,
    entity,
    required_permission: permission,
    privacy_sensitive,
  };
}

function writeCapability(
  capability_key: HostsProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = HOSTS_MANAGE,
) {
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: true,
    risk_level: 2 as const,
    entity,
    required_permission: permission,
    privacy_sensitive: false,
  };
}

/** Aipify Hosts Business Pack manifests — capability IDs originate here, not in Core orchestrator. */
export const HOSTS_PROVIDER_MANIFESTS: readonly HostsProviderManifest[] = [
  {
    provider_key: "short_term_property",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hosts.providers.short_term_property",
    source_engine: "property_center",
    implementation_status: "partial",
    business_pack_key: HOSTS_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hosts.searchTerms.short_term_property",
    capabilities: [
      readCapability("property.read", "property"),
      readCapability("occupancy.read", "property"),
    ],
  },
  {
    provider_key: "short_term_reservation",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hosts.providers.short_term_reservation",
    source_engine: "booking_center",
    implementation_status: "partial",
    business_pack_key: HOSTS_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hosts.searchTerms.short_term_reservation",
    capabilities: [
      readCapability("reservation.read", "reservation"),
      readCapability("arrival.read", "reservation"),
      readCapability("departure.read", "reservation"),
      readCapability("availability.read", "availability"),
      readCapability("occupancy.read", "reservation"),
    ],
  },
  {
    provider_key: "short_term_guest",
    display_name_key: "customerApp.companionPlatformKnowledge.hosts.providers.short_term_guest",
    source_engine: "guest_center",
    implementation_status: "partial",
    business_pack_key: HOSTS_PACK,
    search_terms_key: "customerApp.companionPlatformKnowledge.hosts.searchTerms.short_term_guest",
    capabilities: [readCapability("guest.read", "guest", HOSTS_VIEW, true)],
  },
  {
    provider_key: "short_term_calendar",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hosts.providers.short_term_calendar",
    source_engine: "calendar_center",
    implementation_status: "partial",
    business_pack_key: HOSTS_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hosts.searchTerms.short_term_calendar",
    capabilities: [readCapability("availability.read", "calendar")],
  },
  {
    provider_key: "short_term_operations",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hosts.providers.short_term_operations",
    source_engine: "operations_center",
    implementation_status: "partial",
    business_pack_key: HOSTS_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hosts.searchTerms.short_term_operations",
    capabilities: [
      readCapability("cleaning.read", "cleaning"),
      readCapability("maintenance.read", "maintenance"),
      readCapability("host_task.read", "task"),
      writeCapability("cleaning_task.assign", "cleaning"),
      writeCapability("maintenance_task.create", "maintenance"),
      writeCapability("host_task.create", "task"),
    ],
  },
  {
    provider_key: "short_term_finance",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hosts.providers.short_term_finance",
    source_engine: "finance_center",
    implementation_status: "partial",
    business_pack_key: HOSTS_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hosts.searchTerms.short_term_finance",
    capabilities: [
      readCapability("host_revenue.read", "revenue"),
      readCapability("host_payout.read", "payout"),
      readCapability("host_expense.read", "expense"),
      readCapability("host_forecast.read", "forecast"),
      readCapability("payout.read", "payout"),
      readCapability("revenue.read", "revenue"),
      readCapability("expense.read", "expense"),
      readCapability("forecast.read", "forecast"),
    ],
  },
  {
    provider_key: "short_term_communications",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hosts.providers.short_term_communications",
    source_engine: "communication_center",
    implementation_status: "partial",
    business_pack_key: HOSTS_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hosts.searchTerms.short_term_communications",
    capabilities: [
      writeCapability("guest_response.draft", "message"),
      writeCapability("message.draft", "message"),
    ],
  },
  {
    provider_key: "short_term_reports",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hosts.providers.short_term_reports",
    source_engine: "reports_center",
    implementation_status: "partial",
    business_pack_key: HOSTS_PACK,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hosts.searchTerms.short_term_reports",
    capabilities: [readCapability("host_report.read", "report"), writeCapability("report.export", "report")],
  },
  {
    provider_key: "short_term_access",
    display_name_key: "customerApp.companionPlatformKnowledge.hosts.providers.short_term_access",
    source_engine: "access_center",
    implementation_status: "implemented_disconnected",
    business_pack_key: HOSTS_PACK,
    search_terms_key: "customerApp.companionPlatformKnowledge.hosts.searchTerms.short_term_access",
    capabilities: [readCapability("property.read", "access_profile")],
  },
  {
    provider_key: "hosts_pack_adapter",
    display_name_key:
      "customerApp.companionPlatformKnowledge.hosts.providers.hosts_pack_adapter",
    source_engine: "hosts_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.hosts.searchTerms.hosts_pack_adapter",
    capabilities: [
      readCapability("property.read", "property"),
      readCapability("reservation.read", "reservation"),
    ],
  },
  {
    provider_key: "hosts_v2_smart_scheduling",
    display_name_key: "customerApp.companionPlatformKnowledge.hosts.providers.hosts_v2_smart_scheduling",
    source_engine: "smart_scheduling_center",
    implementation_status: "specification_only",
    business_pack_key: HOSTS_PACK,
    search_terms_key: "customerApp.companionPlatformKnowledge.hosts.searchTerms.hosts_v2_smart_scheduling",
    capabilities: [],
  },
  {
    provider_key: "hosts_v2_inventory_amenities",
    display_name_key: "customerApp.companionPlatformKnowledge.hosts.providers.hosts_v2_inventory_amenities",
    source_engine: "inventory_amenities_center",
    implementation_status: "specification_only",
    business_pack_key: HOSTS_PACK,
    search_terms_key: "customerApp.companionPlatformKnowledge.hosts.searchTerms.hosts_v2_inventory_amenities",
    capabilities: [],
  },
  {
    provider_key: "hosts_v2_insurance_compliance",
    display_name_key: "customerApp.companionPlatformKnowledge.hosts.providers.hosts_v2_insurance_compliance",
    source_engine: "insurance_compliance_center",
    implementation_status: "specification_only",
    business_pack_key: HOSTS_PACK,
    search_terms_key: "customerApp.companionPlatformKnowledge.hosts.searchTerms.hosts_v2_insurance_compliance",
    capabilities: [],
  },
  {
    provider_key: "hosts_v2_vendor_marketplace",
    display_name_key: "customerApp.companionPlatformKnowledge.hosts.providers.hosts_v2_vendor_marketplace",
    source_engine: "vendor_marketplace_center",
    implementation_status: "specification_only",
    business_pack_key: HOSTS_PACK,
    search_terms_key: "customerApp.companionPlatformKnowledge.hosts.searchTerms.hosts_v2_vendor_marketplace",
    capabilities: [],
  },
  {
    provider_key: "hosts_v2_enterprise_portfolio",
    display_name_key: "customerApp.companionPlatformKnowledge.hosts.providers.hosts_v2_enterprise_portfolio",
    source_engine: "enterprise_portfolio_center",
    implementation_status: "specification_only",
    business_pack_key: HOSTS_PACK,
    search_terms_key: "customerApp.companionPlatformKnowledge.hosts.searchTerms.hosts_v2_enterprise_portfolio",
    capabilities: [],
  },
];
