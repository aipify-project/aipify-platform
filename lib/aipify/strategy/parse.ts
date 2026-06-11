import type {
  OpportunityDetail,
  RecommendationActionResult,
  StrategicCard,
  StrategicDashboard,
} from "./types";

export function parseStrategicCard(data: unknown): StrategicCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    overall_score: d.overall_score as number | undefined,
    health_band: d.health_band as string | undefined,
    open_opportunities: d.open_opportunities as number | undefined,
    open_risks: d.open_risks as number | undefined,
    philosophy: d.philosophy as string | undefined,
    human_leadership_required: d.human_leadership_required as boolean | undefined,
  };
}

export function parseStrategicDashboard(data: unknown): StrategicDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_leadership_required: d.human_leadership_required as boolean | undefined,
    recommendations_enabled: d.recommendations_enabled as boolean | undefined,
    overall_score: d.overall_score as number | undefined,
    health_band: d.health_band as string | undefined,
    score_components: d.score_components as StrategicDashboard["score_components"],
    opportunities: Array.isArray(d.opportunities) ? (d.opportunities as StrategicDashboard["opportunities"]) : [],
    risks: Array.isArray(d.risks) ? (d.risks as StrategicDashboard["risks"]) : [],
    recommendations: Array.isArray(d.recommendations) ? (d.recommendations as StrategicDashboard["recommendations"]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as StrategicDashboard["briefings"]) : [],
    horizons: d.horizons as StrategicDashboard["horizons"],
    trends: d.trends as Record<string, number> | undefined,
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseOpportunityDetail(data: unknown): OpportunityDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (d.error || !d.opportunity) return null;
  return {
    opportunity: d.opportunity as OpportunityDetail["opportunity"],
    recommendations: Array.isArray(d.recommendations) ? (d.recommendations as OpportunityDetail["recommendations"]) : [],
    human_leadership_required: d.human_leadership_required as boolean | undefined,
  };
}

export function parseRecommendationActionResult(data: unknown): RecommendationActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    status: d.status as string | undefined,
    human_leadership_required: d.human_leadership_required as boolean | undefined,
    note: d.note as string | undefined,
    error: d.error as string | undefined,
  };
}
