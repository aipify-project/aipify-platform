import type { ServicesProviderManifest } from "./types";

const EXECUTION_VIEW = "execution_operations.view";
const EXECUTION_MANAGE = "execution_operations.manage";
const ABSENCE_VIEW = "absence.view";
const ABSENCE_MANAGE = "absence.manage";

function readCapability(
  capability_key: ServicesProviderManifest["capabilities"][number]["capability_key"],
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
  capability_key: ServicesProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = EXECUTION_MANAGE,
  options?: { irreversible?: boolean; privacy_sensitive?: boolean },
) {
  const irreversible = options?.irreversible ?? false;
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: !irreversible,
    risk_level: (irreversible ? 3 : 2) as 2 | 3,
    entity,
    required_permission: permission,
    privacy_sensitive: options?.privacy_sensitive ?? false,
  };
}

/** Services Business Pack manifests — capability IDs originate here, not in Core orchestrator. */
export const SERVICES_PROVIDER_MANIFESTS: readonly ServicesProviderManifest[] = [
  {
    provider_key: "appointment_booking",
    display_name_key:
      "customerApp.companionPlatformKnowledge.services.providers.appointment_booking",
    source_engine: "appointment_booking",
    implementation_status: "partial",
    business_pack_key: "appointments_services",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.services.searchTerms.appointment_booking",
    capabilities: [
      readCapability("service.read", "service"),
      readCapability("service.availability.read", "availability"),
      readCapability("employee.read", "employee"),
      readCapability("availability.read", "availability"),
      readCapability("schedule.read", "schedule"),
      readCapability("appointment.read", "appointment"),
      readCapability("booking.read", "booking"),
      readCapability("absence.read", "absence", "absence.view"),
      readCapability("vacation_mode.read", "absence", "absence.view"),
      readCapability("post_vacation_availability.read", "availability"),
      readCapability("resource.read", "resource"),
      readCapability("customer.read", "customer", null, true),
      readCapability("location.read", "location"),
      writeCapability("booking.create", "booking", "appointments.manage", { privacy_sensitive: true }),
      writeCapability("booking.update", "booking", "appointments.manage", { privacy_sensitive: true }),
      writeCapability("booking.cancel", "booking", "appointments.manage", { privacy_sensitive: true }),
    ],
  },
  {
    provider_key: "workforce_scheduling",
    display_name_key:
      "customerApp.companionPlatformKnowledge.services.providers.workforce_scheduling",
    source_engine: "workforce_scheduling",
    implementation_status: "partial",
    business_pack_key: "appointments_services",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.services.searchTerms.workforce_scheduling",
    capabilities: [
      readCapability("resource.read", "resource"),
      readCapability("employee.read", "employee"),
      readCapability("service.availability.read", "availability"),
      readCapability("availability.read", "availability"),
      readCapability("schedule.read", "schedule"),
      readCapability("assignment.read", "assignment"),
    ],
  },
  {
    provider_key: "absence_vacation_coverage",
    display_name_key:
      "customerApp.companionPlatformKnowledge.services.providers.absence_vacation_coverage",
    source_engine: "absence_vacation_coverage",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.services.searchTerms.absence_vacation_coverage",
    capabilities: [
      readCapability("service.availability.read", "availability", ABSENCE_VIEW),
      readCapability("availability.read", "availability", ABSENCE_VIEW),
      readCapability("resource.read", "resource", ABSENCE_VIEW),
      readCapability("employee.read", "employee", ABSENCE_VIEW),
      readCapability("absence.read", "absence", ABSENCE_VIEW),
      readCapability("vacation_mode.read", "absence", ABSENCE_VIEW),
      readCapability("post_vacation_availability.read", "availability", ABSENCE_VIEW),
    ],
  },
  {
    provider_key: "execution_operations",
    display_name_key:
      "customerApp.companionPlatformKnowledge.services.providers.execution_operations",
    source_engine: "execution_operations",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.services.searchTerms.execution_operations",
    capabilities: [
      readCapability("work_order.read", "work_order", EXECUTION_VIEW),
      readCapability("assignment.read", "assignment", EXECUTION_VIEW),
      readCapability("location.read", "location", EXECUTION_VIEW),
      readCapability("customer.read", "customer", EXECUTION_VIEW, true),
      writeCapability("work_order.create", "work_order", EXECUTION_MANAGE),
      writeCapability("work_order.assign", "work_order", EXECUTION_MANAGE),
    ],
  },
  {
    provider_key: "companion_real_world_coordination",
    display_name_key:
      "customerApp.companionPlatformKnowledge.services.providers.companion_real_world_coordination",
    source_engine: "companion_real_world_coordination",
    implementation_status: "partial",
    business_pack_key: null,
    search_terms_key:
      "customerApp.companionPlatformKnowledge.services.searchTerms.companion_real_world_coordination",
    capabilities: [
      readCapability("service.read", "service"),
      readCapability("appointment.read", "appointment"),
      readCapability("location.read", "location"),
      readCapability("customer.read", "customer", null, true),
      writeCapability("work_order.create", "work_order", null),
    ],
  },
  {
    provider_key: "service_network",
    display_name_key:
      "customerApp.companionPlatformKnowledge.services.providers.service_network",
    source_engine: "service_network",
    implementation_status: "partial",
    business_pack_key: "appointments_services",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.services.searchTerms.service_network",
    capabilities: [
      readCapability("location.read", "location"),
      readCapability("resource.read", "resource"),
      readCapability("service.read", "service"),
    ],
  },
  {
    provider_key: "service_intake",
    display_name_key:
      "customerApp.companionPlatformKnowledge.services.providers.service_intake",
    source_engine: "service_intake",
    implementation_status: "partial",
    business_pack_key: "appointments_services",
    search_terms_key:
      "customerApp.companionPlatformKnowledge.services.searchTerms.service_intake",
    capabilities: [readCapability("service.read", "service")],
  },
];
