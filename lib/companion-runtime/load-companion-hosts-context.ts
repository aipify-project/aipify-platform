import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { mapHostsV1Bundle } from "@/lib/integration-intelligence/providers/aipify-hosts/hosts-v1-contract";
import { listHostsProviderManifests } from "@/lib/integration-intelligence/hosts/registry";
import type { HostsProviderImplementationStatus } from "@/lib/integration-intelligence/hosts/types";
import { isHostsBusinessPackActive } from "@/lib/integration-intelligence/hosts/types";
import { buildHostsCommandBriefSignals } from "./hosts-read-orchestrator";
import {
  buildHostsCapabilityRuntimeRef,
  createEmptyCompanionHostsContext,
  type CompanionHostsContext,
  type HostsProviderRuntimeStatus,
} from "./companion-hosts-context";

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
  if (record.has_hosts === false) return false;
  return true;
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: HostsProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): HostsProviderRuntimeStatus {
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
    property_center_enabled: input.engineEnabled,
    booking_center_enabled: input.engineEnabled,
    guest_center_enabled: input.engineEnabled,
    calendar_center_enabled: input.engineEnabled,
    operations_center_enabled: input.engineEnabled,
    finance_center_enabled: input.engineEnabled,
    communication_center_enabled: input.engineEnabled,
    reports_center_enabled: input.engineEnabled,
    access_center_enabled: false,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    foundation: boolean;
    property: boolean;
    booking: boolean;
    guest: boolean;
    calendar: boolean;
    operations: boolean;
    finance: boolean;
    communication: boolean;
    reports: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "short_term_property":
      return flags.property;
    case "short_term_reservation":
      return flags.booking;
    case "short_term_guest":
      return flags.guest;
    case "short_term_calendar":
      return flags.calendar;
    case "short_term_operations":
      return flags.operations;
    case "short_term_finance":
      return flags.finance;
    case "short_term_communications":
      return flags.communication;
    case "short_term_reports":
      return flags.reports;
    case "short_term_access":
      return false;
    case "hosts_pack_adapter":
      return false;
    default:
      return flags.foundation;
  }
}

function extractHostsPortfolioPolicy(data: unknown): {
  vacation_mode_active: boolean;
  portfolio_isolation_enabled: boolean;
  property_count: number | null;
  active_reservations_count: number | null;
} {
  if (!data || typeof data !== "object") {
    return {
      vacation_mode_active: false,
      portfolio_isolation_enabled: true,
      property_count: null,
      active_reservations_count: null,
    };
  }

  const record = data as Record<string, unknown>;
  const properties = Array.isArray(record.properties) ? record.properties : [];
  const reservations = Array.isArray(record.upcoming_reservations)
    ? record.upcoming_reservations
    : Array.isArray(record.reservations)
      ? record.reservations
      : [];
  const settings =
    record.settings && typeof record.settings === "object"
      ? (record.settings as Record<string, unknown>)
      : {};

  return {
    vacation_mode_active: settings.vacation_mode_enabled === true || settings.vacation_mode === true,
    portfolio_isolation_enabled: settings.cross_portfolio_access !== true,
    property_count:
      typeof record.property_count === "number"
        ? record.property_count
        : properties.length > 0
          ? properties.length
          : null,
    active_reservations_count:
      typeof record.active_reservations_count === "number"
        ? record.active_reservations_count
        : reservations.length > 0
          ? reservations.length
          : null,
  };
}

