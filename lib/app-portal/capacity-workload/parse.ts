import type {
  CapacityCategory,
  CapacityDashboard,
  CapacityDetail,
  CapacityListResponse,
  CapacityRecordItem,
  CapacityRecommendation,
  CapacityStatus,
  TeamBreakdownItem,
  TrendDirection,
  TrendHistoryItem,
  WorkloadInsight,
  WorkloadLevel,
} from "./types";

const CATEGORIES = new Set<CapacityCategory>([
  "individual_capacity", "team_capacity", "department_capacity", "operational_capacity",
  "leadership_capacity", "support_capacity", "project_capacity", "seasonal_capacity",
  "growth_capacity", "custom_category",
]);
const STATUSES = new Set<CapacityStatus>([
  "healthy", "approaching_limit", "overloaded", "underutilized", "requires_review",
]);
const WORKLOAD = new Set<WorkloadLevel>(["very_low", "balanced", "elevated", "high", "critical"]);
const TRENDS = new Set<TrendDirection>(["increasing", "stable", "decreasing"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => str(x)) : [];
}

function parseTeamBreakdown(v: unknown): TeamBreakdownItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    const d = item as Record<string, unknown>;
    const wl = str(d.workload_level) as WorkloadLevel;
    return {
      name: str(d.name),
      utilization: num(d.utilization),
      workload_level: WORKLOAD.has(wl) ? wl : undefined,
    };
  });
}

function parseRecord(raw: unknown): CapacityRecordItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "team_capacity") as CapacityCategory;
  const status = str(d.status, "healthy") as CapacityStatus;
  const wl = str(d.workload_level, "balanced") as WorkloadLevel;
  const trend = str(d.trend_direction, "stable") as TrendDirection;
  return {
    id: str(d.id),
    title: str(d.title),
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    team_name: str(d.team_name),
    category: CATEGORIES.has(cat) ? cat : "team_capacity",
    current_utilization: num(d.current_utilization),
    recommended_utilization: num(d.recommended_utilization, 75),
    trend_direction: TRENDS.has(trend) ? trend : "stable",
    workload_level: WORKLOAD.has(wl) ? wl : "balanced",
    status: STATUSES.has(status) ? status : "healthy",
    last_updated_date: str(d.last_updated_date) || undefined,
    related_operations: strArray(d.related_operations),
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    team_breakdown: parseTeamBreakdown(d.team_breakdown),
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseTrend(raw: unknown): TrendHistoryItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const wl = str(d.workload_level, "balanced") as WorkloadLevel;
  const trend = str(d.trend_direction, "stable") as TrendDirection;
  return {
    id: str(d.id),
    utilization: num(d.utilization),
    workload_level: WORKLOAD.has(wl) ? wl : "balanced",
    trend_direction: TRENDS.has(trend) ? trend : "stable",
    notes: str(d.notes) || undefined,
    recorded_at: str(d.recorded_at),
  };
}

function parseRecs(raw: unknown): CapacityRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), record_id: str(row.record_id) || undefined };
  });
}

function parseInsights(raw: unknown): WorkloadInsight[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => {
    const row = p as Record<string, unknown>;
    return { key: str(row.key), active: row.active === true };
  });
}

function parseDashboard(raw: unknown): CapacityDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    overview_utilization: num(d.overview_utilization),
    teams_approaching_limits: typeof d.teams_approaching_limits === "number" ? d.teams_approaching_limits : 0,
    balanced_teams: typeof d.balanced_teams === "number" ? d.balanced_teams : 0,
    recent_changes: Array.isArray(d.recent_changes) ? d.recent_changes.map(parseRecord) : [],
    recommended_reviews: typeof d.recommended_reviews === "number" ? d.recommended_reviews : 0,
  };
}

export function parseCapacityList(data: unknown): CapacityListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseRecord) : [],
    dashboard: parseDashboard(d.dashboard),
    workload_insights: parseInsights(d.workload_insights),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseCapacityDetail(data: unknown): CapacityDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const audit = Array.isArray(d.audit_history)
    ? d.audit_history.map((a) => {
        const row = a as Record<string, unknown>;
        return { id: str(row.id), event_type: str(row.event_type), description: str(row.description), created_at: str(row.created_at), performed_by: str(row.performed_by) };
      })
    : [];
  return {
    found: true,
    can_manage: d.can_manage === true,
    record: d.record ? parseRecord(d.record) : undefined,
    trend_history: Array.isArray(d.trend_history) ? d.trend_history.map(parseTrend) : [],
    related_follow_ups: Array.isArray(d.related_follow_ups) ? d.related_follow_ups.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parseCapacityRecordItem(data: unknown): CapacityRecordItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.record) return parseRecord(d.record);
  return parseRecord(d);
}
