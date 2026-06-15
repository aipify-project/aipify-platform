export type HostsReportFilterKey =
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "quarter"
  | "year"
  | "custom";

export type HostsExecutiveMetrics = {
  occupancy_rate_pct: number;
  revenue_this_month: number;
  revenue_ytd: number;
  average_length_of_stay: number;
  guest_satisfaction_score: number;
  active_incidents: number;
  open_maintenance_tasks: number;
  team_completion_rate_pct: number;
  currency: string;
};

export type HostsPropertyComparisonRow = {
  property_id: string;
  property_name: string;
  revenue: number;
  occupancy_pct: number;
  incidents: number;
  guest_satisfaction: number;
  maintenance_burden: number;
};

export type HostsExecutiveSummary = {
  operational_highlights: string[];
  areas_requiring_attention: string[];
  improvement_opportunities: string[];
};

export type HostsScheduledReport = {
  id: string;
  report_category: string;
  cadence: string;
  delivery_method: string;
  export_format: string;
  is_active: boolean;
};

export type HostsReportsDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_filter: string;
  positioning: string;
  governance: Record<string, boolean>;
  executive_metrics: HostsExecutiveMetrics;
  report_categories: Array<{ key: string; label: string }>;
  filters: Array<{ key: string; label: string }>;
  export_formats: string[];
  schedule_cadences: string[];
  delivery_methods: string[];
  property_comparison: HostsPropertyComparisonRow[];
  widgets: {
    top_performing_properties: Array<Record<string, unknown>>;
    properties_requiring_attention: Array<Record<string, unknown>>;
    revenue_trends: Array<{ period: string; value: number }>;
    occupancy_trends: Array<{ period: string; value: number }>;
    team_productivity: { completion_rate_pct: number; tasks_completed: number };
  };
  executive_summary: HostsExecutiveSummary;
  scheduled_reports: HostsScheduledReport[];
};

export type HostsReportExportResult = {
  export_id?: string;
  status: string;
  format?: string;
  category?: string;
  message?: string;
};

export type HostsReportScheduleResult = {
  schedule_id?: string;
  status: string;
};
