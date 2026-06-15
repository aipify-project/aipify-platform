import type {
  HostsExpenseRow,
  HostsFinanceCenterActionResult,
  HostsFinanceCenterDashboard,
  HostsFinanceForecast,
  HostsFinanceNotification,
  HostsFinanceOverview,
  HostsFinanceReportOption,
  HostsFinancePropertyOption,
  HostsPayoutRow,
  HostsRevenueRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function parseOverview(data: unknown): HostsFinanceOverview {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    revenue_this_month: num(d.revenue_this_month),
    revenue_ytd: num(d.revenue_ytd),
    upcoming_payouts: num(d.upcoming_payouts),
    outstanding_expenses: num(d.outstanding_expenses),
    net_performance: num(d.net_performance),
  };
}

function parseForecast(data: unknown): HostsFinanceForecast {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    expected_revenue: num(d.expected_revenue),
    expected_expenses: num(d.expected_expenses),
    estimated_net_position: num(d.estimated_net_position),
  };
}

function parseRevenue(data: unknown): HostsRevenueRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        revenue_key: typeof d.revenue_key === "string" ? d.revenue_key : "",
        property: typeof d.property === "string" ? d.property : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        reservation_ref: typeof d.reservation_ref === "string" ? d.reservation_ref : "",
        check_in_date: d.check_in_date != null ? String(d.check_in_date) : null,
        check_out_date: d.check_out_date != null ? String(d.check_out_date) : null,
        amount: num(d.amount),
        revenue_status: typeof d.revenue_status === "string" ? d.revenue_status : "",
      };
    })
    .filter((r): r is HostsRevenueRow => r !== null);
}

function parsePayouts(data: unknown): HostsPayoutRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        payout_key: typeof d.payout_key === "string" ? d.payout_key : "",
        expected_date: String(d.expected_date ?? ""),
        amount: num(d.amount),
        source: typeof d.source === "string" ? d.source : "",
        payout_status: typeof d.payout_status === "string" ? d.payout_status : "",
      };
    })
    .filter((r): r is HostsPayoutRow => r !== null);
}

function parseExpenses(data: unknown): HostsExpenseRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        expense_key: typeof d.expense_key === "string" ? d.expense_key : "",
        category: typeof d.category === "string" ? d.category : "",
        property: typeof d.property === "string" ? d.property : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        amount: num(d.amount),
        expense_date: String(d.expense_date ?? ""),
        notes: typeof d.notes === "string" ? d.notes : null,
      };
    })
    .filter((r): r is HostsExpenseRow => r !== null);
}

function parseProperties(data: unknown): HostsFinancePropertyOption[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return { id: String(d.id), display_name: typeof d.display_name === "string" ? d.display_name : "" };
    })
    .filter((r): r is HostsFinancePropertyOption => r !== null);
}

function parseNotifications(data: unknown): HostsFinanceNotification[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.key) return null;
      return {
        key: String(d.key),
        active: Boolean(d.active),
        count: Number(d.count ?? 0),
        message: typeof d.message === "string" ? d.message : "",
      };
    })
    .filter((r): r is HostsFinanceNotification => r !== null);
}

export function parseAipifyHostsFinanceCenterDashboard(data: unknown): HostsFinanceCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "overview",
    active_filter: typeof d.active_filter === "string" ? d.active_filter : "all_properties",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    filters: asArray<{ key: string; label: string }>(d.filters),
    reports: asArray<HostsFinanceReportOption>(d.reports),
    export_formats: asArray<string>(d.export_formats),
    revenue_statuses: asArray<string>(d.revenue_statuses),
    payout_statuses: asArray<string>(d.payout_statuses),
    expense_categories: asArray<string>(d.expense_categories),
    notifications: parseNotifications(d.notifications),
    overview: parseOverview(d.overview),
    forecast: parseForecast(d.forecast),
    revenue_entries: parseRevenue(d.revenue_entries),
    payouts: parsePayouts(d.payouts),
    expenses: parseExpenses(d.expenses),
    properties: parseProperties(d.properties),
  };
}

export function parseAipifyHostsFinanceCenterActionResult(data: unknown): HostsFinanceCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    expense_id: d.expense_id != null ? String(d.expense_id) : undefined,
    report_key: typeof d.report_key === "string" ? d.report_key : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    message: typeof d.message === "string" ? d.message : undefined,
  };
}
