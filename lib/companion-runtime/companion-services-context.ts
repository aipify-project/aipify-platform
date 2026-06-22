import type { ServicesProviderImplementationStatus } from "@/lib/integration-intelligence/services/types";
import type { ServicesProviderManifest } from "@/lib/integration-intelligence/services/types";
import {
  buildServicesCapabilityId,
  isServicesCapabilityBlocked,
} from "@/lib/integration-intelligence/services/types";

export type ServicesProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: ServicesProviderImplementationStatus;
  appointment_booking_enabled: boolean;
  workforce_scheduling_enabled: boolean;
  absence_coverage_enabled: boolean;
  execution_operations_enabled: boolean;
  real_world_coordination_enabled: boolean;
  service_network_enabled: boolean;
  service_intake_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type ServicesCapabilityRuntimeRef = {
  capability_id: string;
  provider_key: string;
  capability_key: string;
  operation: "read" | "write";
  entity: string;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: number;
  required_permission: string | null;
  runtime_status: ServicesProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type CompanionServicesContext = {
  appointment_booking_enabled: boolean;
  workforce_scheduling_enabled: boolean;
  absence_coverage_enabled: boolean;
  execution_operations_enabled: boolean;
  real_world_coordination_enabled: boolean;
  service_network_enabled: boolean;
  service_intake_enabled: boolean;
  human_oversight_required: boolean;
  prevent_double_booking: boolean;
  overbooking_allowed: boolean;
  vacation_mode_integration_enabled: boolean;
  slot_hold_minutes: number | null;
  default_buffer_minutes: number | null;
  timezone_aware_scheduling: boolean;
  providers: ServicesProviderRuntimeStatus[];
  capabilities: ServicesCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_appointments: string;
  cross_link_scheduling: string;
  cross_link_absence: string;
  cross_link_execution: string;
  cross_link_service_network: string;
};

export function createEmptyCompanionServicesContext(
  overrides?: Partial<CompanionServicesContext>,
): CompanionServicesContext {
  return {
    appointment_booking_enabled: false,
    workforce_scheduling_enabled: false,
    absence_coverage_enabled: false,
    execution_operations_enabled: false,
    real_world_coordination_enabled: false,
    service_network_enabled: false,
    service_intake_enabled: false,
    human_oversight_required: true,
    prevent_double_booking: true,
    overbooking_allowed: false,
    vacation_mode_integration_enabled: false,
    slot_hold_minutes: null,
    default_buffer_minutes: null,
    timezone_aware_scheduling: true,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_appointments: "/app/appointments",
    cross_link_scheduling: "/app/workforce-scheduling",
    cross_link_absence: "/app/absence",
    cross_link_execution: "/app/execution",
    cross_link_service_network: "/app/service-network",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: ServicesProviderManifest,
  providerStatus: ServicesProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "appointment_booking":
      return providerStatus.appointment_booking_enabled;
    case "workforce_scheduling":
      return providerStatus.workforce_scheduling_enabled;
    case "absence_vacation_coverage":
      return providerStatus.absence_coverage_enabled;
    case "execution_operations":
      return providerStatus.execution_operations_enabled;
    case "companion_real_world_coordination":
      return providerStatus.real_world_coordination_enabled;
    case "service_network":
      return providerStatus.service_network_enabled;
    case "service_intake":
      return providerStatus.service_intake_enabled;
    default:
      return false;
  }
}

export function buildServicesCapabilityRuntimeRef(input: {
  manifest: ServicesProviderManifest;
  providerStatus: ServicesProviderRuntimeStatus;
  capability: ServicesProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): ServicesCapabilityRuntimeRef | null {
  if (isServicesCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildServicesCapabilityId(
    input.manifest.provider_key,
    input.capability.capability_key,
    input.capability.operation,
  );

  const engineEnabled = engineEnabledForProvider(input.manifest, input.providerStatus);
  const packOk =
    !input.manifest.business_pack_key ||
    input.providerStatus.business_pack_active ||
    input.manifest.business_pack_key === null;

  const enabled =
    engineEnabled &&
    packOk &&
    input.providerStatus.entitlement_active &&
    input.hasPermission &&
    input.providerStatus.implementation_status !== "placeholder" &&
    (input.capability.operation === "read"
      ? true
      : input.capability.approval_required &&
        input.capability.reversible &&
        input.capability.risk_level <= 2);

  return {
    capability_id: capabilityId,
    provider_key: input.manifest.provider_key,
    capability_key: input.capability.capability_key,
    operation: input.capability.operation,
    entity: input.capability.entity,
    adapter_available: input.capability.adapter_available && input.providerStatus.adapter_available,
    approval_required: input.capability.approval_required,
    reversible: input.capability.reversible,
    risk_level: input.capability.risk_level,
    required_permission: input.capability.required_permission,
    runtime_status: input.providerStatus.implementation_status,
    privacy_sensitive: input.capability.privacy_sensitive,
    enabled: enabled && input.providerStatus.entitlement_active,
  };
}

export function filterServicesCapabilitiesForPrivacy(
  context: CompanionServicesContext,
): ServicesCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledServicesCapabilities(
  context: CompanionServicesContext,
): ServicesCapabilityRuntimeRef[] {
  return filterServicesCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findServicesProviderStatus(
  context: CompanionServicesContext,
  providerKey: string,
): ServicesProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
