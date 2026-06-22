import {
  ACCEPTANCE_QUESTION_ARTICLE_MAP,
} from "./platform-corpus";
import type { PlatformCorpusArticleId } from "./types";

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?!.]+$/, "");
}

export function resolveArticleIdForQuery(query: string): PlatformCorpusArticleId | undefined {
  const q = normalizeQuery(query);
  return ACCEPTANCE_QUESTION_ARTICLE_MAP[q] ?? ACCEPTANCE_QUESTION_ARTICLE_MAP[`${q}?`];
}
