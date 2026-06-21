import {
  mapHealthScoreToHealthState,
  type HealthState,
} from "@/lib/design/semantic-status-system";
import type { RiskLevel } from "@/lib/app-portal/success-center/types";
import type {
  CustomerHealthDriver,
  CustomerHealthDriverEffect,
  CustomerHealthHistoryEntry,
  CustomerHealthMetrics,
  CustomerHealthNeedsAttentionItem,
  CustomerHealthOperationalSignal,
  CustomerHealthOverviewSection,
  CustomerHealthRecommendedAction,
  CustomerHealthRiskItem,
  CustomerHealthStrength,
  CustomerHealthTrendPoint,
  CustomerHealthTrendState,
  CustomerHealthWorkspaceResponse,
} from "./types";
import { CUSTOMER_HEALTH_TREND_STATES } from "./types";
import { dedupeHealthHistory } from "./presentation";

const TRENDS = new Set<CustomerHealthTrendState>(CUSTOMER_HEALTH_TREND_STATES);
const RISK: Set<RiskLevel> = new Set(["low", "moderate", "elevated", "high"]);
const EFFECTS = new Set<CustomerHealthDriverEffect>([
  "positive",
  "neutral",
  "moderate_negative",
  "strong_negative",
  "critical_negative",
]);
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

function parseMetrics(raw: unknown): CustomerHealthMetrics | undefined {
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

function parseOverview(raw: unknown): CustomerHealthOverviewSection | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const score = num(o.health_score);
  const trend = str(o.trend_state, "insufficient_data") as CustomerHealthTrendState;
  const risk = str(o.risk_level, "moderate") as RiskLevel;
  return {
    health_score: score,
    health_state: parseHealthState(o.health_state, score),
    adoption_score: num(o.adoption_score),
    engagement_score: num(o.engagement_score),
    utilization_score: num(o.utilization_score),
    learning_score: num(o.learning_score),
    risk_level: RISK.has(risk) ? risk : "moderate",
    trend_state: TRENDS.has(trend) ? trend : "insufficient_data",
    score_change: num(o.score_change),
    explanation: str(o.explanation),
    last_calculated_at: str(o.last_calculated_at) || undefined,
  };
}

export function parseCustomerHealthWorkspace(data: unknown): CustomerHealthWorkspaceResponse {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;

  if (d.filtered_out === true) {
    return { found: true, filtered_out: true, has_activity: d.has_activity === true };
  }

  const drivers: CustomerHealthDriver[] = Array.isArray(d.drivers)
    ? d.drivers.map((item) => {
        const row = item as Record<string, unknown>;
        const effect = str(row.effect, "neutral") as CustomerHealthDriverEffect;
        return {
          key: str(row.key),
          score: num(row.score),
          effect: EFFECTS.has(effect) ? effect : "neutral",
        };
      })
    : [];

  const strengths: CustomerHealthStrength[] = Array.isArray(d.strengths)
    ? d.strengths.map((item) => {
        const row = item as Record<string, unknown>;
        return {
          key: str(row.key),
          value: num(row.value),
          impact: str(row.impact, "positive"),
          action_href: str(row.action_href) || undefined,
        };
      })
    : [];

  const needs_attention: CustomerHealthNeedsAttentionItem[] = Array.isArray(d.needs_attention)
    ? d.needs_attention.map((item) => {
        const row = item as Record<string, unknown>;
        return {
          key: str(row.key),
          severity: str(row.severity, "medium"),
          impact: str(row.impact),
          action_href: str(row.action_href) || undefined,
          value: num(row.value),
        };
      })
    : [];

  const trend_points: CustomerHealthTrendPoint[] = Array.isArray(d.trend_points)
    ? d.trend_points.map((item) => {
        const row = item as Record<string, unknown>;
        return {
          recorded_at: str(row.recorded_at),
          score: num(row.score),
          health_state: str(row.health_state) || undefined,
        };
      })
    : [];

  const risks: CustomerHealthRiskItem[] = Array.isArray(d.risks)
    ? d.risks.map((item) => {
        const row = item as Record<string, unknown>;
        return {
          key: str(row.key),
          severity: str(row.severity, "info"),
          description: str(row.description),
          category: str(row.category),
        };
      })
    : [];

  const operational_signals: CustomerHealthOperationalSignal[] = Array.isArray(
    d.operational_signals
  )
    ? d.operational_signals.map((item) => {
        const row = item as Record<string, unknown>;
        return {
          key: str(row.key),
          category: str(row.category),
          description: str(row.description),
          trend: str(row.trend) || undefined,
        };
      })
    : [];

  const historyRaw: CustomerHealthHistoryEntry[] = Array.isArray(d.health_history)
    ? d.health_history.map((item) => {
        const row = item as Record<string, unknown>;
        const scoreVal = row.score;
        return {
          id: str(row.id),
          event_type: str(row.event_type),
          description: str(row.description),
          score: typeof scoreVal === "number" ? scoreVal : undefined,
          recorded_at: str(row.recorded_at),
        };
      })
    : [];

  let recommended_action: CustomerHealthRecommendedAction | null | undefined;
  if (d.recommended_action && typeof d.recommended_action === "object") {
    const row = d.recommended_action as Record<string, unknown>;
    recommended_action = {
      key: str(row.key),
      priority: str(row.priority),
      module: str(row.module) || undefined,
    };
  } else if (d.recommended_action === null) {
    recommended_action = null;
  }

  const trendRaw = str(d.trend_state, "") as CustomerHealthTrendState;

  return {
    found: d.found === true,
    has_activity: d.has_activity === true,
    can_manage: d.can_manage === true,
    can_admin: d.can_admin === true,
    organization_name: str(d.organization_name) || undefined,
    overview: parseOverview(d.overview),
    metrics: parseMetrics(d.metrics),
    recommended_action,
    drivers,
    strengths,
    needs_attention,
    trend_points,
    trend_state: TRENDS.has(trendRaw) ? trendRaw : undefined,
    risks,
    operational_signals,
    health_history: dedupeHealthHistory(historyRaw),
  };
}

/** @deprecated use parseCustomerHealthWorkspace */
export function parseCustomerHealthOverview(data: unknown): CustomerHealthWorkspaceResponse {
  return parseCustomerHealthWorkspace(data);
}

export function parseCustomerHealthTimeline(data: unknown): CustomerHealthHistoryEntry[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.timeline)) return [];
  return dedupeHealthHistory(
    d.timeline.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        id: str(row.id),
        event_type: str(row.event_type),
        description: str(row.description),
        recorded_at: str(row.created_at),
      };
    })
  );
}

export function parseCustomerHealthRecommendations(data: unknown): Array<{
  id: string;
  key: string;
  priority: string;
  category: string;
}> {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.recommendations)) return [];
  return d.recommendations.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      id: str(row.id),
      key: str(row.key),
      priority: str(row.priority),
      category: str(row.module ?? row.category),
    };
  });
}

export function parseCustomerHealthEngagement(data: unknown): {
  found: boolean;
  engagement_score?: number;
} {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const overview = d.overview as Record<string, unknown> | undefined;
  return {
    found: d.found === true,
    engagement_score: num(overview?.engagement_score ?? d.engagement_score),
  };
}
