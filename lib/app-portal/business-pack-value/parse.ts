import type {
  PackValueCard,
  PackValueDetail,
  PackValueExportResult,
  PackValueHighlight,
  PackValueOverview,
  PackValueRecommendation,
  PackValueReports,
  PackValueSnapshot,
  PackValueTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : typeof v === "string" ? Number(v) || fb : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseTimeline(raw: unknown): PackValueTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), event_type: str(d.event_type), description: str(d.description), created_at: str(d.created_at) };
  });
}

function parseRecommendations(raw: unknown): PackValueRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), pack_key: str(d.pack_key) };
  });
}

function parseHighlights(raw: unknown): PackValueHighlight[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      pack_key: str(d.pack_key),
      name: str(d.name),
      estimated_value: num(d.estimated_value) || undefined,
    };
  });
}

function parseSnapshots(raw: unknown): PackValueSnapshot[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      snapshot_date: str(d.snapshot_date),
      estimated_value: num(d.estimated_value),
      potential_value: num(d.potential_value),
      time_saved_hours: num(d.time_saved_hours),
      adoption_score: num(d.adoption_score),
      value_trend: str(d.value_trend),
    };
  });
}

function parsePackCard(raw: unknown): PackValueCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const breakdown = d.category_breakdown;
  return {
    id: str(d.id || d.pack_key),
    pack_key: str(d.pack_key),
    name: str(d.name),
    department: str(d.department) || undefined,
    estimated_value: num(d.estimated_value),
    potential_value: num(d.potential_value),
    time_saved_hours: num(d.time_saved_hours),
    adoption_score: num(d.adoption_score),
    utilization_rate: num(d.utilization_rate),
    value_trend: str(d.value_trend),
    roi_indicator: str(d.roi_indicator),
    primary_category: str(d.primary_category),
    category_breakdown: breakdown && typeof breakdown === "object" ? (breakdown as Record<string, number>) : undefined,
    executive_summary: str(d.executive_summary),
    improvement_opportunities: parseStringArray(d.improvement_opportunities),
    key_wins: parseStringArray(d.key_wins),
    strategic_observations: parseStringArray(d.strategic_observations),
    installed_at: str(d.installed_at) || null,
    last_activity_at: str(d.last_activity_at) || null,
    timeline: parseTimeline(d.timeline),
  };
}

export function parsePackValueOverview(data: unknown): PackValueOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    has_value_data: d.has_value_data === true,
    total_estimated_value: num(d.total_estimated_value),
    total_time_saved_hours: num(d.total_time_saved_hours),
    realized_value: num(d.realized_value),
    potential_value: num(d.potential_value),
    value_trends: d.value_trends && typeof d.value_trends === "object" ? (d.value_trends as Record<string, number>) : {},
    category_distribution: d.category_distribution && typeof d.category_distribution === "object" ? (d.category_distribution as Record<string, number>) : {},
    highest_value_packs: parseHighlights(d.highest_value_packs),
    packs: Array.isArray(d.packs) ? d.packs.map((p) => parsePackCard(p)).filter(Boolean) as PackValueCard[] : [],
    recommendations: parseRecommendations(d.recommendations),
    executive_summary: str(d.executive_summary),
    principle: str(d.principle),
  };
}

export function parsePackValueDetail(data: unknown): PackValueDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", pack_key: "", name: "", estimated_value: 0, potential_value: 0,
      time_saved_hours: 0, adoption_score: 0, utilization_rate: 0, value_trend: "",
      roi_indicator: "", primary_category: "", executive_summary: "",
    };
  }
  const d = data as Record<string, unknown>;
  const card = parsePackCard(d);
  const report = d.executive_report as Record<string, unknown> | undefined;
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.pack_key), pack_key: str(d.pack_key), name: str(d.name),
      estimated_value: num(d.estimated_value), potential_value: num(d.potential_value),
      time_saved_hours: num(d.time_saved_hours), adoption_score: num(d.adoption_score),
      utilization_rate: num(d.utilization_rate), value_trend: str(d.value_trend),
      roi_indicator: str(d.roi_indicator), primary_category: str(d.primary_category),
      executive_summary: str(d.executive_summary),
    }),
    value_snapshots: parseSnapshots(d.value_snapshots),
    executive_report: report ? {
      executive_summary: str(report.executive_summary),
      pack_contribution: num(report.pack_contribution),
      key_wins: parseStringArray(report.key_wins),
      improvement_areas: parseStringArray(report.improvement_areas),
      recommendations: parseRecommendations(report.recommendations),
      strategic_observations: parseStringArray(report.strategic_observations),
    } : undefined,
    recommendations: parseRecommendations(d.recommendations),
    can_export: d.can_export === true,
  };
}

export function parsePackValueReports(data: unknown): PackValueReports {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_export: d.can_export === true,
    executive_summary: str(d.executive_summary),
    total_estimated_value: num(d.total_estimated_value),
    total_time_saved_hours: num(d.total_time_saved_hours),
    realized_value: num(d.realized_value),
    potential_value: num(d.potential_value),
    highest_value_packs: parseHighlights(d.highest_value_packs),
    value_trends: d.value_trends && typeof d.value_trends === "object" ? (d.value_trends as Record<string, number>) : {},
    category_distribution: d.category_distribution && typeof d.category_distribution === "object" ? (d.category_distribution as Record<string, number>) : {},
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
    report_generated_at: str(d.report_generated_at) || undefined,
  };
}

export function parsePackValueExportResult(data: unknown): PackValueExportResult {
  if (!data || typeof data !== "object") {
    return { export_id: "", status: "failed", format: "csv", file_name: "", content_type: "", content: "" };
  }
  const d = data as Record<string, unknown>;
  return {
    export_id: str(d.export_id),
    status: str(d.status),
    format: str(d.format),
    file_name: str(d.file_name),
    content_type: str(d.content_type),
    content: str(d.content),
    estimate_disclaimer: str(d.estimate_disclaimer) || undefined,
  };
}
