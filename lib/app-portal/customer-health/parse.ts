import type {
  CustomerHealthEngagementInsights,
  CustomerHealthIndicators,
  CustomerHealthOverview,
  CustomerHealthRecommendation,
  CustomerHealthStatus,
  CustomerHealthSupportInsights,
  CustomerHealthTimelineEvent,
  CustomerHealthTrend,
} from "./types";
import { CUSTOMER_HEALTH_STATUSES, CUSTOMER_HEALTH_TRENDS } from "./types";

const STATUSES = new Set<CustomerHealthStatus>(CUSTOMER_HEALTH_STATUSES);
const TRENDS = new Set<CustomerHealthTrend>(CUSTOMER_HEALTH_TRENDS);

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

function parseRecommendations(raw: unknown): CustomerHealthRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), priority: str(d.priority), category: str(d.category) };
  });
}

function parseIndicators(raw: unknown): CustomerHealthIndicators | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    platform_engagement: num(d.platform_engagement),
    training_participation: num(d.training_participation),
    support_interactions: num(d.support_interactions),
    adoption_progress: num(d.adoption_progress),
    security_completion: num(d.security_completion),
    integration_activity: num(d.integration_activity),
    recommendation_completion: num(d.recommendation_completion),
  };
}

function parseEngagement(raw: unknown): CustomerHealthEngagementInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    active_teams: parseStringArray(d.active_teams),
    departments_requiring_support: parseStringArray(d.departments_requiring_support),
    underutilized_capabilities: parseStringArray(d.underutilized_capabilities),
    positive_momentum: parseStringArray(d.positive_momentum),
    declining_activity: parseStringArray(d.declining_activity),
  };
}

function parseSupport(raw: unknown): CustomerHealthSupportInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    open_requests: num(d.open_requests),
    resolved_requests: num(d.resolved_requests),
    resolution_trend: str(d.resolution_trend),
    satisfaction_indicator: num(d.satisfaction_indicator),
    self_service_sessions: num(d.self_service_sessions),
    knowledge_engagement: num(d.knowledge_engagement),
  };
}

export function parseCustomerHealthOverview(data: unknown): CustomerHealthOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const status = str(d.health_status, "stable") as CustomerHealthStatus;
  const trend = str(d.relationship_trend, "insufficient_data") as CustomerHealthTrend;
  const dept = d.department_reporting as Record<string, unknown> | null | undefined;

  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    can_admin: d.can_admin === true,
    review_started: d.review_started === true,
    overall_health_score: num(d.overall_health_score),
    engagement_score: num(d.engagement_score),
    support_satisfaction_score: num(d.support_satisfaction_score),
    adoption_score: num(d.adoption_score),
    learning_completion_score: num(d.learning_completion_score),
    health_status: STATUSES.has(status) ? status : "stable",
    relationship_trend: TRENDS.has(trend) ? trend : "insufficient_data",
    open_recommendations_count: num(d.open_recommendations_count),
    health_indicators: parseIndicators(d.health_indicators),
    engagement_insights: parseEngagement(d.engagement_insights),
    support_insights: parseSupport(d.support_insights),
    recommendations: parseRecommendations(d.recommendations),
    personal_recommendations: Array.isArray(d.personal_recommendations)
      ? d.personal_recommendations.map((p) => {
          const row = p as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status), due_date: str(row.due_date) || null };
        })
      : [],
    department_reporting: dept
      ? { department: str(dept.department), engagement_score: num(dept.engagement_score), learning_participation: num(dept.learning_participation) }
      : dept === null ? null : undefined,
    principle: str(d.principle),
  };
}

export function parseCustomerHealthTimeline(data: unknown): CustomerHealthTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.timeline)) return [];
  return d.timeline.map((item) => {
    const row = item as Record<string, unknown>;
    return { id: str(row.id), event_type: str(row.event_type), description: str(row.description), created_at: str(row.created_at) };
  });
}

export function parseCustomerHealthRecommendations(data: unknown): CustomerHealthRecommendation[] {
  if (!data || typeof data !== "object") return [];
  return parseRecommendations((data as Record<string, unknown>).recommendations);
}

export function parseCustomerHealthEngagement(data: unknown): {
  found: boolean;
  engagement_score?: number;
  engagement_insights?: CustomerHealthEngagementInsights;
} {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    engagement_score: num(d.engagement_score),
    engagement_insights: parseEngagement(d.engagement_insights),
  };
}
