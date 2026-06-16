import type {
  CustomerSuccessAdoptionInsights,
  CategoryScores,
  CustomerSuccessOverview,
  SuccessMilestone,
  CustomerSuccessRecommendation,
  CustomerSuccessStatus,
  TimelineEvent,
} from "./types";
import { CUSTOMER_SUCCESS_STATUSES } from "./types";

const STATUSES = new Set<CustomerSuccessStatus>(CUSTOMER_SUCCESS_STATUSES);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseRecommendations(raw: unknown): CustomerSuccessRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), priority: str(d.priority), category: str(d.category) };
  });
}

function parseMilestones(raw: unknown): SuccessMilestone[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { key: str(d.key), title: str(d.title), achieved_at: str(d.achieved_at), auto_detected: d.auto_detected === true };
  });
}

function parseCategoryScores(raw: unknown): CategoryScores | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    learning_completion: num(d.learning_completion),
    feature_adoption: num(d.feature_adoption),
    user_engagement: num(d.user_engagement),
    operational_maturity: num(d.operational_maturity),
    security_completion: num(d.security_completion),
    integration_usage: num(d.integration_usage),
  };
}

function parseInsights(raw: unknown): CustomerSuccessAdoptionInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    features_frequently_used: parseStringArray(d.features_frequently_used),
    features_rarely_used: parseStringArray(d.features_rarely_used),
    teams_high_engagement: parseStringArray(d.teams_high_engagement),
    teams_requiring_support: parseStringArray(d.teams_requiring_support),
    training_opportunities: parseStringArray(d.training_opportunities),
    security_recommendations: parseStringArray(d.security_recommendations),
  };
}

function parseTimeline(raw: unknown): TimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), event_type: str(d.event_type), description: str(d.description), created_at: str(d.created_at) };
  });
}

export function parseCustomerSuccessOverview(data: unknown): CustomerSuccessOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const status = str(d.success_status, "getting_started") as CustomerSuccessStatus;
  const maturity = d.maturity as Record<string, unknown> | undefined;
  const personal = d.personal_progress as Record<string, unknown> | undefined;
  const team = d.team_reporting as Record<string, unknown> | null | undefined;

  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    can_admin: d.can_admin === true,
    journey_started: d.journey_started === true,
    adoption_score: num(d.adoption_score),
    utilization_score: num(d.utilization_score),
    success_status: STATUSES.has(status) ? status : "getting_started",
    maturity: maturity ? { stage: num(maturity.stage), key: str(maturity.key) } : undefined,
    category_scores: parseCategoryScores(d.category_scores),
    milestones_achieved: parseMilestones(d.milestones_achieved),
    recently_improved: Array.isArray(d.recently_improved)
      ? d.recently_improved.map((i) => { const row = i as Record<string, unknown>; return { id: str(row.id), text: str(row.text) }; })
      : [],
    areas_requiring_attention: Array.isArray(d.areas_requiring_attention)
      ? d.areas_requiring_attention.map((i) => { const row = i as Record<string, unknown>; return { id: str(row.id), text: str(row.text) }; })
      : [],
    upcoming_opportunities: parseRecommendations(d.upcoming_opportunities),
    recommendations: parseRecommendations(d.recommendations),
    timeline: parseTimeline(d.timeline),
    adoption_insights: parseInsights(d.adoption_insights),
    personal_progress: personal ? { courses_completed: num(personal.courses_completed), certifications: num(personal.certifications) } : undefined,
    team_reporting: team
      ? { team_count: str(team.team_count), two_fa_adoption_percent: num(team.two_fa_adoption_percent), learning_completions: str(team.learning_completions) }
      : team === null ? null : undefined,
    principle: str(d.principle),
  };
}

export function parseCustomerSuccessMilestones(data: unknown): SuccessMilestone[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseMilestones(d.milestones);
}

export function parseCustomerSuccessRecommendations(data: unknown): CustomerSuccessRecommendation[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseRecommendations(d.recommendations);
}

export function parseCustomerSuccessAdoption(data: unknown): {
  found: boolean;
  category_scores?: CategoryScores;
  adoption_insights?: CustomerSuccessAdoptionInsights;
} {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    category_scores: parseCategoryScores(d.category_scores),
    adoption_insights: parseInsights(d.adoption_insights),
  };
}
