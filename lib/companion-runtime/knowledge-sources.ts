import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseKnowledgeSearchResult } from "@/lib/aipify/knowledge/parse";
import type { KnowledgeSearchResult } from "@/lib/aipify/knowledge/types";
import {
  classifyOrganizationKnowledgeError,
  KC_MIN_ARTICLE_SCORE,
  parseOrganizationKnowledgeRow,
  type OrganizationKnowledgeHit,
  type OrganizationKnowledgeSearchOutcome,
} from "./organization-knowledge";

export {
  KC_MIN_ARTICLE_SCORE,
  ORG_KNOWLEDGE_MIN_RANK,
  parseOrganizationKnowledgeRow,
  type OrganizationKnowledgeHit,
  type OrganizationKnowledgeSearchOutcome,
} from "./organization-knowledge";

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

export async function searchApprovedOrganizationKnowledge(
  supabase: SupabaseClient,
  query: string,
): Promise<OrganizationKnowledgeSearchOutcome> {
  const { data, error } = await supabase.rpc("search_organization_knowledge", {
    p_filters: { query, limit: 5, status: "published" },
  });

  if (error) {
    return classifyOrganizationKnowledgeError(error.message);
  }

  if (!Array.isArray(data) || data.length === 0) {
    return { kind: "miss" };
  }

  for (const entry of data) {
    const hit = parseOrganizationKnowledgeRow(asRecord(entry));
    if (hit) return { kind: "hit", hit };
  }

  return { kind: "miss" };
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
