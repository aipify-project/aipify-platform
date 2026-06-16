import type {
  HealthStatus,
  RiskLevel,
  SuccessCenterResponse,
  SuccessRecommendationsResponse,
} from "./types";

const HEALTH: Set<HealthStatus> = new Set(["excellent", "healthy", "attention_needed", "at_risk"]);
const RISK: Set<RiskLevel> = new Set(["low", "moderate", "elevated", "high"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

export function parseSuccessCenter(data: unknown): SuccessCenterResponse {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const ov = (d.overview ?? {}) as Record<string, unknown>;
  const hs = str(ov.health_status, "healthy") as HealthStatus;
  const rl = str(ov.risk_level, "moderate") as RiskLevel;
  return {
    found: d.found === true,
    has_activity: d.has_activity === true,
    organization_name: str(d.organization_name) || undefined,
    overview: {
      customer_health_score: num(ov.customer_health_score),
      adoption_score: num(ov.adoption_score),
      team_engagement_score: num(ov.team_engagement_score),
      feature_utilization_score: num(ov.feature_utilization_score),
      health_status: HEALTH.has(hs) ? hs : "healthy",
      risk_level: RISK.has(rl) ? rl : "moderate",
    },
    health_factors: Array.isArray(d.health_factors)
      ? d.health_factors.map((f) => {
          const row = f as Record<string, unknown>;
          return { key: str(row.key), value: num(row.value), weight: str(row.weight) };
        })
      : [],
    recommendations: Array.isArray(d.recommendations)
      ? d.recommendations.map((r) => {
          const row = r as Record<string, unknown>;
          return { id: str(row.id), key: str(row.key), priority: str(row.priority), module: str(row.module) || undefined };
        })
      : [],
    timeline: Array.isArray(d.timeline)
      ? d.timeline.map((t) => {
          const row = t as Record<string, unknown>;
          return {
            id: str(row.id),
            type: str(row.type),
            title: str(row.title),
            description: str(row.description),
            occurred_at: str(row.occurred_at),
          };
        })
      : [],
    growth_opportunities: Array.isArray(d.growth_opportunities)
      ? d.growth_opportunities.map((g) => {
          const row = g as Record<string, unknown>;
          return { key: str(row.key), available: row.available === true };
        })
      : [],
    adoption_insights: Array.isArray(d.adoption_insights)
      ? d.adoption_insights.map((a) => {
          const row = a as Record<string, unknown>;
          return { key: str(row.key), label_key: str(row.label_key), value: num(row.value) };
        })
      : [],
    principle: str(d.principle),
  };
}

export function parseSuccessRecommendations(data: unknown): SuccessRecommendationsResponse {
  if (!data || typeof data !== "object") return { found: false, recommendations: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    advisory_only: d.advisory_only === true,
    recommendations: Array.isArray(d.recommendations)
      ? d.recommendations.map((r) => {
          const row = r as Record<string, unknown>;
          return { id: str(row.id), key: str(row.key), priority: str(row.priority), module: str(row.module) || undefined };
        })
      : [],
  };
}
