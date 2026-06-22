import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listServicesProviderManifests } from "@/lib/integration-intelligence/services/registry";
import type { ServicesProviderImplementationStatus } from "@/lib/integration-intelligence/services/types";
import {
  buildServicesCapabilityRuntimeRef,
  createEmptyCompanionServicesContext,
  type CompanionServicesContext,
  type ServicesProviderRuntimeStatus,
} from "./companion-services-context";

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
  return true;
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: ServicesProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): ServicesProviderRuntimeStatus {
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
    execution_operations_enabled: input.engineEnabled,
    real_world_coordination_enabled: input.engineEnabled,
    service_network_enabled: input.engineEnabled,
    service_intake_enabled: input.engineEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    appointment: boolean;
    scheduling: boolean;
    absence: boolean;
    execution: boolean;
    realWorld: boolean;
    network: boolean;
    intake: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "appointment_booking":
      return flags.appointment;
    case "workforce_scheduling":
      return flags.scheduling;
    case "absence_vacation_coverage":
      return flags.absence;
    case "execution_operations":
      return flags.execution;
    case "companion_real_world_coordination":
      return flags.realWorld;
    case "service_network":
      return flags.network;
    case "service_intake":
      return flags.intake;
    default:
      return false;
  }
}

function extractBookingPolicy(data: unknown): {
  prevent_double_booking: boolean;
  overbooking_allowed: boolean;
  vacation_mode_integration_enabled: boolean;
  slot_hold_minutes: number | null;
  default_buffer_minutes: number | null;
} {
  if (!data || typeof data !== "object") {
    return {
      prevent_double_booking: true,
      overbooking_allowed: false,
      vacation_mode_integration_enabled: false,
      slot_hold_minutes: null,
      default_buffer_minutes: null,
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

  return {
    prevent_double_booking: settings.prevent_double_booking !== false,
    overbooking_allowed: settings.overbooking_allowed === true,
    vacation_mode_integration_enabled: settings.vacation_revenue_mode_enabled === true,
    slot_hold_minutes:
      typeof settings.slot_hold_minutes === "number" ? settings.slot_hold_minutes : null,
    default_buffer_minutes: Number.isFinite(bufferMinutes) ? bufferMinutes : null,
  };
}

export async function loadCompanionServicesContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
  },
): Promise<CompanionServicesContext> {
  const [
    appointmentResult,
    schedulingResult,
    absenceResult,
    executionResult,
    realWorldResult,
    networkResult,
    intakeResult,
  ] = await Promise.all([
    supabase.rpc("get_organization_appointment_center", { p_section: "overview" }),
    supabase.rpc("get_organization_workforce_scheduling_center", { p_section: "overview" }),
    supabase.rpc("get_organization_absence_center", { p_section: "overview" }),
    supabase.rpc("get_execution_operations_center"),
    supabase.rpc("get_organization_companion_real_world_center", { p_section: "overview" }),
    supabase.rpc("get_organization_service_network_center", { p_section: "overview" }),
    supabase.rpc("get_organization_service_intake_center", { p_section: "forms" }),
  ]);

  const permissionDenied = [absenceResult, executionResult].some(
    (result) => result.error && isPermissionDeniedMessage(result.error.message),
  );

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);
  const businessPackActive = input.activeBusinessPacks.includes("appointments_services");

  if (permissionDenied) {
    return createEmptyCompanionServicesContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const appointmentEnabled = rpcEnabled(appointmentResult.data);
  const schedulingEnabled = rpcEnabled(schedulingResult.data);
  const absenceEnabled = rpcEnabled(absenceResult.data);
  const executionEnabled = rpcEnabled(executionResult.data);
  const realWorldEnabled = rpcEnabled(realWorldResult.data);
  const networkEnabled = rpcEnabled(networkResult.data);
  const intakeEnabled = rpcEnabled(intakeResult.data);

  const bookingPolicy = extractBookingPolicy(appointmentResult.data);

  const engineFlags = {
    appointment: appointmentEnabled,
    scheduling: schedulingEnabled,
    absence: absenceEnabled,
    execution: executionEnabled,
    realWorld: realWorldEnabled,
    network: networkEnabled,
    intake: intakeEnabled,
  };

  const providers: ServicesProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listServicesProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive:
        !manifest.business_pack_key || input.activeBusinessPacks.includes(manifest.business_pack_key),
    });

    providerStatus.appointment_booking_enabled =
      engineFlags.appointment && manifest.source_engine === "appointment_booking";
    providerStatus.workforce_scheduling_enabled =
      engineFlags.scheduling && manifest.source_engine === "workforce_scheduling";
    providerStatus.absence_coverage_enabled =
      engineFlags.absence && manifest.source_engine === "absence_vacation_coverage";
    providerStatus.execution_operations_enabled =
      engineFlags.execution && manifest.source_engine === "execution_operations";
    providerStatus.real_world_coordination_enabled =
      engineFlags.realWorld && manifest.source_engine === "companion_real_world_coordination";
    providerStatus.service_network_enabled =
      engineFlags.network && manifest.source_engine === "service_network";
    providerStatus.service_intake_enabled =
      engineFlags.intake && manifest.source_engine === "service_intake";

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildServicesCapabilityRuntimeRef({
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

  return createEmptyCompanionServicesContext({
    appointment_booking_enabled: appointmentEnabled,
    workforce_scheduling_enabled: schedulingEnabled,
    absence_coverage_enabled: absenceEnabled,
    execution_operations_enabled: executionEnabled,
    real_world_coordination_enabled: realWorldEnabled,
    service_network_enabled: networkEnabled,
    service_intake_enabled: intakeEnabled,
    human_oversight_required: true,
    prevent_double_booking: bookingPolicy.prevent_double_booking,
    overbooking_allowed: bookingPolicy.overbooking_allowed,
    vacation_mode_integration_enabled: bookingPolicy.vacation_mode_integration_enabled,
    slot_hold_minutes: bookingPolicy.slot_hold_minutes,
    default_buffer_minutes: bookingPolicy.default_buffer_minutes,
    timezone_aware_scheduling: true,
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });
}
