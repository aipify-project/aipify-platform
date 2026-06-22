export const KC_MIN_ARTICLE_SCORE = 55;
/** Minimum ts_rank / FAQ rank from search_organization_knowledge — weak FAQ-only rows use 0.1. */
export const ORG_KNOWLEDGE_MIN_RANK = 0.08;

export type OrganizationKnowledgeHit = {
  id: string;
  title: string;
  slug: string;
  category_slug: string | null;
  score: number;
  body?: string;
  summary?: string | null;
  source_type: string | null;
  published_at: string | null;
  language: string | null;
};

export type OrganizationKnowledgeSearchOutcome =
  | { kind: "hit"; hit: OrganizationKnowledgeHit }
  | { kind: "miss" }
  | { kind: "permission_denied" };

type RawSearchRow = Record<string, unknown>;

function isPermissionDeniedError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

export function parseOrganizationKnowledgeRow(row: RawSearchRow): OrganizationKnowledgeHit | null {
  const status = String(row.status ?? "");
  if (status && status !== "published") return null;

  const rank = Number(row.rank ?? row.score ?? row.relevance ?? 0);
  if (!Number.isFinite(rank) || rank < ORG_KNOWLEDGE_MIN_RANK) return null;

  const title = String(row.title ?? row.slug ?? "");
  const slug = String(row.slug ?? "");
  if (!title && !slug) return null;

  const content = row.content ?? row.body;
  const body = content ? String(content).trim() : undefined;
  const summary = row.summary ? String(row.summary).trim() : null;
  if (!body && !summary) return null;

  return {
    id: String(row.id ?? slug),
    title: title || slug,
    slug,
    category_slug: row.category_slug ? String(row.category_slug) : null,
    score: rank,
    body,
    summary,
    source_type: row.source_type ? String(row.source_type) : null,
    published_at: row.published_at ? String(row.published_at) : null,
    language: row.language ? String(row.language) : null,
  };
}

export function classifyOrganizationKnowledgeError(message: string): OrganizationKnowledgeSearchOutcome {
  if (isPermissionDeniedError(message)) {
    return { kind: "permission_denied" };
  }
  return { kind: "miss" };
}
