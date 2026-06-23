import type { HostsCapabilityKey } from "@/lib/integration-intelligence/hosts/types";

export type HostsV1SourceStatus = "live" | "partial" | "placeholder" | "missing";

export type HostsV1SourceDefinition = {
  capability_key: HostsCapabilityKey;
  source_kind: "tenant_rpc";
  source_id: string;
  provider_key: string;
  auth_model: string;
  tenant_filter: string;
  available_fields: readonly string[];
  required_permission: string | null;
  status: HostsV1SourceStatus;
  read_only: boolean;
  limitations: readonly string[];
};

export const HOSTS_V1_SOURCE_MAP: readonly HostsV1SourceDefinition[] = [
  {
    capability_key: "property.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_property_center_dashboard",
    provider_key: "short_term_property",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["properties[].id", "properties[].display_name", "properties[].status"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Property metadata from Property Center — no external channel sync."],
  },
  {
    capability_key: "reservation.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_booking_center_dashboard",
    provider_key: "short_term_reservation",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["reservations[].reservation_key", "reservations[].check_in_date", "reservations[].booking_status"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Reservation metadata from Booking Center — guest names masked in Companion."],
  },
  {
    capability_key: "arrival.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_operations_dashboard",
    provider_key: "short_term_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["boards.arrivals[]", "today_snapshot.arrivals_today"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Arrivals board from Operations Center."],
  },
  {
    capability_key: "departure.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_operations_dashboard",
    provider_key: "short_term_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["boards.departures[]", "today_snapshot.departures_today"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Departures board from Operations Center."],
  },
  {
    capability_key: "cleaning.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_operations_dashboard",
    provider_key: "short_term_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["boards.cleaning[]"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Cleaning board metadata only."],
  },
  {
    capability_key: "maintenance.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_operations_dashboard",
    provider_key: "short_term_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["boards.maintenance[]"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Maintenance board metadata only."],
  },
  {
    capability_key: "host_revenue.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_finance_center_dashboard",
    provider_key: "short_term_finance",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["overview.revenue_this_month", "overview.revenue_ytd", "revenue_entries[]"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Recognized revenue from Finance Center — distinct from forecast."],
  },
  {
    capability_key: "host_payout.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_finance_center_dashboard",
    provider_key: "short_term_finance",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["payouts[]", "overview.upcoming_payouts"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Payout metadata only — execution blocked in Companion."],
  },
  {
    capability_key: "host_expense.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_finance_center_dashboard",
    provider_key: "short_term_finance",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["expenses[]", "overview.outstanding_expenses"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Expense metadata from Finance Center."],
  },
  {
    capability_key: "host_forecast.read",
    source_kind: "tenant_rpc",
    source_id: "get_aipify_hosts_finance_center_dashboard",
    provider_key: "short_term_finance",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["forecast.expected_revenue", "forecast.estimated_net_position"],
    required_permission: "aipify_hosts.view",
    status: "partial",
    read_only: true,
    limitations: ["Forecast is expected income — never presented as booked revenue."],
  },
  {
    capability_key: "guest_response.draft",
    source_kind: "tenant_rpc",
    source_id: "none",
    provider_key: "short_term_communications",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: [],
    required_permission: "aipify_hosts.manage",
    status: "partial",
    read_only: false,
    limitations: ["Draft-only — guest message send blocked in Companion runtime."],
  },
  {
    capability_key: "host_task.create",
    source_kind: "tenant_rpc",
    source_id: "create_aipify_hosts_task",
    provider_key: "short_term_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["task_id", "title", "category", "priority"],
    required_permission: "aipify_hosts.manage",
    status: "live",
    read_only: false,
    limitations: [
      "Reversible task create — requires user confirmation, approval, and provider re-read before executed outcome.",
    ],
  },
  {
    capability_key: "cleaning_task.assign",
    source_kind: "tenant_rpc",
    source_id: "perform_aipify_hosts_cleaning_action",
    provider_key: "short_term_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["cleaning_task_id", "cleaner_id"],
    required_permission: "aipify_hosts.manage",
    status: "live",
    read_only: false,
    limitations: [
      "Reversible cleaning assignment — requires user confirmation, approval, and provider re-read before executed outcome.",
    ],
  },
  {
    capability_key: "maintenance_task.create",
    source_kind: "tenant_rpc",
    source_id: "perform_aipify_hosts_maintenance_action",
    provider_key: "short_term_operations",
    auth_model: "supabase_session_rls_tenant_id",
    tenant_filter: "_ahost_require_tenant()",
    available_fields: ["work_order_id", "description", "priority"],
    required_permission: "aipify_hosts.manage",
    status: "live",
    read_only: false,
    limitations: [
      "Reversible maintenance work-order create — requires user confirmation, approval, and provider re-read before executed outcome.",
    ],
  },
];

export function getHostsSourceDefinition(
  capabilityKey: HostsCapabilityKey,
  providerKey?: string,
): HostsV1SourceDefinition | null {
  const matches = HOSTS_V1_SOURCE_MAP.filter(
    (entry) =>
      entry.capability_key === capabilityKey &&
      (!providerKey || entry.provider_key === providerKey),
  );
  return matches[0] ?? null;
}

export function isHostsWriteSourceConnected(capabilityKey: HostsCapabilityKey): boolean {
  const definition = getHostsSourceDefinition(capabilityKey);
  return definition?.status === "live" && !definition.read_only;
}
