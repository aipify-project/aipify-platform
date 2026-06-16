import type { SupportAssistantContextResponse, SupportAssistantSearchResult } from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

export function parseSupportAssistantSearch(data: unknown): SupportAssistantSearchResult {
  if (!data || typeof data !== "object") {
    return { found: false, query: "", articles: [] };
  }
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    query: str(d.query),
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
