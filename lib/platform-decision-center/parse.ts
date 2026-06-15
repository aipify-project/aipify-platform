import {
  IMPACT_LEVELS,
  RECOMMENDATION_CATEGORIES,
  RECOMMENDATION_STATUSES,
} from "./constants";
import type {
  ImpactLevel,
  RecommendationCategory,
  RecommendationStatus,
} from "./constants";
import type {
  DecisionAuditEntry,
  DecisionFilters,
  DecisionOverview,
  DecisionRecommendation,
  DecisionTask,
  PlatformDecisionCenter,
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

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseActions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => asString(item)).filter(Boolean);
}

function parseOverview(raw: unknown): DecisionOverview {
  const row = asRecord(raw) ?? {};
  return {
    recommendations_generated: asNumber(row.recommendations_generated),
    recommendations_accepted: asNumber(row.recommendations_accepted),
    recommendations_declined: asNumber(row.recommendations_declined),
    high_impact_opportunities: asNumber(row.high_impact_opportunities),
    risks_identified: asNumber(row.risks_identified),
    pending_reviews: asNumber(row.pending_reviews),
  };
}

function parseTask(raw: unknown): DecisionTask | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    owner: asString(row.owner),
    status: asString(row.status),
    created_at: asString(row.created_at),
  };
}

function parseRecommendation(raw: unknown): DecisionRecommendation | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    description: asString(row.description),
    category: parseEnum(row.category, RECOMMENDATION_CATEGORIES, "operational_efficiency"),
    impact_level: parseEnum(row.impact_level, IMPACT_LEVELS, "medium"),
    confidence_score: asNumber(row.confidence_score, 70),
    status: parseEnum(row.status, RECOMMENDATION_STATUSES, "new"),
    recommended_actions: parseActions(row.recommended_actions),
    owner: asString(row.owner),
    note: asString(row.note),
    roadmap_link: asString(row.roadmap_link),
    generated_at: asString(row.generated_at),
    updated_at: asString(row.updated_at),
    tasks: Array.isArray(row.tasks)
      ? row.tasks.map(parseTask).filter((t): t is DecisionTask => t != null)
      : [],
  };
}

function parseAudit(raw: unknown): DecisionAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    recommendation_id: row.recommendation_id ? asString(row.recommendation_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseArray<T>(raw: unknown, parser: (item: unknown) => T | null): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser).filter((item): item is T => item != null);
}

export function buildDecisionFilterQuery(filters: DecisionFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.impact_level) params.set("impact_level", filters.impact_level);
  if (filters.status) params.set("status", filters.status);
  if (filters.owner) params.set("owner", filters.owner);
  if (filters.confidence_min !== "" && filters.confidence_min != null) {
    params.set("confidence_min", String(filters.confidence_min));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function parsePlatformDecisionCenter(raw: unknown): PlatformDecisionCenter | null {
  const row = asRecord(raw);
  if (!row || !row.overview) return null;
  const filters = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "Information alone is not enough. The true value of intelligence lies in helping people make better decisions at the right time."
    ),
    executive_summary: asString(
      row.executive_summary,
      "Based on current data, Aipify has identified the following opportunities and risks."
    ),
    filters: {
      category: filters.category
        ? parseEnum(filters.category, RECOMMENDATION_CATEGORIES, "operational_efficiency")
        : undefined,
      impact_level: filters.impact_level
        ? parseEnum(filters.impact_level, IMPACT_LEVELS, "medium")
        : undefined,
      status: filters.status
        ? parseEnum(filters.status, RECOMMENDATION_STATUSES, "new")
        : undefined,
      owner: filters.owner ? asString(filters.owner) : undefined,
      confidence_min: filters.confidence_min != null ? asNumber(filters.confidence_min) : undefined,
    },
    overview: parseOverview(row.overview),
    recommendations: parseArray(row.recommendations, parseRecommendation),
    high_impact: parseArray(row.high_impact, parseRecommendation),
    risks: parseArray(row.risks, parseRecommendation),
    audit: parseArray(row.audit, parseAudit),
  };
}
