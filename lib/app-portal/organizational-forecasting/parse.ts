import type {
  CapacityAssessment,
  ForecastActionResult,
  ForecastCard,
  ForecastDetail,
  ForecastReview,
  ForecastTimelineEvent,
  OrgForecastingOverview,
  TrendItem,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown): number | undefined { return typeof v === "number" ? v : undefined; }
function bool(v: unknown): boolean { return v === true; }
function strArr(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseCard(raw: unknown): ForecastCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  if (!str(d.id)) return undefined;
  return {
    id: str(d.id),
    forecast_key: str(d.forecast_key),
    title: str(d.title),
    description: str(d.description),
    category: str(d.category),
    forecast_area: str(d.forecast_area),
    current_state: str(d.current_state),
    projected_state_conservative: str(d.projected_state_conservative),
    projected_state_expected: str(d.projected_state_expected),
    projected_state_optimistic: str(d.projected_state_optimistic),
    confidence_level: str(d.confidence_level),
    time_horizon: str(d.time_horizon),
    trend_direction: str(d.trend_direction),
    review_status: str(d.review_status),
    leadership_owner: str(d.leadership_owner),
    recommended_action: str(d.recommended_action),
    last_reviewed_at: str(d.last_reviewed_at) || null,
    updated_at: str(d.updated_at) || undefined,
  };
}

function parseTrends(raw: unknown): TrendItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return { id: str(d.id), title: str(d.title), category: str(d.category) || undefined };
  });
}

function parseCapacity(raw: unknown): CapacityAssessment[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      area: str(d.area),
      current_capacity: str(d.current_capacity),
      estimated_future_capacity: str(d.estimated_future_capacity),
      potential_bottlenecks: strArr(d.potential_bottlenecks),
      operational_constraints: strArr(d.operational_constraints),
      requires_attention: bool(d.requires_attention),
    };
  });
}

function parseReviews(raw: unknown): ForecastReview[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return { id: str(d.id), review_notes: str(d.review_notes),
      reviewed_at: str(d.reviewed_at) || undefined };
  });
}

function parseTimeline(raw: unknown): ForecastTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return { id: str(d.id), forecast_id: str(d.forecast_id) || undefined,
      event_type: str(d.event_type), description: str(d.description),
      created_at: str(d.created_at) };
  });
}

export function parseOrgForecastingOverview(data: unknown): OrgForecastingOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    can_full: bool(d.can_full),
    can_view: bool(d.can_view),
    can_review: bool(d.can_review),
    has_forecast_data: bool(d.has_forecast_data),
    organizational_forecast_score: num(d.organizational_forecast_score),
    executive_summary: str(d.executive_summary),
    growth_forecast: parseCard(d.growth_forecast),
    capacity_forecast: parseCard(d.capacity_forecast),
    workforce_forecast: parseCard(d.workforce_forecast),
    customer_forecast: parseCard(d.customer_forecast),
    revenue_forecast: parseCard(d.revenue_forecast),
    support_forecast: parseCard(d.support_forecast),
    improving_trends: parseTrends(d.improving_trends),
    stable_trends: parseTrends(d.stable_trends),
    declining_trends: parseTrends(d.declining_trends),
    emerging_trends: parseTrends(d.emerging_trends),
    capacity_assessments: parseCapacity(d.capacity_assessments),
    forecasts: Array.isArray(d.forecasts)
      ? d.forecasts.map((x) => parseCard(x)).filter(Boolean) as ForecastCard[]
      : [],
    advisory_note: str(d.advisory_note),
    principle: str(d.principle),
  };
}

export function parseForecastDetail(data: unknown): ForecastDetail {
  if (!data || typeof data !== "object") {
    return { found: false, id: "", forecast_key: "", title: "", description: "",
      category: "", forecast_area: "", current_state: "",
      projected_state_conservative: "", projected_state_expected: "",
      projected_state_optimistic: "", confidence_level: "moderate",
      time_horizon: "12_months", trend_direction: "stable",
      review_status: "pending", leadership_owner: "", recommended_action: "" };
  }
  const d = data as Record<string, unknown>;
  const card = parseCard(d);
  return {
    found: bool(d.found),
    ...(card ?? {
      id: str(d.id), forecast_key: str(d.forecast_key), title: str(d.title),
      description: str(d.description), category: str(d.category),
      forecast_area: str(d.forecast_area), current_state: str(d.current_state),
      projected_state_conservative: str(d.projected_state_conservative),
      projected_state_expected: str(d.projected_state_expected),
      projected_state_optimistic: str(d.projected_state_optimistic),
      confidence_level: str(d.confidence_level), time_horizon: str(d.time_horizon),
      trend_direction: str(d.trend_direction), review_status: str(d.review_status),
      leadership_owner: str(d.leadership_owner), recommended_action: str(d.recommended_action),
    }),
    can_review: bool(d.can_review),
    reviews: parseReviews(d.reviews),
    advisory_note: str(d.advisory_note),
  };
}

export function parseForecastTimeline(data: unknown): ForecastTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  return parseTimeline((data as Record<string, unknown>).events);
}

export function parseForecastActionResult(data: unknown): ForecastActionResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return { found: bool(d.found), message: str(d.message) || undefined,
    review_id: str(d.review_id) || undefined };
}
