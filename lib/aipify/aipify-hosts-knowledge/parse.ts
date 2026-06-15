import type {
  AipifyHostsKnowledgeArticleDetail,
  HostsKnowledgeArticle,
  HostsKnowledgeArticleSummary,
  HostsKnowledgeDashboard,
  HostsKnowledgeSearchResult,
  HostsKnowledgeSection,
  HostsKnowledgeVersion,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseSummary(data: unknown): HostsKnowledgeArticleSummary | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.slug || !d.title) return null;
  return {
    slug: String(d.slug),
    title: String(d.title),
    excerpt: typeof d.excerpt === "string" ? d.excerpt : "",
    category_name: typeof d.category_name === "string" ? d.category_name : null,
    section_key: typeof d.section_key === "string" ? d.section_key : null,
    viewed_at: typeof d.viewed_at === "string" ? d.viewed_at : undefined,
  };
}

function parseArticle(data: unknown): HostsKnowledgeArticle | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.slug || !d.title) return null;
  return {
    slug: String(d.slug),
    title: String(d.title),
    body: typeof d.body === "string" ? d.body : "",
    category_slug: typeof d.category_slug === "string" ? d.category_slug : null,
    category_name: typeof d.category_name === "string" ? d.category_name : null,
    tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
  };
}

function parseSection(data: unknown): HostsKnowledgeSection | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.key || !d.label) return null;
  return {
    key: String(d.key),
    label: String(d.label),
    articles: asArray<unknown>(d.articles)
      .map(parseSummary)
      .filter((a): a is HostsKnowledgeArticleSummary => a !== null),
  };
}

function parseVersion(data: unknown): HostsKnowledgeVersion | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  return {
    version_number: Number(d.version_number ?? 1),
    title: typeof d.title === "string" ? d.title : "",
    change_summary: typeof d.change_summary === "string" ? d.change_summary : null,
    created_at: typeof d.created_at === "string" ? d.created_at : "",
  };
}

export function parseAipifyHostsKnowledgeDashboard(data: unknown): HostsKnowledgeDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    modules: asArray<{ key: string; label: string; description: string }>(d.modules),
    sections: asArray<unknown>(d.sections)
      .map(parseSection)
      .filter((s): s is HostsKnowledgeSection => s !== null),
    popular_articles: asArray<unknown>(d.popular_articles)
      .map(parseSummary)
      .filter((a): a is HostsKnowledgeArticleSummary => a !== null),
    suggested_articles: asArray<unknown>(d.suggested_articles)
      .map(parseSummary)
      .filter((a): a is HostsKnowledgeArticleSummary => a !== null),
    recent_articles: asArray<unknown>(d.recent_articles)
      .map(parseSummary)
      .filter((a): a is HostsKnowledgeArticleSummary => a !== null),
    features: asArray<string>(d.features),
  };
}

export function parseAipifyHostsKnowledgeArticle(data: unknown): AipifyHostsKnowledgeArticleDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!d.found) return { found: false, slug: typeof d.slug === "string" ? d.slug : undefined };
  const article = parseArticle(d.article);
  return {
    found: true,
    slug: article?.slug,
    article: article ?? undefined,
    related_articles: asArray<unknown>(d.related_articles)
      .map(parseSummary)
      .filter((a): a is HostsKnowledgeArticleSummary => a !== null),
    recommended_reading: asArray<unknown>(d.recommended_reading)
      .map(parseSummary)
      .filter((a): a is HostsKnowledgeArticleSummary => a !== null),
    versions: asArray<unknown>(d.versions)
      .map(parseVersion)
      .filter((v): v is HostsKnowledgeVersion => v !== null),
    user_marked_helpful: Boolean(d.user_marked_helpful),
  };
}

export function parseAipifyHostsKnowledgeSearch(data: unknown): HostsKnowledgeSearchResult {
  if (!data || typeof data !== "object") {
    return { query: "", results: [] };
  }
  const d = data as Record<string, unknown>;
  return {
    query: typeof d.query === "string" ? d.query : "",
    results: asArray<unknown>(d.results)
      .map(parseSummary)
      .filter((a): a is HostsKnowledgeArticleSummary => a !== null),
  };
}
