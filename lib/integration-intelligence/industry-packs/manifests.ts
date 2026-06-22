import type { IndustryPackProviderManifest } from "./types";

const APPOINTMENTS_PACK = "appointments_services";

function readCapability(
  capability_key: IndustryPackProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = null,
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
  capability_key: IndustryPackProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = null,
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

/** Industry pack manifests — capability IDs originate here, not in Core orchestrator. */
export const INDUSTRY_PACK_PROVIDER_MANIFESTS: readonly IndustryPackProviderManifest[] = [
  {
    provider_key: "local_service_beauty",
    display_name_key:
      "customerApp.companionPlatformKnowledge.industryPack.providers.local_service_beauty",
    source_engine: "appointment_booking",
    implementation_status: "partial",
    business_pack_key: APPOINTMENTS_PACK,
    industry_blueprint_slug: "local-service-business",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.industryPack.searchTerms.local_service_beauty",
    capabilities: [
      readCapability("service.read", "service"),
      readCapability("treatment.read", "treatment"),
      readCapability("availability.read", "availability"),
      readCapability("appointment.read", "appointment"),
      readCapability("customer.read", "customer", null, true),
      writeCapability("appointment.create", "appointment"),
      writeCapability("appointment.update", "appointment"),
    ],
  },
  {
    provider_key: "service_scheduling_staff",
    display_name_key:
      "customerApp.companionPlatformKnowledge.industryPack.providers.service_scheduling_staff",
    source_engine: "workforce_scheduling",
    implementation_status: "partial",
    business_pack_key: APPOINTMENTS_PACK,
    industry_blueprint_slug: "local-service-business",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.industryPack.searchTerms.service_scheduling_staff",
    capabilities: [
      readCapability("staff.read", "staff"),
      readCapability("availability.read", "availability"),
    ],
  },
  {
    provider_key: "service_retail_inventory",
    display_name_key:
      "customerApp.companionPlatformKnowledge.industryPack.providers.service_retail_inventory",
    source_engine: "service_inventory",
    implementation_status: "partial",
    business_pack_key: APPOINTMENTS_PACK,
    industry_blueprint_slug: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.industryPack.searchTerms.service_retail_inventory",
    capabilities: [
      readCapability("product.read", "product"),
      readCapability("inventory.read", "inventory"),
    ],
  },
  {
    provider_key: "client_engagement_follow_up",
    display_name_key:
      "customerApp.companionPlatformKnowledge.industryPack.providers.client_engagement_follow_up",
    source_engine: "companion_follow_up",
    implementation_status: "partial",
    business_pack_key: null,
    industry_blueprint_slug: "local-service-business",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.industryPack.searchTerms.client_engagement_follow_up",
    capabilities: [
      writeCapability("reminder.create", "reminder"),
      writeCapability("follow_up.create", "follow_up"),
    ],
  },
  {
    provider_key: "industry_pack_adapter",
    display_name_key:
      "customerApp.companionPlatformKnowledge.industryPack.providers.industry_pack_adapter",
    source_engine: "industry_pack_adapter",
    implementation_status: "specification_only",
    business_pack_key: null,
    industry_blueprint_slug: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.industryPack.searchTerms.industry_pack_adapter",
    capabilities: [
      readCapability("appointment.read", "appointment"),
      readCapability("customer.read", "customer", null, true),
    ],
  },
];
