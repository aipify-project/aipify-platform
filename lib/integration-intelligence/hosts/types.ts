export type HostsProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type HostsCapabilityOperation = "read" | "write";

export type HostsCapabilityKey =
  | "property.read"
  | "reservation.read"
  | "arrival.read"
  | "departure.read"
  | "occupancy.read"
  | "availability.read"
  | "guest.read"
  | "cleaning.read"
  | "maintenance.read"
  | "host_task.read"
  | "host_revenue.read"
  | "host_payout.read"
  | "host_expense.read"
  | "host_forecast.read"
  | "host_report.read"
  | "payout.read"
  | "revenue.read"
  | "expense.read"
  | "forecast.read"
  | "report.export"
  | "guest_response.draft"
  | "host_task.create"
  | "cleaning_task.assign"
  | "maintenance_task.create"
  | "message.draft";

/** Blocked in Companion runtime — never expose as enabled capabilities. */
export const HOSTS_BLOCKED_CAPABILITY_KEYS = [
  "reservation.delete",
  "reservation.cancel",
  "payment.execute",
  "payment.refund",
  "refund.execute",
  "message.send",
  "guest_response.send",
  "property.delete",
  "guest.delete",
  "payout.execute",
  "pricing.change",
  "reservation.update",
] as const;

export type HostsBlockedCapabilityKey = (typeof HOSTS_BLOCKED_CAPABILITY_KEYS)[number];

export type NormalizedReservationStatus =
  | "inquiry"
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export type NormalizedPropertyStatus = "active" | "inactive" | "maintenance" | "archived";

export type HostsFreshness = "fresh" | "stale" | "unknown";
export type HostsCompleteness = "complete" | "partial" | "empty";

export type HostsReadiness =
  | "production_ready_candidate"
  | "connected"
  | "connected_but_partial"
  | "source_missing"
  | "adapter_missing"
  | "specification_only"
  | "disabled"
  | "blocked_by_governance";

export type PropertySummary = {
  property_id: string;
  display_name: string;
  status: NormalizedPropertyStatus;
  location_summary: string | null;
  provider_reference: string;
  source_reference: string;
  freshness: HostsFreshness;
  completeness: HostsCompleteness;
};

export type ReservationSummary = {
  reservation_id: string;
  property_id: string;
  guest_reference: string;
  arrival_at: string | null;
  departure_at: string | null;
  status: NormalizedReservationStatus;
  guest_count: number | null;
  revenue_summary: string | null;
  source_reference: string;
  freshness: HostsFreshness;
  completeness: HostsCompleteness;
};

export type HostOperationsSummary = {
  upcoming_arrivals: number;
  upcoming_departures: number;
  occupancy: number | null;
  cleaning_due: number;
  cleaning_overdue: number;
  maintenance_open: number;
  maintenance_urgent: number;
  property_not_ready: number;
  reservation_changes: number;
  occupancy_deviation: number;
  unresolved_tasks: number;
  guest_attention_required: number;
  generated_at: string;
  source_reference: string;
  freshness: HostsFreshness;
  completeness: HostsCompleteness;
};

export type HostFinanceSummary = {
  revenue: {
    booked_amount: number | null;
    recognized_amount: number | null;
    currency: string;
    is_forecast: false;
  };
  payouts: {
    upcoming_amount: number | null;
    overdue_count: number;
    currency: string;
  };
  expenses: {
    outstanding_amount: number | null;
    currency: string;
  };
  forecast: {
    expected_revenue: number | null;
    expected_expenses: number | null;
    estimated_net: number | null;
    is_forecast: true;
    currency: string;
  };
  reconciliation_status: "balanced" | "attention_required" | "unavailable";
  forecast_warning_active: boolean;
  period: string;
  source_reference: string;
  freshness: HostsFreshness;
  completeness: HostsCompleteness;
};

export type HostsReadOutcome =
  | "exact_match"
  | "multiple_matches"
  | "no_match"
  | "permission_denied"
  | "provider_missing"
  | "source_missing"
  | "activation_pending"
  | "partial_result"
  | "empty_portfolio";

export type HostsWriteOutcome =
  | "draft_created"
  | "confirmation_required"
  | "execution_source_missing"
  | "approval_required"
  | "executed"
  | "failed"
  | "blocked_by_policy"
  | "permission_denied"
  | "provider_missing"
  | "activation_pending";

export type HostsPortfolioReadResult = {
  outcome: HostsReadOutcome;
  properties: readonly PropertySummary[];
  reservations: readonly ReservationSummary[];
  operations: HostOperationsSummary | null;
  finance: HostFinanceSummary | null;
  outcome_key: string | null;
  audit_id: string | null;
  limitations: readonly string[];
};

export type HostsWriteProposal = {
  proposal_id: string;
  capability_key: Extract<
    HostsCapabilityKey,
    "guest_response.draft" | "host_task.create" | "cleaning_task.assign" | "maintenance_task.create"
  >;
  entity_id: string | null;
  draft_text: string | null;
  task_summary: string | null;
  assignee_reference: string | null;
  requires_confirmation: true;
  requires_approval: boolean;
  grounded_sources: readonly string[];
  limitations: readonly string[];
};

export type HostsWriteResult = {
  outcome: HostsWriteOutcome;
  proposal: HostsWriteProposal | null;
  entity_id: string | null;
  outcome_key: string | null;
  audit_id: string | null;
  limitations: readonly string[];
};

export type HostsCapabilityManifest = {
  capability_key: HostsCapabilityKey;
  operation: HostsCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type HostsProviderSourceEngine =
  | "property_center"
  | "booking_center"
  | "guest_center"
  | "calendar_center"
  | "operations_center"
  | "finance_center"
  | "communication_center"
  | "reports_center"
  | "access_center"
  | "hosts_pack_adapter"
  | "smart_scheduling_center"
  | "inventory_amenities_center"
  | "insurance_compliance_center"
  | "vendor_marketplace_center"
  | "enterprise_portfolio_center";

export type HostsProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: HostsProviderSourceEngine;
  implementation_status: HostsProviderImplementationStatus;
  capabilities: readonly HostsCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const HOSTS_BUSINESS_PACK_KEYS = [
  "aipify_hosts",
  "hosts",
  "hosts_pack",
  "hospitality",
] as const;

export const HOSTS_V2_SPECIFICATION_ONLY_ENGINES: readonly HostsProviderSourceEngine[] = [
  "smart_scheduling_center",
  "inventory_amenities_center",
  "insurance_compliance_center",
  "vendor_marketplace_center",
  "enterprise_portfolio_center",
];

export function isHostsBusinessPackActive(activeBusinessPacks: readonly string[]): boolean {
  return activeBusinessPacks.some((pack) =>
    (HOSTS_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildHostsCapabilityId(
  providerKey: string,
  capabilityKey: HostsCapabilityKey,
  operation: HostsCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isHostsCapabilityBlocked(capabilityKey: string): boolean {
  return (HOSTS_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}
