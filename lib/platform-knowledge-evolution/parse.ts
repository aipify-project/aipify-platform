import {
  GAP_TYPES,
  HEALTH_STATUSES,
  KNOWLEDGE_SOURCES,
  LOCALES,
  SUGGESTION_TYPES,
  TRANSLATION_STATUSES,
  WORKFLOW_STATUSES,
} from "./constants";
import type {
  GapType,
  HealthStatus,
  KnowledgeLocale,
  KnowledgeSource,
  SuggestionType,
  TranslationStatus,
  WorkflowStatus,
} from "./constants";
import type {
  AnalyticsEntry,
  ArticleLocalization,
  EvolutionAuditEntry,
  EvolutionFilters,
  EvolutionOverview,
  KnowledgeAnalytics,
  KnowledgeArticle,
  KnowledgeEvolutionCenter,
  KnowledgeGap,
  KnowledgeRecommendation,
  KnowledgeSuggestion,
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

function parseOverview(raw: unknown): EvolutionOverview {
  const row = asRecord(raw) ?? {};
  return {
    knowledge_articles: asNumber(row.knowledge_articles),
    suggested_improvements: asNumber(row.suggested_improvements),
    pending_reviews: asNumber(row.pending_reviews),
    recently_updated: asNumber(row.recently_updated),
    knowledge_gaps: asNumber(row.knowledge_gaps),
    learning_opportunities: asNumber(row.learning_opportunities),
  };
}

function parseLocalization(raw: unknown): ArticleLocalization | null {
  const row = asRecord(raw);
  if (!row || !row.locale) return null;
  return {
    locale: parseEnum(row.locale, LOCALES, "en"),
    translation_status: parseEnum(row.translation_status, TRANSLATION_STATUSES, "pending"),
    updated_at: asString(row.updated_at),
  };
}

function parseArticle(raw: unknown): KnowledgeArticle | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    slug: asString(row.slug),
    source: parseEnum(row.source, KNOWLEDGE_SOURCES, "internal_documentation"),
    workflow_status: parseEnum(row.workflow_status, WORKFLOW_STATUSES, "draft"),
    health_status: parseEnum(row.health_status, HEALTH_STATUSES, "healthy"),
    health_score: asNumber(row.health_score, 70),
    usage_frequency: asNumber(row.usage_frequency),
    helpfulness_rating: asNumber(row.helpfulness_rating),
    resolution_effectiveness: asNumber(row.resolution_effectiveness),
    freshness_score: asNumber(row.freshness_score, 70),
    feedback_sentiment: asNumber(row.feedback_sentiment),
    owner: asString(row.owner),
    summary: asString(row.summary),
    localizations: Array.isArray(row.localizations)
      ? row.localizations.map(parseLocalization).filter((l): l is ArticleLocalization => l != null)
      : [],
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
    published_at: row.published_at ? asString(row.published_at) : null,
  };
}

function parseGap(raw: unknown): KnowledgeGap | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    gap_type: parseEnum(row.gap_type, GAP_TYPES, "missing_documentation"),
    topic: asString(row.topic),
    message: asString(row.message),
    occurrence_count: asNumber(row.occurrence_count, 1),
    created_at: asString(row.created_at),
  };
}

function parseSuggestion(raw: unknown): KnowledgeSuggestion | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    suggestion_type: parseEnum(row.suggestion_type, SUGGESTION_TYPES, "create_article"),
    title: asString(row.title),
    summary: asString(row.summary),
    article_id: row.article_id ? asString(row.article_id) : null,
    status: asString(row.status),
  };
}

function parseRecommendation(raw: unknown): KnowledgeRecommendation | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    recommendation_key: asString(row.recommendation_key),
    message: asString(row.message),
    priority: asString(row.priority, "medium"),
    status: asString(row.status),
  };
}

function parseAnalyticsEntry(raw: unknown): AnalyticsEntry | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    title: row.title ? asString(row.title) : undefined,
    topic: row.topic ? asString(row.topic) : undefined,
    views: row.views != null ? asNumber(row.views) : undefined,
    rating: row.rating != null ? asNumber(row.rating) : undefined,
    count: row.count != null ? asNumber(row.count) : undefined,
  };
}

function parseAnalytics(raw: unknown): KnowledgeAnalytics {
  const row = asRecord(raw) ?? {};
  return {
    most_viewed: Array.isArray(row.most_viewed)
      ? row.most_viewed.map(parseAnalyticsEntry).filter((e): e is AnalyticsEntry => e != null)
      : [],
    highest_rated: Array.isArray(row.highest_rated)
      ? row.highest_rated.map(parseAnalyticsEntry).filter((e): e is AnalyticsEntry => e != null)
      : [],
    lowest_rated: Array.isArray(row.lowest_rated)
      ? row.lowest_rated.map(parseAnalyticsEntry).filter((e): e is AnalyticsEntry => e != null)
      : [],
    most_requested_topics: Array.isArray(row.most_requested_topics)
      ? row.most_requested_topics.map(parseAnalyticsEntry).filter((e): e is AnalyticsEntry => e != null)
      : [],
    resolution_contribution_rate: asNumber(row.resolution_contribution_rate, 68.5),
  };
}

function parseAudit(raw: unknown): EvolutionAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    article_id: row.article_id ? asString(row.article_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseArray<T>(raw: unknown, parser: (item: unknown) => T | null): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser).filter((item): item is T => item != null);
}

export function buildEvolutionFilterQuery(filters: EvolutionFilters): string {
  const params = new URLSearchParams();
  if (filters.health_status) params.set("health_status", filters.health_status);
  if (filters.workflow_status) params.set("workflow_status", filters.workflow_status);
  if (filters.source) params.set("source", filters.source);
  if (filters.locale) params.set("locale", filters.locale);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function parseKnowledgeEvolutionCenter(raw: unknown): KnowledgeEvolutionCenter | null {
  const row = asRecord(raw);
  if (!row || !row.overview) return null;
  const filters = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "Knowledge should improve continuously. Every solved problem is an opportunity to help the next customer faster."
    ),
    filters: {
      health_status: filters.health_status
        ? parseEnum(filters.health_status, HEALTH_STATUSES, "healthy")
        : undefined,
      workflow_status: filters.workflow_status
        ? parseEnum(filters.workflow_status, WORKFLOW_STATUSES, "draft")
        : undefined,
      source: filters.source
        ? parseEnum(filters.source, KNOWLEDGE_SOURCES, "internal_documentation")
        : undefined,
      locale: filters.locale ? parseEnum(filters.locale, LOCALES, "en") : undefined,
    },
    overview: parseOverview(row.overview),
    articles: parseArray(row.articles, parseArticle),
    gaps: parseArray(row.gaps, parseGap),
    suggestions: parseArray(row.suggestions, parseSuggestion),
    recommendations: parseArray(row.recommendations, parseRecommendation),
    analytics: parseAnalytics(row.analytics),
    audit: parseArray(row.audit, parseAudit),
  };
}
