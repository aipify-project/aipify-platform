import type { IndustryPackProviderImplementationStatus } from "@/lib/integration-intelligence/industry-packs/types";
import type { IndustryPackProviderManifest } from "@/lib/integration-intelligence/industry-packs/types";
import {
  buildIndustryPackCapabilityId,
  isIndustryPackCapabilityBlocked,
} from "@/lib/integration-intelligence/industry-packs/types";

export type IndustryPackProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: IndustryPackProviderImplementationStatus;
  appointment_booking_enabled: boolean;
  workforce_scheduling_enabled: boolean;
  absence_coverage_enabled: boolean;
  service_inventory_enabled: boolean;
  follow_up_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
  industry_blueprint_active: boolean;
};

export type IndustryPackCapabilityRuntimeRef = {
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
  runtime_status: IndustryPackProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type CompanionIndustryPackContext = {
  appointment_booking_enabled: boolean;
  workforce_scheduling_enabled: boolean;
  absence_coverage_enabled: boolean;
  service_inventory_enabled: boolean;
  follow_up_enabled: boolean;
  human_oversight_required: boolean;
  prevent_double_booking: boolean;
  vacation_mode_integration_enabled: boolean;
  post_vacation_buffer_days: number | null;
  slot_hold_minutes: number | null;
  default_buffer_minutes: number | null;
  timezone_aware_scheduling: boolean;
  providers: IndustryPackProviderRuntimeStatus[];
  capabilities: IndustryPackCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  active_industry_blueprint_slug: string | null;
  cross_link_appointments: string;
  cross_link_scheduling: string;
  cross_link_absence: string;
  cross_link_inventory: string;
  cross_link_follow_up: string;
};

export function createEmptyCompanionIndustryPackContext(
  overrides?: Partial<CompanionIndustryPackContext>,
): CompanionIndustryPackContext {
  return {
    appointment_booking_enabled: false,
    workforce_scheduling_enabled: false,
    absence_coverage_enabled: false,
    service_inventory_enabled: false,
    follow_up_enabled: false,
    human_oversight_required: true,
    prevent_double_booking: true,
    vacation_mode_integration_enabled: false,
    post_vacation_buffer_days: null,
    slot_hold_minutes: null,
    default_buffer_minutes: null,
    timezone_aware_scheduling: true,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    active_industry_blueprint_slug: null,
    cross_link_appointments: "/app/appointments",
    cross_link_scheduling: "/app/workforce-scheduling",
    cross_link_absence: "/app/absence",
    cross_link_inventory: "/app/inventory",
    cross_link_follow_up: "/app/assistant/follow-up",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: IndustryPackProviderManifest,
  providerStatus: IndustryPackProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "appointment_booking":
      return providerStatus.appointment_booking_enabled;
    case "workforce_scheduling":
      return providerStatus.workforce_scheduling_enabled;
    case "absence_vacation_coverage":
      return providerStatus.absence_coverage_enabled;
    case "service_inventory":
      return providerStatus.service_inventory_enabled;
    case "companion_follow_up":
      return providerStatus.follow_up_enabled;
    case "industry_pack_adapter":
      return false;
    default:
      return false;
  }
}

export function buildIndustryPackCapabilityRuntimeRef(input: {
  manifest: IndustryPackProviderManifest;
  providerStatus: IndustryPackProviderRuntimeStatus;
  capability: IndustryPackProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): IndustryPackCapabilityRuntimeRef | null {
  if (isIndustryPackCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildIndustryPackCapabilityId(
    input.manifest.provider_key,
    input.capability.capability_key,
    input.capability.operation,
  );

  const engineEnabled = engineEnabledForProvider(input.manifest, input.providerStatus);
  const packOk =
    !input.manifest.business_pack_key ||
    input.providerStatus.business_pack_active ||
    input.manifest.business_pack_key === null;

  const blueprintOk =
    !input.manifest.industry_blueprint_slug ||
    input.providerStatus.industry_blueprint_active ||
    input.manifest.industry_blueprint_slug === null;

  const enabled =
    engineEnabled &&
    packOk &&
    blueprintOk &&
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

export function filterIndustryPackCapabilitiesForPrivacy(
  context: CompanionIndustryPackContext,
): IndustryPackCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledIndustryPackCapabilities(
  context: CompanionIndustryPackContext,
): IndustryPackCapabilityRuntimeRef[] {
  return filterIndustryPackCapabilitiesForPrivacy(context).filter(
    (capability) => capability.enabled,
  );
}

export function findIndustryPackProviderStatus(
  context: CompanionIndustryPackContext,
  providerKey: string,
): IndustryPackProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
