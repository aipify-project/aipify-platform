import type {
  OpportunityActionResult,
  OpportunityCard,
  OpportunityDetail,
  OpportunityInsightItem,
  OpportunityRecommendation,
  OpportunityReview,
  OpportunityTimelineEvent,
  StrategicOpportunitiesOverview,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown): number | undefined { return typeof v === "number" ? v : undefined; }
function bool(v: unknown): boolean { return v === true; }

function strArr(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function insightItems(raw: unknown): OpportunityInsightItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => { const d = i as Record<string,unknown>; return { id: str(d.id), title: str(d.title) }; });
}

function parseCard(raw: unknown): OpportunityCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string,unknown>;
  return {
    id: str(d.id),
    opportunity_key: str(d.opportunity_key),
    title: str(d.title),
    description: str(d.description),
    category: str(d.category),
    status: str(d.status),
    strategic_priority: str(d.strategic_priority),
    estimated_impact: str(d.estimated_impact),
    estimated_complexity: str(d.estimated_complexity),
    organizational_readiness: str(d.organizational_readiness),
    cross_department_influence: bool(d.cross_department_influence),
    recommended_review_priority: str(d.recommended_review_priority),
    leadership_owner: str(d.leadership_owner),
    potential_value: str(d.potential_value),
    estimated_effort: str(d.estimated_effort),
    related_departments: strArr(d.related_departments),
    suggested_next_steps: strArr(d.suggested_next_steps),
    time_horizon: str(d.time_horizon),
    last_reviewed_at: str(d.last_reviewed_at) || null,
    updated_at: str(d.updated_at) || undefined,
  };
}

function parseRecommendations(raw: unknown): OpportunityRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => { const d = i as Record<string,unknown>; return { id: str(d.id), key: str(d.key) }; });
}

function parseReviews(raw: unknown): OpportunityReview[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string,unknown>;
    return { id: str(d.id), review_notes: str(d.review_notes),
      new_status: str(d.new_status) || undefined,
      reviewed_at: str(d.reviewed_at) || undefined };
  });
}

function parseTimeline(raw: unknown): OpportunityTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string,unknown>;
    return { id: str(d.id), opportunity_id: str(d.opportunity_id) || undefined,
      event_type: str(d.event_type), description: str(d.description), created_at: str(d.created_at) };
  });
}

export function parseStrategicOpportunitiesOverview(data: unknown): StrategicOpportunitiesOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string,unknown>;
  return {
    found: bool(d.found),
    can_full: bool(d.can_full),
    can_view: bool(d.can_view),
    can_review: bool(d.can_review),
    can_create: bool(d.can_create),
    has_opportunity_data: bool(d.has_opportunity_data),
    opportunity_health_score: num(d.opportunity_health_score),
    executive_summary: str(d.executive_summary),
    high_potential_opportunities: insightItems(d.high_potential_opportunities),
    opportunities_requiring_exploration: insightItems(d.opportunities_requiring_exploration),
    opportunities_under_review: insightItems(d.opportunities_under_review),
    opportunities_in_progress: insightItems(d.opportunities_in_progress),
    opportunities_realized: insightItems(d.opportunities_realized),
    advisory_note: str(d.advisory_note),
    opportunities: Array.isArray(d.opportunities)
      ? d.opportunities.map((x) => parseCard(x)).filter(Boolean) as OpportunityCard[]
      : [],
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseOpportunityDetail(data: unknown): OpportunityDetail {
  if (!data || typeof data !== "object") {
    return { found: false, id: "", opportunity_key: "", title: "", description: "",
      category: "", status: "identified", strategic_priority: "moderate",
      estimated_impact: "moderate", estimated_complexity: "moderate",
      organizational_readiness: "moderate", recommended_review_priority: "normal",
      leadership_owner: "", potential_value: "", estimated_effort: "", time_horizon: "12_months" };
  }
  const d = data as Record<string,unknown>;
  const card = parseCard(d);
  return {
    found: bool(d.found),
    ...(card ?? {
      id: str(d.id), opportunity_key: str(d.opportunity_key), title: str(d.title),
      description: str(d.description), category: str(d.category), status: str(d.status),
      strategic_priority: str(d.strategic_priority), estimated_impact: str(d.estimated_impact),
      estimated_complexity: str(d.estimated_complexity),
      organizational_readiness: str(d.organizational_readiness),
      recommended_review_priority: str(d.recommended_review_priority),
      leadership_owner: str(d.leadership_owner), potential_value: str(d.potential_value),
      estimated_effort: str(d.estimated_effort), time_horizon: str(d.time_horizon),
    }),
    can_review: bool(d.can_review),
    can_create: bool(d.can_create),
    reviews: parseReviews(d.reviews),
    supporting_observations: strArr(d.supporting_observations),
    advisory_note: str(d.advisory_note),
  };
}

export function parseOpportunityTimeline(data: unknown): OpportunityTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  return parseTimeline((data as Record<string,unknown>).events);
}

export function parseOpportunityActionResult(data: unknown): OpportunityActionResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string,unknown>;
  return { found: bool(d.found),
    opportunity_id: str(d.opportunity_id) || undefined,
    message: str(d.message) || undefined };
}
