import { isCapabilityHelpQuery } from "@/lib/companion-runtime/companion-turn-route";
import { buildPlatformAnswer, resolvePlatformCorpus } from "./answer-builder";
import {
  ACCEPTANCE_QUESTION_ARTICLE_MAP,
  PLATFORM_KNOWLEDGE_CORPUS,
} from "./platform-corpus";
import { canAccessArticle, type PermissionContext } from "./permission-gate";
import { parseCustomerLicenseCenter } from "./pricing-bridge";
import type {
  PlatformCorpusArticleId,
  PlatformSearchOptions,
  PlatformSearchResult,
} from "./types";

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?!.]+$/, "");
}

function matchesCapabilityHelpArticle(normalized: string): boolean {
  if (!/\b(aipify|companion)\b/i.test(normalized)) return false;

  return (
    (/\b(hva kan|what can|how can|hvordan kan)\b/i.test(normalized) &&
      /\b(hjelpe|help|assist|assistere|støtte|support)\b/i.test(normalized)) ||
    /\b(how can|how does)\b.*\b(aipify|companion)\b.*\b(help|assist)\b/i.test(normalized)
  );
}

export function resolveArticleIdForQuery(query: string): PlatformCorpusArticleId | undefined {
  const q = normalizeQuery(query);
  const direct = ACCEPTANCE_QUESTION_ARTICLE_MAP[q] ?? ACCEPTANCE_QUESTION_ARTICLE_MAP[`${q}?`];
  if (direct) return direct;
  if (matchesCapabilityHelpArticle(q)) return "aipify-capabilities";
  return undefined;
}

/** Resolve generic capability/help questions from platform corpus before orchestrator fallbacks. */
export async function tryResolveCapabilityHelpPlatformSearch(
  query: string,
  options: PlatformSearchOptions,
): Promise<PlatformSearchResult | null> {
  if (!isCapabilityHelpQuery(query)) return null;

  const articleId = resolveArticleIdForQuery(query);
  if (articleId !== "aipify-capabilities") return null;

  const { t, getSearchTermsArray, subscriptionRaw, ctx } = options;
  const permissionCtx: PermissionContext = {
    userRole: ctx.userRole,
    enabledFeatures: ctx.enabledFeatures,
    planKey: ctx.planKey,
  };

  const entry = PLATFORM_KNOWLEDGE_CORPUS.find((item) => item.id === articleId);
  if (entry && !canAccessArticle(entry, permissionCtx)) return null;

  const corpus = resolvePlatformCorpus(PLATFORM_KNOWLEDGE_CORPUS, t, getSearchTermsArray);
  const article = corpus.find((item) => item.id === articleId);
  if (!article) return null;

  const subscription = parseCustomerLicenseCenter(subscriptionRaw);
  const restrictedNote = t("customerApp.companionPlatformKnowledge.permissions.restrictedAction");

  return {
    matchedArticleId: articleId,
    answer: buildPlatformAnswer(article, t, permissionCtx, {
      source: "platform_corpus",
      confidence: "high",
      subscription,
      restrictedNote,
    }),
  };
}
