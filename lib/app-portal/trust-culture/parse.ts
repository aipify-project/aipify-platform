import type {
  CheckInFrequency,
  CultureCheckIn,
  CultureDimension,
  CultureDimensionDetail,
  CultureOverviewResponse,
  CultureRecommendation,
  CultureSnapshot,
  DimensionAggregate,
  CultureTrendDirection,
} from "./types";

const DIMENSIONS = new Set<CultureDimension>([
  "trust", "collaboration", "communication", "recognition", "accountability",
  "inclusion", "psychological_safety", "leadership_confidence",
  "organizational_alignment", "learning_mindset",
]);
const TRENDS = new Set<CultureTrendDirection>(["improving", "stable", "declining", "insufficient_data"]);
const FREQUENCIES = new Set<CheckInFrequency>(["weekly", "monthly", "quarterly", "on_demand"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseDimension(raw: unknown): DimensionAggregate {
  const d = (raw ?? {}) as Record<string, unknown>;
  const dim = str(d.dimension, "trust") as CultureDimension;
  const trend = str(d.trend_direction, "insufficient_data") as CultureTrendDirection;
  return {
    dimension: DIMENSIONS.has(dim) ? dim : "trust",
    score: d.score === null || d.score === undefined ? null : typeof d.score === "number" ? d.score : null,
    response_count: typeof d.response_count === "number" ? d.response_count : 0,
    suppressed: d.suppressed === true,
    trend_direction: TRENDS.has(trend) ? trend : "insufficient_data",
    anonymity_note: str(d.anonymity_note) || undefined,
  };
}

function parseRecs(raw: unknown): CultureRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), dimension: str(row.dimension) || undefined };
  });
}

function parseSnapshot(raw: unknown): CultureSnapshot | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const trend = str(d.trend_direction, "insufficient_data") as CultureTrendDirection;
  return {
    culture_score: typeof d.culture_score === "number" ? d.culture_score : null,
    trust_score: typeof d.trust_score === "number" ? d.trust_score : null,
    participation_rate: typeof d.participation_rate === "number" ? d.participation_rate : 0,
    participation_count: typeof d.participation_count === "number" ? d.participation_count : 0,
    eligible_count: typeof d.eligible_count === "number" ? d.eligible_count : 0,
    trend_direction: TRENDS.has(trend) ? trend : "insufficient_data",
    improvement_momentum: str(d.improvement_momentum, "neutral"),
    areas_requiring_attention: Array.isArray(d.areas_requiring_attention) ? d.areas_requiring_attention.map(parseDimension) : [],
    anonymity_threshold: typeof d.anonymity_threshold === "number" ? d.anonymity_threshold : 5,
  };
}

function parseCheckIns(raw: unknown): CultureCheckIn[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c) => {
    const row = c as Record<string, unknown>;
    const freq = str(row.frequency, "on_demand") as CheckInFrequency;
    return {
      id: str(row.id),
      title: str(row.title),
      frequency: FREQUENCIES.has(freq) ? freq : "on_demand",
      status: str(row.status),
      starts_at: str(row.starts_at) || undefined,
      ends_at: str(row.ends_at) || null,
      questions: Array.isArray(row.questions) ? row.questions as CultureCheckIn["questions"] : undefined,
      voluntary_note: str(row.voluntary_note) || undefined,
      created_at: str(row.created_at) || undefined,
    };
  });
}

export function parseCultureOverview(data: unknown): CultureOverviewResponse {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    snapshot: parseSnapshot(d.snapshot),
    dimensions: Array.isArray(d.dimensions) ? d.dimensions.map(parseDimension) : [],
    check_ins: parseCheckIns(d.check_ins),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
    privacy_note: str(d.privacy_note),
  };
}

export function parseCultureDimensionDetail(data: unknown): CultureDimensionDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  return {
    found: true,
    can_manage: d.can_manage === true,
    dimension: d.dimension ? parseDimension(d.dimension) : undefined,
    historical_trends: Array.isArray(d.historical_trends)
      ? d.historical_trends.map((h) => {
          const row = h as Record<string, unknown>;
          return { period: str(row.period), score: typeof row.score === "number" ? row.score : 0, response_count: typeof row.response_count === "number" ? row.response_count : 0 };
        })
      : [],
    participation_history: Array.isArray(d.participation_history)
      ? d.participation_history.map((p) => {
          const row = p as Record<string, unknown>;
          return { check_in_id: str(row.check_in_id), title: str(row.title), response_count: typeof row.response_count === "number" ? row.response_count : 0 };
        })
      : [],
    strengths: Array.isArray(d.strengths) ? d.strengths.map((s) => { const row = s as Record<string, unknown>; return { id: str(row.id), text: str(row.text) }; }) : [],
    improvement_opportunities: Array.isArray(d.improvement_opportunities) ? d.improvement_opportunities.map((s) => { const row = s as Record<string, unknown>; return { id: str(row.id), text: str(row.text) }; }) : [],
    recommended_actions: parseRecs(d.recommended_actions),
    review_history: Array.isArray(d.review_history)
      ? d.review_history.map((a) => { const row = a as Record<string, unknown>; return { id: str(row.id), event_type: str(row.event_type), description: str(row.description), created_at: str(row.created_at) }; })
      : [],
    privacy_note: str(d.privacy_note),
  };
}

export function parseCultureCheckIn(data: unknown): CultureCheckIn | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const checkIn = d.check_in ?? d;
  const parsed = parseCheckIns([checkIn]);
  return parsed[0] ?? null;
}
