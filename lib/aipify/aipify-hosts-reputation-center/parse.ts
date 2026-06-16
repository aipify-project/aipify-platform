import type {
  HostsImprovementOpportunity,
  HostsPropertyComparison,
  HostsPropertyReviewRow,
  HostsRecoveryCaseRow,
  HostsReputationCenterActionResult,
  HostsReputationCenterDashboard,
  HostsReputationStats,
  HostsReputationTrendPoint,
  HostsReputationTrends,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseReviews(data: unknown): HostsPropertyReviewRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      const scores = (d.category_scores as Record<string, unknown>) ?? {};
      const category_scores: Record<string, number> = {};
      for (const [k, v] of Object.entries(scores)) {
        category_scores[k] = Number(v);
      }
      return {
        id: String(d.id),
        review_key: typeof d.review_key === "string" ? d.review_key : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        guest_name: typeof d.guest_name === "string" ? d.guest_name : "",
        stay_period: typeof d.stay_period === "string" ? d.stay_period : "",
        stay_start: typeof d.stay_start === "string" ? d.stay_start : "",
        stay_end: typeof d.stay_end === "string" ? d.stay_end : "",
        overall_rating: Number(d.overall_rating ?? 0),
        review_date: typeof d.review_date === "string" ? d.review_date : "",
        review_status: typeof d.review_status === "string" ? d.review_status : "new",
        guest_summary: typeof d.guest_summary === "string" ? d.guest_summary : "",
        category_scores,
      };
    })
    .filter((r): r is HostsPropertyReviewRow => r !== null);
}

function parseRecoveryCases(data: unknown): HostsRecoveryCaseRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        case_key: typeof d.case_key === "string" ? d.case_key : "",
        review_id: d.review_id != null ? String(d.review_id) : null,
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        action_type: typeof d.action_type === "string" ? d.action_type : "",
        assigned_owner: typeof d.assigned_owner === "string" ? d.assigned_owner : "",
        due_date: typeof d.due_date === "string" ? d.due_date : "",
        case_status: typeof d.case_status === "string" ? d.case_status : "open",
        resolution_notes: typeof d.resolution_notes === "string" ? d.resolution_notes : "",
        is_overdue: Boolean(d.is_overdue),
      };
    })
    .filter((r): r is HostsRecoveryCaseRow => r !== null);
}

function parseTrendPoints(data: unknown): HostsReputationTrendPoint[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      return {
        month: typeof d.month === "string" ? d.month : "",
        avg_rating: Number(d.avg_rating ?? 0),
        review_count: d.review_count != null ? Number(d.review_count) : undefined,
      };
    })
    .filter((p) => p.month);
}

function parseTrends(data: unknown): HostsReputationTrends | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const categoryRaw = (d.category_trends as Record<string, unknown>) ?? {};
  const category_trends: Record<string, HostsReputationTrendPoint[]> = {};
  for (const [k, v] of Object.entries(categoryRaw)) {
    category_trends[k] = parseTrendPoints(v);
  }
  return {
    rating_trends: parseTrendPoints(d.rating_trends),
    category_trends,
    property_comparisons: asArray<unknown>(d.property_comparisons)
      .map((row) => {
        const r = row as Record<string, unknown>;
        if (!r.property_id) return null;
        return {
          property_id: String(r.property_id),
          property: typeof r.property === "string" ? r.property : "",
          avg_rating: Number(r.avg_rating ?? 0),
          review_count: Number(r.review_count ?? 0),
          reputation_status: typeof r.reputation_status === "string" ? r.reputation_status : "",
        } satisfies HostsPropertyComparison;
      })
      .filter((r): r is HostsPropertyComparison => r !== null),
    monthly_performance: parseTrendPoints(d.monthly_performance),
  };
}

function parseStats(data: unknown): HostsReputationStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    average_rating: Number(d.average_rating ?? 0),
    properties_requiring_attention: Number(d.properties_requiring_attention ?? 0),
    top_performing_properties: asArray<{
      property_id: string;
      property: string;
      avg_rating: number;
      review_count: number;
    }>(d.top_performing_properties),
    open_recovery_cases: Number(d.open_recovery_cases ?? 0),
    new_reviews: Number(d.new_reviews ?? 0),
    action_required_reviews: Number(d.action_required_reviews ?? 0),
  };
}

function parseOpportunities(data: unknown): HostsImprovementOpportunity[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.type) return null;
      return {
        type: String(d.type),
        category: typeof d.category === "string" ? d.category : undefined,
        property_id: d.property_id != null ? String(d.property_id) : undefined,
        property: typeof d.property === "string" ? d.property : undefined,
        label: typeof d.label === "string" ? d.label : String(d.type),
        severity: typeof d.severity === "string" ? d.severity : "medium",
        avg_rating: d.avg_rating != null ? Number(d.avg_rating) : undefined,
        current_avg: d.current_avg != null ? Number(d.current_avg) : undefined,
        prior_avg: d.prior_avg != null ? Number(d.prior_avg) : undefined,
      };
    })
    .filter((r): r is HostsImprovementOpportunity => r !== null);
}

export function parseAipifyHostsReputationCenterDashboard(
  data: unknown,
): HostsReputationCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: typeof d.package_key === "string" ? d.package_key : "",
    active_section: typeof d.active_section === "string" ? d.active_section : "review_overview",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    review_statuses: asArray<string>(d.review_statuses),
    review_categories: asArray<string>(d.review_categories),
    stats: parseStats(d.stats),
    properties: asArray<{ id: string; display_name: string }>(d.properties),
    reviews: parseReviews(d.reviews),
    trends: parseTrends(d.trends),
    improvement_opportunities: parseOpportunities(d.improvement_opportunities),
    recovery_cases: parseRecoveryCases(d.recovery_cases),
  };
}

export function parseAipifyHostsReputationCenterActionResult(
  data: unknown,
): HostsReputationCenterActionResult {
  if (!data || typeof data !== "object") return { success: false };
  const d = data as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    action_type: typeof d.action_type === "string" ? d.action_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}
