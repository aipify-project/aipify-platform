import type {
  HostsPropertyHealthActionResult,
  HostsPropertyHealthDashboard,
  HostsPropertyHealthInputs,
  HostsPropertyHealthRecommendationRow,
  HostsPropertyHealthRiskRow,
  HostsPropertyHealthStats,
  HostsPropertyHealthTrendPoint,
  HostsPropertyScoreRow,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseInputs(data: unknown): HostsPropertyHealthInputs {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    occupancy_status: Number(d.occupancy_status ?? 0),
    guest_satisfaction: Number(d.guest_satisfaction ?? 0),
    cleaning_completion: Number(d.cleaning_completion ?? 0),
    maintenance_status: Number(d.maintenance_status ?? 0),
    incident_history: Number(d.incident_history ?? 0),
    inspection_results: Number(d.inspection_results ?? 0),
    supply_readiness: Number(d.supply_readiness ?? 0),
    access_readiness: Number(d.access_readiness ?? 0),
    document_readiness: Number(d.document_readiness ?? 0),
  };
}

function parseScoreRow(data: unknown): HostsPropertyScoreRow | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.id) return null;
  return {
    id: String(d.id),
    score_key: typeof d.score_key === "string" ? d.score_key : "",
    property_id: d.property_id != null ? String(d.property_id) : "",
    property: typeof d.property === "string" ? d.property : "—",
    overall_score: Number(d.overall_score ?? 0),
    score_level: typeof d.score_level === "string" ? d.score_level : "attention_required",
    score_trend: Number(d.score_trend ?? 0),
    guest_experience_score: Number(d.guest_experience_score ?? 0),
    operations_score: Number(d.operations_score ?? 0),
    safety_score: Number(d.safety_score ?? 0),
    maintenance_score: Number(d.maintenance_score ?? 0),
    finance_score: Number(d.finance_score ?? 0),
    compliance_score: Number(d.compliance_score ?? 0),
    inputs: parseInputs(d.inputs),
    top_strengths: asArray<string>(d.top_strengths),
    computed_at: typeof d.computed_at === "string" ? d.computed_at : "",
  };
}

function parseScores(data: unknown): HostsPropertyScoreRow[] {
  return asArray<unknown>(data)
    .map((row) => parseScoreRow(row))
    .filter((r): r is HostsPropertyScoreRow => r !== null);
}

function parseRisks(data: unknown): HostsPropertyHealthRiskRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        risk_key: typeof d.risk_key === "string" ? d.risk_key : "",
        property_id: d.property_id != null ? String(d.property_id) : "",
        property: typeof d.property === "string" ? d.property : "—",
        risk_indicator: typeof d.risk_indicator === "string" ? d.risk_indicator : "",
        severity: typeof d.severity === "string" ? d.severity : "",
        summary: typeof d.summary === "string" ? d.summary : "",
        is_resolved: Boolean(d.is_resolved),
        unresolved_since: typeof d.unresolved_since === "string" ? d.unresolved_since : "",
        hours_unresolved: Number(d.hours_unresolved ?? 0),
      };
    })
    .filter((r): r is HostsPropertyHealthRiskRow => r !== null);
}

function parseRecommendations(data: unknown): HostsPropertyHealthRecommendationRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        recommendation_key: typeof d.recommendation_key === "string" ? d.recommendation_key : "",
        property_id: d.property_id != null ? String(d.property_id) : "",
        property: typeof d.property === "string" ? d.property : "—",
        action_summary: typeof d.action_summary === "string" ? d.action_summary : "",
        action_category: typeof d.action_category === "string" ? d.action_category : "",
        priority: typeof d.priority === "string" ? d.priority : "",
        is_completed: Boolean(d.is_completed),
      };
    })
    .filter((r): r is HostsPropertyHealthRecommendationRow => r !== null);
}

function parseStats(data: unknown): HostsPropertyHealthStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    overall_score: Number(d.overall_score ?? 0),
    portfolio_level: typeof d.portfolio_level === "string" ? d.portfolio_level : "attention_required",
    excellent_count: Number(d.excellent_count ?? 0),
    good_count: Number(d.good_count ?? 0),
    attention_count: Number(d.attention_count ?? 0),
    critical_count: Number(d.critical_count ?? 0),
    open_risks: Number(d.open_risks ?? 0),
    pending_actions: Number(d.pending_actions ?? 0),
    avg_score_trend: Number(d.avg_score_trend ?? 0),
  };
}

function parseTrend(data: unknown): HostsPropertyHealthTrendPoint[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.date) return null;
      return {
        date: String(d.date),
        score: Number(d.score ?? 0),
        level: typeof d.level === "string" ? d.level : "",
      };
    })
    .filter((r): r is HostsPropertyHealthTrendPoint => r !== null);
}

export function parseAipifyHostsPropertyHealthDashboard(data: unknown): HostsPropertyHealthDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;

  const detailRaw = d.property_detail;
  const detail = detailRaw && typeof detailRaw === "object" && detailRaw !== null && (detailRaw as Record<string, unknown>).id
    ? parseScoreRow(detailRaw)
    : null;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "portfolio_overview",
    selected_property_id: d.selected_property_id != null ? String(d.selected_property_id) : null,
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    score_levels: asArray<string>(d.score_levels),
    stats: parseStats(d.stats),
    score_trend: parseTrend(d.score_trend),
    top_strengths: asArray<string>(d.top_strengths),
    property_scores: parseScores(d.property_scores),
    open_risks: parseRisks(d.open_risks),
    recommended_actions: parseRecommendations(d.recommended_actions),
    property_detail: detail,
  };
}

export function parseAipifyHostsPropertyHealthActionResult(data: unknown): HostsPropertyHealthActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}
