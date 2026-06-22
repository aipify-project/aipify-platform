import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseKnowledgeSearchResult } from "@/lib/aipify/knowledge/parse";
import type { KnowledgeSearchResult } from "@/lib/aipify/knowledge/types";

export const KC_MIN_ARTICLE_SCORE = 55;
export const ORG_KNOWLEDGE_MIN_SCORE = 40;

type RawSearchRow = Record<string, unknown>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function parseSearchRows(raw: unknown): KnowledgeSearchResult[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => parseKnowledgeSearchResult(row));
}

export async function searchCanonicalKnowledgeCenter(
  supabase: SupabaseClient,
  query: string,
  language: string,
): Promise<KnowledgeSearchResult | null> {
  const languages = language === "en" ? ["en"] : [language, "en"];

  for (const lang of languages) {
    const { data, error } = await supabase.rpc("search_knowledge_articles", {
      p_query: query,
      p_language: lang,
      p_visibility_context: "authenticated",
      p_limit: 5,
    });
    if (error) continue;

    const rows = parseSearchRows(data);
    const top = rows[0];
    if (top && top.score >= KC_MIN_ARTICLE_SCORE) return top;
  }

  return null;
}

export type OrganizationKnowledgeHit = {
  id: string;
  title: string;
  slug: string;
  category_slug: string | null;
  score: number;
  body?: string;
  summary?: string | null;
};

export async function searchApprovedOrganizationKnowledge(
  supabase: SupabaseClient,
  query: string,
): Promise<OrganizationKnowledgeHit | null> {
  const { data, error } = await supabase.rpc("search_organization_knowledge", {
    p_filters: { query, limit: 5, status: "published" },
  });
  if (error || !Array.isArray(data) || data.length === 0) return null;

  const row = asRecord(data[0]);
  const score = Number(row.score ?? row.relevance ?? 0);
  if (score > 0 && score < ORG_KNOWLEDGE_MIN_SCORE) return null;

  const title = String(row.title ?? row.slug ?? "");
  const slug = String(row.slug ?? "");
  if (!title && !slug) return null;

  return {
    id: String(row.id ?? slug),
    title: title || slug,
    slug,
    category_slug: row.category_slug ? String(row.category_slug) : null,
    score,
    body: row.body ? String(row.body) : undefined,
    summary: row.summary ? String(row.summary) : null,
  };
}

export function formatKnowledgeCenterAnswerBody(article: KnowledgeSearchResult): string {
  const summary = article.summary?.trim();
  const body = article.body.trim();
  const combined = summary ? `${summary}\n\n${body}` : body;
  return combined
    .replace(/\n_Based on current Aipify documentation\._\s*$/i, "")
    .replace(/\n+See also:[\s\S]*$/i, "")
    .trim();
}
