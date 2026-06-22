import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listIndustryPackProviderManifests } from "@/lib/integration-intelligence/industry-packs/registry";
import type { IndustryPackProviderImplementationStatus } from "@/lib/integration-intelligence/industry-packs/types";
import {
  buildIndustryPackCapabilityRuntimeRef,
  createEmptyCompanionIndustryPackContext,
  type CompanionIndustryPackContext,
  type IndustryPackProviderRuntimeStatus,
} from "./companion-industry-pack-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function rpcEnabled(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  if (record.found === false) return false;
  if (record.has_access === false) return false;
  if (record.has_customer === false) return false;
  if (record.has_organization === false) return false;
  return true;
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: IndustryPackProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
  industryBlueprintActive: boolean;
}): IndustryPackProviderRuntimeStatus {
  const verified = input.connectedProviders.includes(input.providerKey);

  let implementationStatus = input.manifestStatus;
  if (verified && input.manifestStatus === "implemented_disconnected") {
    implementationStatus = "connected";
  } else if (!verified && input.manifestStatus === "connected") {
    implementationStatus = "implemented_disconnected";
  }

  return {
    provider_key: input.providerKey,
    implementation_status: implementationStatus,
    appointment_booking_enabled: input.engineEnabled,
    workforce_scheduling_enabled: input.engineEnabled,
    absence_coverage_enabled: input.engineEnabled,
    service_inventory_enabled: input.engineEnabled,
    follow_up_enabled: input.engineEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
    industry_blueprint_active: input.industryBlueprintActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    appointment: boolean;
    scheduling: boolean;
    absence: boolean;
    inventory: boolean;
    followUp: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "local_service_beauty":
      return flags.appointment;
    case "service_scheduling_staff":
      return flags.scheduling;
    case "service_retail_inventory":
      return flags.inventory;
    case "client_engagement_follow_up":
      return flags.followUp;
    case "industry_pack_adapter":
      return false;
    default:
      return false;
  }
}

function extractBookingPolicy(data: unknown): {
  prevent_double_booking: boolean;
  vacation_mode_integration_enabled: boolean;
  slot_hold_minutes: number | null;
  default_buffer_minutes: number | null;
  post_vacation_buffer_days: number | null;
} {
  if (!data || typeof data !== "object") {
    return {
      prevent_double_booking: true,
      vacation_mode_integration_enabled: false,
      slot_hold_minutes: null,
      default_buffer_minutes: null,
      post_vacation_buffer_days: null,
    };
  }

  const record = data as Record<string, unknown>;
  const settings =
    record.settings && typeof record.settings === "object"
      ? (record.settings as Record<string, unknown>)
      : {};

  const services = Array.isArray(record.services) ? record.services : [];
  const firstService = services[0];
  const bufferMinutes =
    firstService && typeof firstService === "object"
      ? Number((firstService as Record<string, unknown>).buffer_minutes ?? NaN)
      : NaN;

  const vacationIntegration = Array.isArray(record.vacation_integration)
    ? record.vacation_integration[0]
    : null;
  const postVacationBuffer =
    vacationIntegration && typeof vacationIntegration === "object"
      ? Number((vacationIntegration as Record<string, unknown>).post_vacation_buffer_days ?? NaN)
      : NaN;

  return {
    prevent_double_booking: settings.prevent_double_booking !== false,
    vacation_mode_integration_enabled: settings.vacation_revenue_mode_enabled === true,
    slot_hold_minutes:
      typeof settings.slot_hold_minutes === "number" ? settings.slot_hold_minutes : null,
    default_buffer_minutes: Number.isFinite(bufferMinutes) ? bufferMinutes : null,
    post_vacation_buffer_days: Number.isFinite(postVacationBuffer) ? postVacationBuffer : null,
  };
}

function extractActiveBlueprintSlug(blueprintData: unknown): string | null {
  if (!blueprintData || typeof blueprintData !== "object") return null;
  const record = blueprintData as Record<string, unknown>;
  const blueprint =
    record.blueprint && typeof record.blueprint === "object"
      ? (record.blueprint as Record<string, unknown>)
      : null;
  if (blueprint && typeof blueprint.slug === "string" && blueprint.slug.trim()) {
    return blueprint.slug.trim();
  }
  const profile =
    record.profile && typeof record.profile === "object"
      ? (record.profile as Record<string, unknown>)
      : null;
  if (profile && typeof profile.industry_category === "string") {
    return profile.industry_category === "local_service" ? "local-service-business" : null;
  }
  return null;
}

export async function loadCompanionIndustryPackContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
  },
): Promise<CompanionIndustryPackContext> {
  const [
    appointmentResult,
    schedulingResult,
    absenceResult,
    inventoryResult,
    followUpResult,
    blueprintResult,
  ] = await Promise.all([
    supabase.rpc("get_organization_appointment_center", { p_section: "overview" }),
    supabase.rpc("get_organization_workforce_scheduling_center", { p_section: "overview" }),
    supabase.rpc("get_organization_absence_center", { p_section: "overview" }),
    supabase.rpc("get_organization_inventory_center", { p_section: "overview" }),
    supabase.rpc("get_companion_follow_up_dashboard"),
    supabase.rpc("get_tenant_industry_profile"),
  ]);

  const permissionDenied = [schedulingResult, inventoryResult].some(
    (result) => result.error && isPermissionDeniedMessage(result.error.message),
  );

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);
  const businessPackActive = input.activeBusinessPacks.includes("appointments_services");
  const activeBlueprintSlug = extractActiveBlueprintSlug(blueprintResult.data);
  const industryBlueprintActive =
    activeBlueprintSlug === "local-service-business" || activeBlueprintSlug === null;

  if (permissionDenied) {
    return createEmptyCompanionIndustryPackContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const appointmentEnabled = rpcEnabled(appointmentResult.data);
  const schedulingEnabled = rpcEnabled(schedulingResult.data);
  const absenceEnabled = rpcEnabled(absenceResult.data);
  const inventoryEnabled = rpcEnabled(inventoryResult.data);
  const followUpEnabled = rpcEnabled(followUpResult.data);

  const bookingPolicy = extractBookingPolicy(appointmentResult.data);

  const engineFlags = {
    appointment: appointmentEnabled,
    scheduling: schedulingEnabled,
    absence: absenceEnabled,
    inventory: inventoryEnabled,
    followUp: followUpEnabled,
  };

  const providers: IndustryPackProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listIndustryPackProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive:
        !manifest.business_pack_key ||
        input.activeBusinessPacks.includes(manifest.business_pack_key),
      industryBlueprintActive:
        !manifest.industry_blueprint_slug ||
        activeBlueprintSlug === manifest.industry_blueprint_slug ||
        industryBlueprintActive,
    });

    providerStatus.appointment_booking_enabled =
      engineFlags.appointment && manifest.source_engine === "appointment_booking";
    providerStatus.workforce_scheduling_enabled =
      engineFlags.scheduling && manifest.source_engine === "workforce_scheduling";
    providerStatus.absence_coverage_enabled =
      engineFlags.absence && manifest.source_engine === "absence_vacation_coverage";
    providerStatus.service_inventory_enabled =
      engineFlags.inventory && manifest.source_engine === "service_inventory";
    providerStatus.follow_up_enabled =
      engineFlags.followUp && manifest.source_engine === "companion_follow_up";

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildIndustryPackCapabilityRuntimeRef({
        manifest,
        providerStatus,
        capability,
        hasPermission,
      });

      if (runtimeRef) {
        capabilities.push(runtimeRef);
      }
    }
  }

  return createEmptyCompanionIndustryPackContext({
    appointment_booking_enabled: appointmentEnabled,
    workforce_scheduling_enabled: schedulingEnabled,
    absence_coverage_enabled: absenceEnabled,
    service_inventory_enabled: inventoryEnabled,
    follow_up_enabled: followUpEnabled,
    human_oversight_required: true,
    prevent_double_booking: bookingPolicy.prevent_double_booking,
    vacation_mode_integration_enabled: bookingPolicy.vacation_mode_integration_enabled,
    post_vacation_buffer_days: bookingPolicy.post_vacation_buffer_days,
    slot_hold_minutes: bookingPolicy.slot_hold_minutes,
    default_buffer_minutes: bookingPolicy.default_buffer_minutes,
    timezone_aware_scheduling: true,
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
    active_industry_blueprint_slug: activeBlueprintSlug,
  });
}
