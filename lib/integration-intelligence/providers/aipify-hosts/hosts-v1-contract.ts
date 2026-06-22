import {
  normalizePropertyStatus,
  normalizeReservationStatus,
} from "@/lib/integration-intelligence/hosts/status-normalization";
import { maskHostsGuestReference } from "@/lib/integration-intelligence/hosts/masking";
import type {
  HostFinanceSummary,
  HostOperationsSummary,
  HostsCompleteness,
  HostsFreshness,
  PropertySummary,
  ReservationSummary,
} from "@/lib/integration-intelligence/hosts/types";

type RawRow = Record<string, unknown>;

function asArray(value: unknown): RawRow[] {
  return Array.isArray(value) ? (value as RawRow[]) : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function mapPropertyRows(rows: unknown, sourceReference: string): PropertySummary[] {
  return asArray(rows).map((row) => ({
    property_id: String(row.id ?? row.property_id ?? "").trim(),
    display_name: String(row.display_name ?? row.name ?? row.property ?? "Property").trim(),
    status: normalizePropertyStatus(String(row.status ?? "active")),
    location_summary: row.location ? String(row.location) : null,
    provider_reference: String(row.id ?? ""),
    source_reference: sourceReference,
    freshness: "fresh" as HostsFreshness,
    completeness: "partial" as HostsCompleteness,
  }));
}

export function mapReservationRows(rows: unknown, sourceReference: string): ReservationSummary[] {
  return asArray(rows).map((row) => ({
    reservation_id: String(row.id ?? row.reservation_key ?? row.reservation_id ?? "").trim(),
    property_id: String(row.property_id ?? "").trim(),
    guest_reference: maskHostsGuestReference(
      row.guest_reference ? String(row.guest_reference) : row.guest_name ? String(row.guest_name) : null,
    ),
    arrival_at: row.check_in_date ? String(row.check_in_date) : row.arrival_at ? String(row.arrival_at) : null,
    departure_at: row.check_out_date ? String(row.check_out_date) : row.departure_at ? String(row.departure_at) : null,
    status: normalizeReservationStatus(String(row.booking_status ?? row.status ?? "pending")),
    guest_count: typeof row.number_of_guests === "number" ? row.number_of_guests : null,
    revenue_summary: row.total_amount ? String(row.total_amount) : null,
    source_reference: sourceReference,
    freshness: "fresh",
    completeness: "partial",
  }));
}

export function mapOperationsDashboard(data: unknown): {
  operations: HostOperationsSummary | null;
  source_exact: boolean;
  limitations: readonly string[];
} {
  if (!data || typeof data !== "object") {
    return { operations: null, source_exact: false, limitations: ["Operations dashboard missing."] };
  }
  const record = data as Record<string, unknown>;
  if (record.has_customer === false) {
    return { operations: null, source_exact: false, limitations: ["No Hosts customer context."] };
  }

  const snapshot = asRecord(record.today_snapshot);
  const boards = asRecord(record.boards);
  const arrivals = asArray(boards.arrivals);
  const departures = asArray(boards.departures);
  const cleaning = asArray(boards.cleaning);
  const maintenance = asArray(boards.maintenance);
  const guestRequests = asArray(boards.guest_requests);

  const cleaningDue = cleaning.filter((row) => {
    const status = String(row.completion_status ?? "").toLowerCase();
    return status !== "completed" && status !== "overdue";
  }).length;

  const cleaningOverdue = cleaning.filter((row) => {
    const status = String(row.completion_status ?? "").toLowerCase();
    return status === "overdue";
  }).length;

  const maintenanceOpen = maintenance.filter((row) => {
    const status = String(row.priority ?? "").toLowerCase();
    return status !== "completed" && status !== "resolved";
  }).length;

  const maintenanceUrgent = maintenance.filter((row) => {
    const priority = String(row.priority ?? "").toLowerCase();
    return priority === "urgent" || priority === "critical" || priority === "high";
  }).length;

  const propertyNotReady = arrivals.filter(
    (row) => String(row.property_readiness ?? "").toLowerCase() === "attention_required",
  ).length;

  const operationsNotifications = asArray(record.notifications);
  const occupancyDeviation = operationsNotifications.filter(
    (row) => String(row.key ?? "") === "occupancy_deviation" && row.active === true,
  ).length;

  const operations: HostOperationsSummary = {
    upcoming_arrivals: num(snapshot.arrivals_today) ?? arrivals.length,
    upcoming_departures: num(snapshot.departures_today) ?? departures.length,
    occupancy: num(snapshot.occupancy_rate),
    cleaning_due: cleaningDue,
    cleaning_overdue: cleaningOverdue,
    maintenance_open: maintenanceOpen,
    maintenance_urgent: maintenanceUrgent,
    property_not_ready: propertyNotReady,
    reservation_changes: 0,
    occupancy_deviation: occupancyDeviation,
    unresolved_tasks: num(snapshot.pending_approvals) ?? 0,
    guest_attention_required: num(snapshot.open_guest_requests) ?? guestRequests.length,
    generated_at: new Date().toISOString(),
    source_reference: "short_term_operations:get_aipify_hosts_operations_dashboard",
    freshness: "fresh",
    completeness: "partial",
  };

  return {
    operations,
    source_exact: operations.upcoming_arrivals > 0 || operations.cleaning_due > 0 || operations.maintenance_open > 0,
    limitations: [
      "customerApp.companionPlatformKnowledge.hosts.warnings.operationsPartialSource",
      propertyNotReady > 0 ? "customerApp.companionPlatformKnowledge.hosts.warnings.propertyNotReady" : "",
    ].filter(Boolean),
  };
}

export function mapFinanceDashboard(data: unknown): {
  finance: HostFinanceSummary | null;
  source_exact: boolean;
  limitations: readonly string[];
} {
  if (!data || typeof data !== "object") {
    return { finance: null, source_exact: false, limitations: ["Finance dashboard missing."] };
  }
  const record = data as Record<string, unknown>;
  if (record.has_customer === false) {
    return { finance: null, source_exact: false, limitations: ["No Hosts finance context."] };
  }

  const overview = asRecord(record.overview);
  const forecast = asRecord(record.forecast);
  const payouts = asArray(record.payouts);
  const notifications = asArray(record.notifications);

  const overduePayouts = payouts.filter(
    (row) => String(row.payout_status ?? "").toLowerCase() === "delayed",
  ).length;

  const hasDiscrepancy = notifications.some(
    (row) => String(row.key ?? "") === "revenue_discrepancy" && row.active === true,
  );
  const forecastWarning = notifications.some(
    (row) => String(row.key ?? "") === "forecast_warning" && row.active === true,
  );

  const finance: HostFinanceSummary = {
    revenue: {
      booked_amount: num(overview.revenue_this_month),
      recognized_amount: num(overview.revenue_ytd),
      currency: "NOK",
      is_forecast: false,
    },
    payouts: {
      upcoming_amount: num(overview.upcoming_payouts),
      overdue_count: overduePayouts,
      currency: "NOK",
    },
    expenses: {
      outstanding_amount: num(overview.outstanding_expenses),
      currency: "NOK",
    },
    forecast: {
      expected_revenue: num(forecast.expected_revenue),
      expected_expenses: num(forecast.expected_expenses),
      estimated_net: num(forecast.estimated_net_position),
      is_forecast: true,
      currency: "NOK",
    },
    reconciliation_status: hasDiscrepancy ? "attention_required" : "balanced",
    forecast_warning_active: forecastWarning,
    period: "current_month",
    source_reference: "short_term_finance:get_aipify_hosts_finance_center_dashboard",
    freshness: "fresh",
    completeness: "partial",
  };

  return {
    finance,
    source_exact: finance.revenue.booked_amount !== null || finance.payouts.upcoming_amount !== null,
    limitations: [
      "customerApp.companionPlatformKnowledge.hosts.warnings.financePartialSource",
      "customerApp.companionPlatformKnowledge.hosts.warnings.forecastNotActualRevenue",
    ],
  };
}

export function mapHostsV1Bundle(input: {
  propertyData: unknown;
  bookingData: unknown;
  operationsData: unknown;
  financeData: unknown;
}): {
  properties: PropertySummary[];
  reservations: ReservationSummary[];
  operations: HostOperationsSummary | null;
  finance: HostFinanceSummary | null;
  source_exact: boolean;
  limitations: readonly string[];
} {
  const properties = mapPropertyRows(
    asRecord(input.propertyData).properties ?? asArray(input.propertyData),
    "short_term_property:get_aipify_hosts_property_center_dashboard",
  );

  const reservations = mapReservationRows(
    asRecord(input.bookingData).reservations ?? [],
    "short_term_reservation:get_aipify_hosts_booking_center_dashboard",
  );

  const reservationChanges = reservations.filter(
    (row) => row.status === "pending" || row.status === "inquiry",
  ).length;

  const operationsBundle = mapOperationsDashboard(input.operationsData);
  if (operationsBundle.operations) {
    operationsBundle.operations = {
      ...operationsBundle.operations,
      reservation_changes: reservationChanges,
    };
  }
  const financeBundle = mapFinanceDashboard(input.financeData);

  const limitations = [
    ...operationsBundle.limitations,
    ...financeBundle.limitations,
  ];

  const sourceExact =
    properties.length > 0 ||
    reservations.length > 0 ||
    operationsBundle.source_exact ||
    financeBundle.source_exact;

  return {
    properties,
    reservations,
    operations: operationsBundle.operations,
    finance: financeBundle.finance,
    source_exact: sourceExact,
    limitations,
  };
}

export function countBoardItemsByStatus(
  rows: readonly RawRow[],
  field: string,
  values: readonly string[],
): number {
  return rows.filter((row) => values.includes(String(row[field] ?? "").toLowerCase())).length;
}
