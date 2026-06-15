export type HostsFinanceCenterSectionKey =
  | "overview"
  | "revenue"
  | "payouts"
  | "expenses"
  | "forecasts"
  | "reports";

export type HostsFinanceOverview = {
  revenue_this_month: number;
  revenue_ytd: number;
  upcoming_payouts: number;
  outstanding_expenses: number;
  net_performance: number;
};

export type HostsFinanceForecast = {
  expected_revenue: number;
  expected_expenses: number;
  estimated_net_position: number;
};

export type HostsRevenueRow = {
  id: string;
  revenue_key: string;
  property: string;
  property_id: string | null;
  reservation_ref: string;
  check_in_date: string | null;
  check_out_date: string | null;
  amount: number;
  revenue_status: string;
};

export type HostsPayoutRow = {
  id: string;
  payout_key: string;
  expected_date: string;
  amount: number;
  source: string;
  payout_status: string;
};

export type HostsExpenseRow = {
  id: string;
  expense_key: string;
  category: string;
  property: string;
  property_id: string | null;
  amount: number;
  expense_date: string;
  notes: string | null;
};

export type HostsFinancePropertyOption = {
  id: string;
  display_name: string;
};

export type HostsFinanceReportOption = {
  key: string;
  label: string;
};

export type HostsFinanceNotification = {
  key: string;
  active: boolean;
  count: number;
  message: string;
};

export type HostsFinanceCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  active_filter: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  filters: Array<{ key: string; label: string }>;
  reports: HostsFinanceReportOption[];
  export_formats: string[];
  revenue_statuses: string[];
  payout_statuses: string[];
  expense_categories: string[];
  notifications: HostsFinanceNotification[];
  overview: HostsFinanceOverview;
  forecast: HostsFinanceForecast;
  revenue_entries: HostsRevenueRow[];
  payouts: HostsPayoutRow[];
  expenses: HostsExpenseRow[];
  properties: HostsFinancePropertyOption[];
};

export type HostsFinanceCenterActionResult = {
  success: boolean;
  expense_id?: string;
  report_key?: string;
  format?: string;
  message?: string;
};
