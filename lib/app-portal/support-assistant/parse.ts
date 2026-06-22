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

function parsePlatformSource(raw: unknown): PlatformKnowledgeAnswer["sources"][number] | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const id = str(row.id);
  const label = str(row.label);
  if (!id || !label) return null;
  return {
    id,
    label,
    kind: str(row.kind, "platform_corpus") as PlatformKnowledgeAnswer["sources"][number]["kind"],
    meta: str(row.meta) || undefined,
  };
}

function parsePlatformAnswer(raw: unknown): PlatformKnowledgeAnswer | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const row = raw as Record<string, unknown>;
  const actions = Array.isArray(row.actions)
    ? row.actions.map(parsePlatformAction).filter((a): a is PlatformKnowledgeAction => a !== null)
    : [];
  const sources = Array.isArray(row.sources)
    ? row.sources.map(parsePlatformSource).filter((s): s is NonNullable<ReturnType<typeof parsePlatformSource>> => s !== null)
    : [];
  return {
    directAnswer: str(row.directAnswer),
    explanation: str(row.explanation) || undefined,
    status: str(row.status) || undefined,
    steps: Array.isArray(row.steps) ? row.steps.map((s) => str(s)) : [],
    actions,
    sources,
    sourceId: str(row.sourceId),
    source: str(row.source, "platform_corpus") as PlatformKnowledgeAnswer["source"],
    confidence: str(row.confidence, "moderate") as PlatformKnowledgeAnswer["confidence"],
    title: str(row.title) || undefined,
    showSupportEscalation: row.showSupportEscalation === true,
    liveIntegrationToolUsed: row.liveIntegrationToolUsed === true,
    orgConfirmEligible: row.orgConfirmEligible !== false,
    requestedLiveIntegration: row.requestedLiveIntegration === true,
    orgConfirmBlockedReason: str(row.orgConfirmBlockedReason) || undefined,
    integrationToolName: str(row.integrationToolName) || undefined,
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
