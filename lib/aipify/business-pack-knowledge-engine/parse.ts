import type {
  BusinessPackKnowledgeCenter,
  BusinessPackKnowledgeEngineDashboard,
  KnowledgeArticle,
  StructureItem,
} from "./types";

function parseArticles(value: unknown): KnowledgeArticle[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .map((row) => ({
      id: String(row.id ?? ""),
      article_slug: String(row.article_slug ?? ""),
      category: String(row.category ?? ""),
      title: String(row.title ?? ""),
      summary: String(row.summary ?? ""),
      body: String(row.body ?? ""),
      keywords: Array.isArray(row.keywords) ? (row.keywords as string[]) : [],
      context_surfaces: Array.isArray(row.context_surfaces) ? (row.context_surfaces as string[]) : [],
      version: String(row.version ?? "1.0.0"),
      published_at: String(row.published_at ?? ""),
      updated_at: String(row.updated_at ?? ""),
      view_count: Number(row.view_count ?? 0),
      helpful_count: Number(row.helpful_count ?? 0),
      not_helpful_count: Number(row.not_helpful_count ?? 0),
      helpfulness_percent:
        row.helpfulness_percent == null ? null : Number(row.helpfulness_percent),
    }));
}

function parseStructure(value: unknown): StructureItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is StructureItem => typeof row === "object" && row !== null && "key" in row)
    .map((row) => ({
      key: String((row as StructureItem).key),
      label: String((row as StructureItem).label ?? (row as StructureItem).key),
      order: Number((row as StructureItem).order ?? 0),
    }))
    .sort((a, b) => a.order - b.order);
}

export function parseBusinessPackKnowledgeCenter(data: unknown): BusinessPackKnowledgeCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) {
    return { found: false, pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined };
  }

  const definition = row.definition as BusinessPackKnowledgeCenter["definition"];

  return {
    found: true,
    pack_key: typeof row.pack_key === "string" ? row.pack_key : undefined,
    locale: typeof row.locale === "string" ? (row.locale as BusinessPackKnowledgeCenter["locale"]) : "en",
    principle: typeof row.principle === "string" ? row.principle : undefined,
    definition: definition
      ? {
          ...definition,
          knowledge_structure: parseStructure(definition.knowledge_structure),
        }
      : undefined,
    structure: parseStructure(row.structure),
    mandatory_categories: Array.isArray(row.mandatory_categories)
      ? (row.mandatory_categories as string[])
      : [],
    articles: parseArticles(row.articles),
    contextual_articles: Array.isArray(row.contextual_articles)
      ? (row.contextual_articles as BusinessPackKnowledgeCenter["contextual_articles"])
      : [],
    analytics: row.analytics as BusinessPackKnowledgeCenter["analytics"],
    governance_note: typeof row.governance_note === "string" ? row.governance_note : undefined,
    knowledge_center_route:
      typeof row.knowledge_center_route === "string" ? row.knowledge_center_route : undefined,
  };
}

export function parseBusinessPackKnowledgeEngineDashboard(
  data: unknown,
): BusinessPackKnowledgeEngineDashboard | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.has_access !== true) return { has_access: false };
  return {
    has_access: true,
    is_platform_admin: row.is_platform_admin === true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    knowledge_structure: parseStructure(row.knowledge_structure),
    mandatory_categories: Array.isArray(row.mandatory_categories)
      ? (row.mandatory_categories as string[])
      : [],
    supported_locales: Array.isArray(row.supported_locales) ? (row.supported_locales as string[]) : [],
    governance: (row.governance as Record<string, string>) ?? {},
    forbidden: Array.isArray(row.forbidden) ? (row.forbidden as string[]) : [],
    summary: (row.summary as Record<string, number>) ?? {},
    definitions: Array.isArray(row.definitions) ? (row.definitions as Array<Record<string, unknown>>) : [],
    top_articles: Array.isArray(row.top_articles) ? (row.top_articles as Array<Record<string, unknown>>) : [],
    top_searches: Array.isArray(row.top_searches)
      ? (row.top_searches as Array<{ query: string; count: number }>)
      : [],
    recent_audit: Array.isArray(row.recent_audit) ? (row.recent_audit as Array<Record<string, unknown>>) : [],
    success_criteria: Array.isArray(row.success_criteria) ? (row.success_criteria as string[]) : [],
  };
}

export function packKnowledgeRoute(packKey: string): string {
  return `/app/marketplace/packs/${packKey}/knowledge`;
}