export async function loadCompanionHostsContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
  },
): Promise<CompanionHostsContext> {
  const businessPackActive = isHostsBusinessPackActive(input.activeBusinessPacks);

  const [
    foundationResult,
    propertyResult,
    bookingResult,
    guestResult,
    calendarResult,
    operationsResult,
    financeResult,
    communicationResult,
    reportsResult,
  ] = await Promise.all([
    supabase.rpc("get_aipify_hosts_dashboard"),
    supabase.rpc("get_aipify_hosts_property_center_dashboard", {
      p_property_id: null,
      p_section: "overview",
    }),
    supabase.rpc("get_aipify_hosts_booking_center_dashboard", {
      p_section: "upcoming_bookings",
      p_property_id: null,
      p_status: null,
      p_date_from: null,
      p_date_to: null,
      p_guest_name: null,
    }),
    supabase.rpc("get_aipify_hosts_guest_center_dashboard", {
      p_section: "active_guests",
      p_filter: "active_guests",
      p_guest_id: null,
    }),
    supabase.rpc("get_aipify_hosts_calendar_center_dashboard", {
      p_section: "master_calendar",
      p_view: "month",
      p_property_id: null,
      p_team_member: null,
      p_event_type: null,
      p_date_from: null,
      p_date_to: null,
    }),
    supabase.rpc("get_aipify_hosts_operations_dashboard", {
      p_section: "today",
      p_filter: "today",
      p_property_id: null,
    }),
    supabase.rpc("get_aipify_hosts_finance_center_dashboard", {
      p_section: "overview",
      p_filter: "all_properties",
      p_property_id: null,
      p_revenue_status: null,
      p_expense_category: null,
    }),
    supabase.rpc("get_aipify_hosts_communication_center_dashboard", {
      p_section: "guest_communications",
      p_property_id: null,
      p_status: null,
      p_recipient_type: null,
    }),
    supabase.rpc("get_aipify_hosts_reports_dashboard", { p_filter: "last_30_days" }),
  ]);

  const permissionDenied = [foundationResult, propertyResult, financeResult].some(
    (result) => result.error && isPermissionDeniedMessage(result.error.message),
  );

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionHostsContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const foundationEnabled = rpcEnabled(foundationResult.data);
  const propertyEnabled = rpcEnabled(propertyResult.data);
  const bookingEnabled = rpcEnabled(bookingResult.data);
  const guestEnabled = rpcEnabled(guestResult.data);
  const calendarEnabled = rpcEnabled(calendarResult.data);
  const operationsEnabled = rpcEnabled(operationsResult.data);
  const financeEnabled = rpcEnabled(financeResult.data);
  const communicationEnabled = rpcEnabled(communicationResult.data);
  const reportsEnabled = rpcEnabled(reportsResult.data);

  const portfolioPolicy = extractHostsPortfolioPolicy(
    bookingResult.data ?? foundationResult.data,
  );

  const hostsBundle = mapHostsV1Bundle({
    propertyData: propertyResult.data,
    bookingData: bookingResult.data,
    operationsData: operationsResult.data,
    financeData: financeResult.data,
  });

  const commandBriefSignals =
    foundationEnabled && businessPackActive && hostsBundle.source_exact
      ? buildHostsCommandBriefSignals({
          operations: hostsBundle.operations,
          finance: hostsBundle.finance,
          reservations: hostsBundle.reservations,
          source_exact: true,
        })
      : [];

  const engineFlags = {
    foundation: foundationEnabled,
    property: propertyEnabled,
    booking: bookingEnabled,
    guest: guestEnabled,
    calendar: calendarEnabled,
    operations: operationsEnabled,
    finance: financeEnabled,
    communication: communicationEnabled,
    reports: reportsEnabled,
  };

  const providers: HostsProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listHostsProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive,
    });

    providerStatus.property_center_enabled =
      engineFlags.property && manifest.source_engine === "property_center";
    providerStatus.booking_center_enabled =
      engineFlags.booking && manifest.source_engine === "booking_center";
    providerStatus.guest_center_enabled =
      engineFlags.guest && manifest.source_engine === "guest_center";
    providerStatus.calendar_center_enabled =
      engineFlags.calendar && manifest.source_engine === "calendar_center";
    providerStatus.operations_center_enabled =
      engineFlags.operations && manifest.source_engine === "operations_center";
    providerStatus.finance_center_enabled =
      engineFlags.finance && manifest.source_engine === "finance_center";
    providerStatus.communication_center_enabled =
      engineFlags.communication && manifest.source_engine === "communication_center";
    providerStatus.reports_center_enabled =
      engineFlags.reports && manifest.source_engine === "reports_center";
    providerStatus.access_center_enabled = false;

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildHostsCapabilityRuntimeRef({
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

  return createEmptyCompanionHostsContext({
    property_center_enabled: propertyEnabled,
    booking_center_enabled: bookingEnabled,
    guest_center_enabled: guestEnabled,
    calendar_center_enabled: calendarEnabled,
    operations_center_enabled: operationsEnabled,
    finance_center_enabled: financeEnabled,
    communication_center_enabled: communicationEnabled,
    reports_center_enabled: reportsEnabled,
    access_center_enabled: false,
    human_oversight_required: true,
    auto_message_send_blocked: true,
    payment_execution_blocked: true,
    reservation_delete_blocked: true,
    portfolio_isolation_enabled: portfolioPolicy.portfolio_isolation_enabled,
    vacation_mode_active: portfolioPolicy.vacation_mode_active,
    property_count: portfolioPolicy.property_count ?? hostsBundle.properties.length,
    active_reservations_count:
      portfolioPolicy.active_reservations_count ?? hostsBundle.reservations.length,
    operations_summary: hostsBundle.operations,
    finance_summary: hostsBundle.finance,
    property_summaries: hostsBundle.properties,
    reservation_summaries: hostsBundle.reservations,
    command_brief_signals: commandBriefSignals,
    hosts_source_exact: hostsBundle.source_exact,
    command_brief_events_linked:
      foundationEnabled && businessPackActive && commandBriefSignals.length > 0,
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });
}
