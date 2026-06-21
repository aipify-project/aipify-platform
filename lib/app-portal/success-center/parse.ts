import {
  mapHealthScoreToHealthState,
  type HealthState,
} from "@/lib/design/semantic-status-system";
import type {
  LegacyHealthStatus,
  RiskLevel,
  SuccessCenterResponse,
  SuccessMetrics,
  SuccessRecommendationsResponse,
} from "./types";
import { dedupeTimelineEvents } from "./presentation";

const LEGACY_HEALTH: Set<LegacyHealthStatus> = new Set([
  "excellent",
  "healthy",
  "attention_needed",
  "at_risk",
]);
const RISK: Set<RiskLevel> = new Set(["low", "moderate", "elevated", "high"]);
const HEALTH_STATES: Set<HealthState> = new Set([
  "healthy",
  "good",
  "moderate",
  "poor",
  "critical_health",
  "unknown",
]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fb;
}

function parseHealthState(v: unknown, score: number): HealthState {
  const key = str(v, "").toLowerCase().replace(/-/g, "_") as HealthState;
  if (HEALTH_STATES.has(key)) return key;
  return mapHealthScoreToHealthState(score);
}

function parseMetrics(raw: unknown): SuccessMetrics | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const m = raw as Record<string, unknown>;
  return {
    team_count: num(m.team_count),
    active_users: num(m.active_users),
    business_packs: num(m.business_packs),
    active_capabilities: num(m.active_capabilities),
    integrations: num(m.integrations),
    operations_activity: num(m.operations_activity),
  };
}

export function parseSuccessCenter(data: unknown): SuccessCenterResponse {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const ov = (d.overview ?? {}) as Record<string, unknown>;
  const score = num(ov.customer_health_score);
  const hs = str(ov.health_status, "healthy") as LegacyHealthStatus;
  const rl = str(ov.risk_level, "moderate") as RiskLevel;

  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((t) => {
        const row = t as Record<string, unknown>;
        return {
          id: str(row.id),
          type: str(row.type),
          title: str(row.title),
          description: str(row.description),
          occurred_at: str(row.occurred_at),
          status: str(row.status) || undefined,
          href: str(row.href) || undefined,
        };
      })
    : [];

  return {
    found: d.found === true,
    has_activity: d.has_activity === true,
    organization_name: str(d.organization_name) || undefined,
    metrics: parseMetrics(d.metrics),
    overview: {
      customer_health_score: score,
      adoption_score: num(ov.adoption_score),
      team_engagement_score: num(ov.team_engagement_score),
      feature_utilization_score: num(ov.feature_utilization_score),
      health_status: LEGACY_HEALTH.has(hs) ? hs : "healthy",
      health_state: parseHealthState(ov.health_state, score),
      risk_level: RISK.has(rl) ? rl : "moderate",
      explanation: str(ov.explanation) || undefined,
      last_updated_at: str(ov.last_updated_at) || undefined,
    },
    health_factors: Array.isArray(d.health_factors)
      ? d.health_factors.map((f) => {
          const row = f as Record<string, unknown>;
          const impact = str(row.impact) as "positive" | "neutral" | "negative" | "";
          return {
            key: str(row.key),
            value: num(row.value),
            weight: str(row.weight),
            impact: impact === "positive" || impact === "negative" ? impact : "neutral",
            action_href: str(row.action_href) || undefined,
          };
        })
      : [],
    recommendations: Array.isArray(d.recommendations)
      ? d.recommendations.map((r) => {
          const row = r as Record<string, unknown>;
          const status = str(row.status) as "open" | "completed" | "in_progress" | "";
          return {
            id: str(row.id),
            key: str(row.key),
            priority: str(row.priority, "medium"),
            module: str(row.module) || undefined,
            status:
              status === "completed" || status === "in_progress" || status === "open"
                ? status
                : "open",
          };
        })
      : [],
    timeline: dedupeTimelineEvents(timeline),
    growth_opportunities: Array.isArray(d.growth_opportunities)
      ? d.growth_opportunities.map((g) => {
          const row = g as Record<string, unknown>;
          return {
            key: str(row.key),
            available: row.available === true,
            title_key: str(row.title_key) || undefined,
            description_key: str(row.description_key) || undefined,
          };
        })
      : [],
    adoption_insights: Array.isArray(d.adoption_insights)
      ? d.adoption_insights.map((a) => {
          const row = a as Record<string, unknown>;
          return {
            key: str(row.key),
            label_key: str(row.label_key),
            value: num(row.value),
            unit: str(row.unit) === "score" ? "score" : "count",
          };
        })
      : [],
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
          return {
            id: str(row.id),
            key: str(row.key),
            priority: str(row.priority),
            module: str(row.module) || undefined,
          };
        })
      : [],
  };
}
