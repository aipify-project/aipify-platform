import {
  COMPANY_SIZES,
  CUSTOMER_SEGMENTS,
  DROP_OFF_TYPES,
  INDUSTRIES,
  JOURNEY_STAGES,
  PLAN_TYPES,
  RECOMMENDATION_TYPES,
  TRENDS,
} from "./constants";
import type {
  CompanySize,
  CustomerSegment,
  DropOffType,
  Industry,
  JourneyStage,
  JourneyTrend,
  PlanType,
  RecommendationType,
} from "./constants";
import type {
  CommonPath,
  CustomerJourneyAnalytics,
  DropOffCase,
  FunnelStep,
  JourneyAnalyticsFilters,
  JourneyAuditEntry,
  JourneyCustomerRow,
  JourneyOverview,
  JourneyRecommendation,
  JourneyStageMeta,
  JourneyTimelineEvent,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(value: unknown): boolean {
  return value === true;
}

function parseStage(value: unknown): JourneyStage {
  const stage = asString(value, "registration");
  return (JOURNEY_STAGES.includes(stage as JourneyStage) ? stage : "registration") as JourneyStage;
}

function parseOverview(raw: unknown): JourneyOverview {
  const row = asRecord(raw) ?? {};
  return {
    new_registrations: asNumber(row.new_registrations),
    onboarding_completion_rate: asNumber(row.onboarding_completion_rate),
    trial_conversion_rate: asNumber(row.trial_conversion_rate),
    time_to_first_value_days: asNumber(row.time_to_first_value_days, 7.5),
    expansion_rate: asNumber(row.expansion_rate),
    drop_off_rate: asNumber(row.drop_off_rate),
  };
}

function parseFunnelStep(raw: unknown): FunnelStep | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    from_stage: parseStage(row.from_stage),
    to_stage: parseStage(row.to_stage),
    entered: asNumber(row.entered),
    converted: asNumber(row.converted),
    conversion_rate: asNumber(row.conversion_rate),
  };
}

function parseDropOff(raw: unknown): DropOffCase | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const type = asString(row.drop_off_type, "registration_abandoned");
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    drop_off_type: (DROP_OFF_TYPES.includes(type as DropOffType)
      ? type
      : "registration_abandoned") as DropOffType,
    stage: asString(row.stage),
    message: asString(row.message),
    created_at: asString(row.created_at),
  };
}

function parseJourneyRow(raw: unknown): JourneyCustomerRow | null {
  const row = asRecord(raw);
  if (!row || !row.customer_id) return null;
  const trend = asString(row.trend, "stable");
  const size = asString(row.company_size, "small");
  const segment = asString(row.customer_segment, "smb");
  return {
    customer_id: asString(row.customer_id),
    company: asString(row.company),
    current_stage: parseStage(row.current_stage),
    trend: (TRENDS.includes(trend as JourneyTrend) ? trend : "stable") as JourneyTrend,
    last_activity: row.last_activity ? asString(row.last_activity) : null,
    subscription_plan: asString(row.subscription_plan),
    country: asString(row.country, "NO"),
    industry: asString(row.industry, "general"),
    company_size: (COMPANY_SIZES.includes(size as CompanySize) ? size : "small") as CompanySize,
    customer_segment: (CUSTOMER_SEGMENTS.includes(segment as CustomerSegment)
      ? segment
      : "smb") as CustomerSegment,
    milestones_completed: asNumber(row.milestones_completed),
    time_to_first_value_days:
      row.time_to_first_value_days == null ? null : asNumber(row.time_to_first_value_days),
  };
}

function parseTimeline(raw: unknown): JourneyTimelineEvent | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    customer_id: row.customer_id ? asString(row.customer_id) : null,
    customer: row.customer ? asString(row.customer) : undefined,
    stage: parseStage(row.stage),
    completed_at: asString(row.completed_at),
    delay_days: asNumber(row.delay_days),
    support_interaction: asBool(row.support_interaction),
  };
}

