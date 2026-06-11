import type {
  KnowledgeAnswer,
  KnowledgeArticle,
  KnowledgeCategory,
  KnowledgeCenter,
  KnowledgeGap,
  KnowledgeSearchResult,
  KnowledgeSettings,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && !Number.isNaN(value) ? value : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

export function parseKnowledgeArticle(raw: unknown): KnowledgeArticle {
  const data = asRecord(raw);
  return {
    id: asString(data.id),
    slug: asString(data.slug),
    title: asString(data.title),
    summary: data.summary ? asString(data.summary) : null,
    body: asString(data.body),
    language: asString(data.language, "en"),
    article_type: asString(data.article_type, "faq") as KnowledgeArticle["article_type"],
    status: asString(data.status, "draft") as KnowledgeArticle["status"],
    visibility: asString(data.visibility, "admin_and_support") as KnowledgeArticle["visibility"],
    tags: asStringArray(data.tags),
    keywords: asStringArray(data.keywords),
    category_id: data.category_id ? asString(data.category_id) : null,
    category_slug: data.category_slug ? asString(data.category_slug) : null,
    is_global: asBool(data.is_global),
    priority: asNumber(data.priority),
    source_path: data.source_path ? asString(data.source_path) : null,
    published_at: data.published_at ? asString(data.published_at) : null,
    updated_at: asString(data.updated_at),
  };
}

export function parseKnowledgeGap(raw: unknown): KnowledgeGap {
  const data = asRecord(raw);
  return {
    id: asString(data.id),
    question: asString(data.question),
    language: data.language ? asString(data.language) : null,
    source_type: asString(data.source_type, "support_chat"),
    frequency_count: asNumber(data.frequency_count, 1),
    confidence_score: typeof data.confidence_score === "number" ? data.confidence_score : null,
    suggested_title: data.suggested_title ? asString(data.suggested_title) : null,
    suggested_answer_draft: data.suggested_answer_draft ? asString(data.suggested_answer_draft) : null,
    status: asString(data.status, "open") as KnowledgeGap["status"],
    related_article_id: data.related_article_id ? asString(data.related_article_id) : null,
    created_at: asString(data.created_at),
  };
}

export function parseKnowledgeCategory(raw: unknown): KnowledgeCategory {
  const data = asRecord(raw);
  return {
    id: asString(data.id),
    slug: asString(data.slug),
    name: asString(data.name),
    description: data.description ? asString(data.description) : null,
    sort_order: asNumber(data.sort_order),
    visibility: asString(data.visibility, "admin_and_support") as KnowledgeCategory["visibility"],
  };
}

export function parseKnowledgeCenter(raw: unknown): KnowledgeCenter {
  const data = asRecord(raw);
  const metrics = asRecord(data.metrics);
  return {
    has_customer: asBool(data.has_customer),
    has_access: asBool(data.has_access),
    upgrade_required: asBool(data.upgrade_required),
    enabled: asBool(data.enabled, true),
    privacy_note: asString(data.privacy_note),
    metrics: {
      published_articles: asNumber(metrics.published_articles),
      draft_articles: asNumber(metrics.draft_articles),
      review_articles: asNumber(metrics.review_articles),
      open_gaps: asNumber(metrics.open_gaps),
      searches_24h: asNumber(metrics.searches_24h),
    },
    recent_articles: Array.isArray(data.recent_articles)
      ? data.recent_articles.map(parseKnowledgeArticle)
      : [],
    open_gaps: Array.isArray(data.open_gaps) ? data.open_gaps.map(parseKnowledgeGap) : [],
    top_searches: Array.isArray(data.top_searches)
      ? data.top_searches.map((s) => {
          const row = asRecord(s);
          return { query: asString(row.query), count: asNumber(row.count) };
        })
      : [],
  };
}

export function parseKnowledgeSettings(raw: unknown): {
  has_customer: boolean;
  has_access: boolean;
  upgrade_required: boolean;
  settings: KnowledgeSettings | null;
} {
  const data = asRecord(raw);
  const settings = data.settings ? asRecord(data.settings) : null;
  return {
    has_customer: asBool(data.has_customer),
    has_access: asBool(data.has_access),
    upgrade_required: asBool(data.upgrade_required),
    settings: settings
      ? {
          enabled: asBool(settings.enabled, true),
          use_global_knowledge: asBool(settings.use_global_knowledge, true),
          allow_tenant_articles: asBool(settings.allow_tenant_articles, true),
          allow_ai_gap_drafts: asBool(settings.allow_ai_gap_drafts, true),
          require_review_before_publish: asBool(settings.require_review_before_publish, true),
          default_language: asString(settings.default_language, "en"),
          fallback_language: asString(settings.fallback_language, "en"),
          minimum_answer_confidence: asNumber(settings.minimum_answer_confidence, 0.65),
          create_gap_below_confidence: asNumber(settings.create_gap_below_confidence, 0.55),
        }
      : null,
  };
}

export function parseKnowledgeSearchResult(raw: unknown): KnowledgeSearchResult {
  const data = asRecord(raw);
  return {
    id: asString(data.id),
    slug: asString(data.slug),
    title: asString(data.title),
    summary: data.summary ? asString(data.summary) : null,
    body: asString(data.body),
    language: asString(data.language, "en"),
    category_slug: data.category_slug ? asString(data.category_slug) : null,
    score: asNumber(data.score),
    is_global: asBool(data.is_global),
  };
}

export function parseKnowledgeAnswer(raw: unknown): KnowledgeAnswer {
  const data = asRecord(raw);
  return {
    answer: asString(data.answer),
    confidence_score: asNumber(data.confidence_score),
    articles_used: Array.isArray(data.articles_used)
      ? data.articles_used.map(parseKnowledgeSearchResult)
      : [],
    created_gap_id: data.created_gap_id ? asString(data.created_gap_id) : null,
    should_escalate: asBool(data.should_escalate),
    fallback_message: data.fallback_message ? asString(data.fallback_message) : null,
    answered: asBool(data.answered),
  };
}
