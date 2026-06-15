import type {
  HostsExecutiveMetrics,
  HostsExecutiveSummary,
  HostsPropertyComparisonRow,
  HostsReportExportResult,
  HostsReportScheduleResult,
  HostsReportsDashboard,
  HostsScheduledReport,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseMetrics(data: unknown): HostsExecutiveMetrics {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    occupancy_rate_pct: Number(d.occupancy_rate_pct ?? 0),
    revenue_this_month: Number(d.revenue_this_month ?? 0),
    revenue_ytd: Number(d.revenue_ytd ?? 0),
    average_length_of_stay: Number(d.average_length_of_stay ?? 0),
    guest_satisfaction_score: Number(d.guest_satisfaction_score ?? 0),
    active_incidents: Number(d.active_incidents ?? 0),
    open_maintenance_tasks: Number(d.open_maintenance_tasks ?? 0),
    team_completion_rate_pct: Number(d.team_completion_rate_pct ?? 0),
    currency: typeof d.currency === "string" ? d.currency : "NOK",
  };
}

function parseComparison(data: unknown): HostsPropertyComparisonRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.property_id) return null;
      return {
        property_id: String(d.property_id),
        property_name: typeof d.property_name === "string" ? d.property_name : "",
        revenue: Number(d.revenue ?? 0),
        occupancy_pct: Number(d.occupancy_pct ?? 0),
        incidents: Number(d.incidents ?? 0),
        guest_satisfaction: Number(d.guest_satisfaction ?? 0),
        maintenance_burden: Number(d.maintenance_burden ?? 0),
      };
    })
    .filter((r): r is HostsPropertyComparisonRow => r !== null);
}

function parseSummary(data: unknown): HostsExecutiveSummary {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    operational_highlights: asArray<string>(d.operational_highlights),
    areas_requiring_attention: asArray<string>(d.areas_requiring_attention),
    improvement_opportunities: asArray<string>(d.improvement_opportunities),
  };
}

function parseScheduled(data: unknown): HostsScheduledReport[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        report_category: typeof d.report_category === "string" ? d.report_category : "",
        cadence: typeof d.cadence === "string" ? d.cadence : "",
        delivery_method: typeof d.delivery_method === "string" ? d.delivery_method : "",
        export_format: typeof d.export_format === "string" ? d.export_format : "pdf",
        is_active: Boolean(d.is_active ?? true),
      };
    })
    .filter((r): r is HostsScheduledReport => r !== null);
}

export function parseAipifyHostsReportsDashboard(data: unknown): HostsReportsDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  const w = (d.widgets ?? {}) as Record<string, unknown>;
  const tp = w.team_productivity as Record<string, unknown> | undefined;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_filter: typeof d.active_filter === "string" ? d.active_filter : "last_30_days",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    executive_metrics: parseMetrics(d.executive_metrics),
    report_categories: asArray<{ key: string; label: string }>(d.report_categories),
    filters: asArray<{ key: string; label: string }>(d.filters),
    export_formats: asArray<string>(d.export_formats),
    schedule_cadences: asArray<string>(d.schedule_cadences),
    delivery_methods: asArray<string>(d.delivery_methods),
    property_comparison: parseComparison(d.property_comparison),
    widgets: {
      top_performing_properties: asArray<Record<string, unknown>>(w.top_performing_properties),
      properties_requiring_attention: asArray<Record<string, unknown>>(w.properties_requiring_attention),
      revenue_trends: asArray<{ period: string; value: number }>(w.revenue_trends),
      occupancy_trends: asArray<{ period: string; value: number }>(w.occupancy_trends),
      team_productivity: {
        completion_rate_pct: Number(tp?.completion_rate_pct ?? 0),
        tasks_completed: Number(tp?.tasks_completed ?? 0),
      },
    },
    executive_summary: parseSummary(d.executive_summary),
    scheduled_reports: parseScheduled(d.scheduled_reports),
  };
}

export function parseAipifyHostsReportExportResult(data: unknown): HostsReportExportResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    export_id: d.export_id != null ? String(d.export_id) : undefined,
    status: typeof d.status === "string" ? d.status : "",
    format: typeof d.format === "string" ? d.format : undefined,
    category: typeof d.category === "string" ? d.category : undefined,
    message: typeof d.message === "string" ? d.message : undefined,
  };
}

export function parseAipifyHostsReportScheduleResult(data: unknown): HostsReportScheduleResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    schedule_id: d.schedule_id != null ? String(d.schedule_id) : undefined,
    status: typeof d.status === "string" ? d.status : "",
  };
}