function parseCommonPath(raw: unknown): CommonPath | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    path_key: asString(row.path_key),
    path_label: asString(row.path_label),
    conversion_rate: asNumber(row.conversion_rate),
    customer_count: asNumber(row.customer_count),
    is_success_path: asBool(row.is_success_path),
    abandonment_point: row.abandonment_point ? asString(row.abandonment_point) : null,
  };
}

function parseRecommendation(raw: unknown): JourneyRecommendation | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const type = asString(row.recommendation_type, "simplify_onboarding");
  return {
    id: asString(row.id),
    recommendation_type: (RECOMMENDATION_TYPES.includes(type as RecommendationType)
      ? type
      : "simplify_onboarding") as RecommendationType,
    title: asString(row.title),
    summary: asString(row.summary),
    target_stage: row.target_stage ? asString(row.target_stage) : null,
    impact_score: asNumber(row.impact_score, 50),
    status: asString(row.status, "open"),
  };
}

function parseAudit(raw: unknown): JourneyAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    customer_id: row.customer_id ? asString(row.customer_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseStageMeta(raw: unknown): JourneyStageMeta | null {
  const row = asRecord(raw);
  if (!row || !row.key) return null;
  return { key: asString(row.key), label: asString(row.label) };
}

function parseArray<T>(raw: unknown, parser: (item: unknown) => T | null): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser).filter((item): item is T => item != null);
}

export function buildJourneyFilterQuery(filters: JourneyAnalyticsFilters): string {
  const params = new URLSearchParams();
  if (filters.country) params.set("country", filters.country);
  if (filters.industry) params.set("industry", filters.industry);
  if (filters.company_size) params.set("company_size", filters.company_size);
  if (filters.plan) params.set("plan", filters.plan);
  if (filters.customer_segment) params.set("customer_segment", filters.customer_segment);
  if (filters.customer_id) params.set("customer_id", filters.customer_id);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function parseCustomerJourneyAnalytics(raw: unknown): CustomerJourneyAnalytics | null {
  const row = asRecord(raw);
  if (!row || !row.overview) return null;

  const filters = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "Understanding where customers struggle is the first step toward creating extraordinary customer experiences."
    ),
    privacy_note: asString(
      row.privacy_note,
      "Journey analytics exist to improve customer outcomes — never for advertising or third-party sale."
    ),
    filters: {
      country: filters.country ? asString(filters.country) : undefined,
      industry: filters.industry
        ? (INDUSTRIES.includes(asString(filters.industry) as Industry)
            ? (asString(filters.industry) as Industry)
            : undefined)
        : undefined,
      company_size: filters.company_size
        ? (COMPANY_SIZES.includes(asString(filters.company_size) as CompanySize)
            ? (asString(filters.company_size) as CompanySize)
            : undefined)
        : undefined,
      plan: filters.plan
        ? (PLAN_TYPES.includes(asString(filters.plan) as PlanType)
            ? (asString(filters.plan) as PlanType)
            : undefined)
        : undefined,
      customer_segment: filters.customer_segment
        ? (CUSTOMER_SEGMENTS.includes(asString(filters.customer_segment) as CustomerSegment)
            ? (asString(filters.customer_segment) as CustomerSegment)
            : undefined)
        : undefined,
      customer_id: filters.customer_id ? asString(filters.customer_id) : undefined,
    },
    journey_stages: parseArray(row.journey_stages, parseStageMeta),
    overview: parseOverview(row.overview),
    funnel: parseArray(row.funnel, parseFunnelStep),
    drop_offs: parseArray(row.drop_offs, parseDropOff),
    journeys: parseArray(row.journeys, parseJourneyRow),
    timeline: parseArray(row.timeline, parseTimeline),
    common_paths: parseArray(row.common_paths, parseCommonPath),
    recommendations: parseArray(row.recommendations, parseRecommendation),
    audit: parseArray(row.audit, parseAudit),
  };
}
