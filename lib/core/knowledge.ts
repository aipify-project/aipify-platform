/**
 * Knowledge Center helpers (Phase A.5).
 * Authoritative storage and enforcement live in Supabase RPCs (_kce_*).
 */

export const KNOWLEDGE_CATEGORIES = [
  "faq",
  "support",
  "onboarding",
  "policies",
  "products",
  "integrations",
  "troubleshooting",
  "internal_procedures",
  "training",
] as const;

export type KnowledgeCategorySlug = (typeof KNOWLEDGE_CATEGORIES)[number];

export const KNOWLEDGE_VISIBILITY_LEVELS = ["internal", "customer", "public"] as const;
export type KnowledgeVisibility = (typeof KNOWLEDGE_VISIBILITY_LEVELS)[number];

export const KNOWLEDGE_ARTICLE_STATUSES = ["draft", "review", "published", "archived"] as const;
export type KnowledgeArticleStatus = (typeof KNOWLEDGE_ARTICLE_STATUSES)[number];

export const KNOWLEDGE_IMPORT_TYPES = ["text", "markdown", "faq", "support_doc"] as const;
export type KnowledgeImportType = (typeof KNOWLEDGE_IMPORT_TYPES)[number];

export type KnowledgeSearchFilters = {
  query?: string;
  category_slug?: string;
  language?: string;
  status?: KnowledgeArticleStatus;
  visibility?: KnowledgeVisibility;
  limit?: number;
};

export type KnowledgeArticleSummary = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  language?: string;
  visibility?: KnowledgeVisibility;
  status?: KnowledgeArticleStatus;
  version?: number;
  view_count?: number;
  published_at?: string | null;
  category_slug?: string | null;
};

type KnowledgeRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isPublishedForAi(status?: string): boolean {
  return status === "published";
}

export function slugifyKnowledgeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function searchKnowledge(
  supabase: KnowledgeRpcClient,
  filters: KnowledgeSearchFilters = {}
): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.rpc("search_organization_knowledge", { p_filters: filters });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>[] | null) ?? [];
}

export async function getPublishedArticles(
  supabase: KnowledgeRpcClient,
  language?: string
): Promise<KnowledgeArticleSummary[]> {
  const { data, error } = await supabase.rpc("get_published_knowledge_articles", {
    p_language: language ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as KnowledgeArticleSummary[] | null) ?? [];
}

export async function publishArticle(
  supabase: KnowledgeRpcClient,
  articleId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("publish_organization_knowledge_article", {
    p_article_id: articleId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function archiveArticle(
  supabase: KnowledgeRpcClient,
  articleId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("archive_organization_knowledge_article", {
    p_article_id: articleId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createFaq(
  supabase: KnowledgeRpcClient,
  params: {
    question: string;
    answer: string;
    slug: string;
    category_slug?: string;
    language?: string;
    visibility?: KnowledgeVisibility;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_organization_knowledge_faq", {
    p_question: params.question,
    p_answer: params.answer,
    p_slug: params.slug,
    p_category_slug: params.category_slug ?? "faq",
    p_language: params.language ?? "en",
    p_visibility: params.visibility ?? "internal",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function rollbackArticleVersion(
  supabase: KnowledgeRpcClient,
  articleId: string,
  versionNumber: number
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("rollback_organization_knowledge_article", {
    p_article_id: articleId,
    p_version_number: versionNumber,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function retrieveKnowledgeForAi(
  supabase: KnowledgeRpcClient,
  query: string,
  language = "en",
  visibility: KnowledgeVisibility = "internal"
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("retrieve_knowledge_for_ai", {
    p_query: query,
    p_language: language,
    p_visibility: visibility,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
