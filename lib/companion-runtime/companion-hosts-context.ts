import type { HostsProviderImplementationStatus } from "@/lib/integration-intelligence/hosts/types";
import type { HostsProviderManifest } from "@/lib/integration-intelligence/hosts/types";
import {
  buildHostsCapabilityId,
  isHostsCapabilityBlocked,
} from "@/lib/integration-intelligence/hosts/types";

export type HostsProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: HostsProviderImplementationStatus;
  property_center_enabled: boolean;
  booking_center_enabled: boolean;
  guest_center_enabled: boolean;
  calendar_center_enabled: boolean;
  operations_center_enabled: boolean;
  finance_center_enabled: boolean;
  communication_center_enabled: boolean;
  reports_center_enabled: boolean;
  access_center_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type HostsCapabilityRuntimeRef = {
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
  runtime_status: HostsProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type CompanionHostsContext = {
  property_center_enabled: boolean;
  booking_center_enabled: boolean;
  guest_center_enabled: boolean;
  calendar_center_enabled: boolean;
  operations_center_enabled: boolean;
  finance_center_enabled: boolean;
  communication_center_enabled: boolean;
  reports_center_enabled: boolean;
  access_center_enabled: boolean;
  human_oversight_required: boolean;
  auto_message_send_blocked: boolean;
  payment_execution_blocked: boolean;
  reservation_delete_blocked: boolean;
  portfolio_isolation_enabled: boolean;
  vacation_mode_active: boolean;
  property_count: number | null;
  active_reservations_count: number | null;
  operations_summary: import("@/lib/integration-intelligence/hosts/types").HostOperationsSummary | null;
  finance_summary: import("@/lib/integration-intelligence/hosts/types").HostFinanceSummary | null;
  property_summaries: readonly import("@/lib/integration-intelligence/hosts/types").PropertySummary[];
  reservation_summaries: readonly import("@/lib/integration-intelligence/hosts/types").ReservationSummary[];
  command_brief_signals: readonly { signal_key: string; count: number | null }[];
  hosts_source_exact: boolean;
  command_brief_events_linked: boolean;
  providers: HostsProviderRuntimeStatus[];
  capabilities: HostsCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_hosts: string;
  cross_link_properties: string;
  cross_link_bookings: string;
  cross_link_finance: string;
  cross_link_reports: string;
};

export function createEmptyCompanionHostsContext(
  overrides?: Partial<CompanionHostsContext>,
): CompanionHostsContext {
  return {
    property_center_enabled: false,
    booking_center_enabled: false,
    guest_center_enabled: false,
    calendar_center_enabled: false,
    operations_center_enabled: false,
    finance_center_enabled: false,
    communication_center_enabled: false,
    reports_center_enabled: false,
    access_center_enabled: false,
    human_oversight_required: true,
    auto_message_send_blocked: true,
    payment_execution_blocked: true,
    reservation_delete_blocked: true,
    portfolio_isolation_enabled: true,
    vacation_mode_active: false,
    property_count: null,
    active_reservations_count: null,
    operations_summary: null,
    finance_summary: null,
    property_summaries: [],
    reservation_summaries: [],
    command_brief_signals: [],
    hosts_source_exact: false,
    command_brief_events_linked: false,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_hosts: "/app/aipify-hosts",
    cross_link_properties: "/app/aipify-hosts/properties",
    cross_link_bookings: "/app/aipify-hosts/bookings",
    cross_link_finance: "/app/aipify-hosts/finance",
    cross_link_reports: "/app/aipify-hosts/reports",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: HostsProviderManifest,
  providerStatus: HostsProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "property_center":
      return providerStatus.property_center_enabled;
    case "booking_center":
      return providerStatus.booking_center_enabled;
    case "guest_center":
      return providerStatus.guest_center_enabled;
    case "calendar_center":
      return providerStatus.calendar_center_enabled;
    case "operations_center":
      return providerStatus.operations_center_enabled;
    case "finance_center":
      return providerStatus.finance_center_enabled;
    case "communication_center":
      return providerStatus.communication_center_enabled;
    case "reports_center":
      return providerStatus.reports_center_enabled;
    case "access_center":
      return providerStatus.access_center_enabled;
    case "hosts_pack_adapter":
      return false;
    default:
      return false;
  }
}

export function buildHostsCapabilityRuntimeRef(input: {
  manifest: HostsProviderManifest;
  providerStatus: HostsProviderRuntimeStatus;
  capability: HostsProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): HostsCapabilityRuntimeRef | null {
  if (isHostsCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildHostsCapabilityId(
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

export function filterHostsCapabilitiesForPrivacy(
  context: CompanionHostsContext,
): HostsCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledHostsCapabilities(
  context: CompanionHostsContext,
): HostsCapabilityRuntimeRef[] {
  return filterHostsCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findHostsProviderStatus(
  context: CompanionHostsContext,
  providerKey: string,
): HostsProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
