import type { SupportAssistantContextResponse, SupportAssistantSearchResult } from "./types";
import type { PlatformKnowledgeAction, PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parsePlatformAction(raw: unknown): PlatformKnowledgeAction | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const href = str(row.href);
  if (!href) return null;
  return {
    labelKey: str(row.labelKey),
    label: str(row.label),
    href,
    routeKey: str(row.routeKey),
  };
}

function parsePlatformAnswer(raw: unknown): PlatformKnowledgeAnswer | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const row = raw as Record<string, unknown>;
  const actions = Array.isArray(row.actions)
    ? row.actions.map(parsePlatformAction).filter((a): a is PlatformKnowledgeAction => a !== null)
    : [];
  return {
    directAnswer: str(row.directAnswer),
    explanation: str(row.explanation) || undefined,
    status: str(row.status) || undefined,
    steps: Array.isArray(row.steps) ? row.steps.map((s) => str(s)) : [],
    actions,
    sourceId: str(row.sourceId),
    source: str(row.source, "platform_corpus") as PlatformKnowledgeAnswer["source"],
    confidence: str(row.confidence, "moderate") as PlatformKnowledgeAnswer["confidence"],
    title: str(row.title) || undefined,
  };
}

export type EnrichedSupportAssistantSearchResult = SupportAssistantSearchResult & {
  answer?: PlatformKnowledgeAnswer;
  source?: string;
  confidence?: string;
  matched_article_id?: string;
  corpus_version?: string;
};

export function parseSupportAssistantSearch(data: unknown): EnrichedSupportAssistantSearchResult {
  if (!data || typeof data !== "object") {
    return { found: false, query: "", articles: [] };
  }
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    query: str(d.query),
    answer: parsePlatformAnswer(d.answer),
    source: str(d.source) || undefined,
    confidence: str(d.confidence) || undefined,
    matched_article_id: str(d.matched_article_id) || undefined,
    corpus_version: str(d.corpus_version) || undefined,
    articles: Array.isArray(d.articles)
      ? d.articles.map((a) => {
          const row = a as Record<string, unknown>;
          return {
            id: str(row.id),
            title: str(row.title),
            summary: str(row.summary),
            steps: Array.isArray(row.steps) ? row.steps.map((s) => str(s)) : [],
            category: str(row.category, "general"),
            related_module: str(row.related_module) || undefined,
            related_articles: Array.isArray(row.related_articles)
              ? row.related_articles.map((r) => {
                  const rel = r as Record<string, unknown>;
                  return { id: str(rel.id), title: str(rel.title) };
                })
              : [],
            searchText: str(row.searchText),
          };
        })
      : [],
  };
}

export function parseSupportAssistantContext(data: unknown): SupportAssistantContextResponse {
  if (!data || typeof data !== "object") return { prepared: false };
  const d = data as Record<string, unknown>;
  return {
    prepared: d.prepared === true,
    context_id: str(d.context_id) || undefined,
    context: typeof d.context === "object" && d.context ? (d.context as Record<string, unknown>) : undefined,
    requires_confirmation: d.requires_confirmation === true,
    support_request_route: str(d.support_request_route) || undefined,
  };
}
