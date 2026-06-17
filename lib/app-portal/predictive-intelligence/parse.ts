import type {
  EarlyWarning,
  OutcomeReview,
  PredictiveDetail,
  PredictiveOverview,
  PredictiveRecommendation,
  PredictiveReviewResult,
  PredictiveTimelineEvent,
  PredictionCard,
  PredictionInsightItem,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseRecommendations(raw: unknown): PredictiveRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key) };
  });
}

function parseInsightItems(raw: unknown): PredictionInsightItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), title: str(d.title) };
  });
}

function parsePredictionCard(raw: unknown): PredictionCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id),
    prediction_key: str(d.prediction_key),
    title: str(d.title),
    category: str(d.category),
    summary: str(d.summary),
    confidence_level: str(d.confidence_level),
    time_horizon: str(d.time_horizon),
    potential_impact: str(d.potential_impact),
    organizational_area: str(d.organizational_area),
    review_status: str(d.review_status),
    recommended_actions: parseStringArray(d.recommended_actions),
    related_areas: parseStringArray(d.related_areas),
    last_reviewed_at: str(d.last_reviewed_at) || null,
    generated_at: str(d.generated_at) || undefined,
  };
}

function parseEarlyWarnings(raw: unknown): EarlyWarning[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      warning_key: str(d.warning_key),
      title: str(d.title),
      signal_type: str(d.signal_type),
      description: str(d.description),
      severity: str(d.severity),
      organizational_area: str(d.organizational_area),
    };
  });
}

function parseTimeline(raw: unknown): PredictiveTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      prediction_id: str(d.prediction_id) || undefined,
      event_type: str(d.event_type),
      description: str(d.description),
      created_at: str(d.created_at),
    };
  });
}

export function parsePredictiveOverview(data: unknown): PredictiveOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_view: d.can_view === true,
    can_generate: d.can_generate === true,
    can_review: d.can_review === true,
    has_predictive_data: d.has_predictive_data === true,
    forecast_summary: str(d.forecast_summary),
    executive_summary: str(d.executive_summary),
    emerging_opportunities: parseInsightItems(d.emerging_opportunities),
    emerging_risks: parseInsightItems(d.emerging_risks),
    areas_requiring_attention: parseInsightItems(d.areas_requiring_attention),
    predictive_confidence_note: str(d.predictive_confidence_note),
    predictions: Array.isArray(d.predictions)
      ? d.predictions.map((x) => parsePredictionCard(x)).filter(Boolean) as PredictionCard[]
      : [],
    early_warnings: parseEarlyWarnings(d.early_warnings),
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parsePredictiveDetail(data: unknown): PredictiveDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", prediction_key: "", title: "", category: "",
      summary: "", confidence_level: "exploratory", time_horizon: "next_quarter",
      potential_impact: "moderate", organizational_area: "", review_status: "pending",
    };
  }
  const d = data as Record<string, unknown>;
  const card = parsePredictionCard(d);
  const reviews = Array.isArray(d.outcome_reviews)
    ? d.outcome_reviews.map((item) => {
        const r = item as Record<string, unknown>;
        return {
          id: str(r.id),
          outcome: str(r.outcome),
          review_notes: str(r.review_notes),
          reviewed_at: str(r.reviewed_at) || undefined,
        } satisfies OutcomeReview;
      })
    : [];
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.id), prediction_key: str(d.prediction_key), title: str(d.title),
      category: str(d.category), summary: str(d.summary),
      confidence_level: str(d.confidence_level), time_horizon: str(d.time_horizon),
      potential_impact: str(d.potential_impact), organizational_area: str(d.organizational_area),
      review_status: str(d.review_status),
    }),
    can_review: d.can_review === true,
    outcome_reviews: reviews,
    probability_note: str(d.probability_note),
  };
}

export function parsePredictiveTimeline(data: unknown): PredictiveTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}

export function parsePredictiveReviewResult(data: unknown): PredictiveReviewResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    review_id: str(d.review_id) || undefined,
    prediction_id: str(d.prediction_id) || undefined,
    outcome: str(d.outcome) || undefined,
    message: str(d.message) || undefined,
  };
}
