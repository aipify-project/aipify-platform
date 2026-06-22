import type { SupabaseClient } from "@supabase/supabase-js";
import { retrieveKnowledgeAnswer } from "@/lib/aipify/knowledge/retrieve";
import type { Translator } from "@/lib/i18n/translate";
import {
  ACCEPTANCE_QUESTION_ARTICLE_MAP,
  PLATFORM_KNOWLEDGE_CORPUS,
} from "./platform-corpus";
import {
  buildFallbackAnswer,
  buildPlatformAnswer,
  buildPricingLabels,
  resolvePlatformCorpus,
} from "./answer-builder";
import {
  detectPlatformQuestionIntent,
  resolveArticleIdForIntent,
} from "./intent-detection";
import { buildPublishedPricingSummary, parseCustomerLicenseCenter } from "./pricing-bridge";
import { canAccessArticle, type PermissionContext } from "./permission-gate";
import { resolveRouteKeyFromQuery } from "./route-registry";
import {
  buildIntegrationStatusFailureAnswer,
  buildPrivateDataDeniedAnswer,
  buildRoleDisambiguationAnswer,
  buildVerifiedIntegrationStatusAnswer,
} from "./integration-status-answer";
import {
  buildPlatformSnapshotFailureAnswer,
  buildVerifiedPlatformSnapshotAnswer,
} from "./platform-snapshot-answer";
import { detectLivePlatformSnapshotIntent } from "./platform-snapshot-intent";
import { getUnonightPlatformSnapshot } from "./platform-snapshot-tool";
import { detectLiveIntegrationStatusIntent } from "./integration-status-intent";
import { getConnectedIntegrationStatus } from "./integration-status-tool";
import type {
  PlatformCorpusArticleId,
  PlatformSearchContext,
  PlatformSearchResult,
  ResolvedPlatformArticle,
} from "./types";

export type PlatformSearchOptions = {
  t: Translator;
  locale: string;
  ctx: PlatformSearchContext;
  getSearchTermsArray: (key: string) => string[];
  subscriptionRaw?: unknown;
  supabase?: SupabaseClient;
  integrationContext?: "unonight" | null;
};

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?!.]+$/, "");
}

function scoreArticleMatch(query: string, article: ResolvedPlatformArticle): number {
  const q = normalizeQuery(query);
  let score = 0;

  if (ACCEPTANCE_QUESTION_ARTICLE_MAP[q] === article.id) score += 100;
  if (ACCEPTANCE_QUESTION_ARTICLE_MAP[`${q}?`] === article.id) score += 100;

  for (const term of article.searchTerms) {
    const normalizedTerm = term.toLowerCase();
    if (q === normalizedTerm) score += 50;
    else if (q.includes(normalizedTerm) || normalizedTerm.includes(q)) score += 20;
    else {
      for (const word of q.split(/\s+/)) {
        if (word.length > 2 && normalizedTerm.includes(word)) score += 3;
      }
    }
  }

  if (article.title.toLowerCase().includes(q)) score += 15;
  if (article.directAnswer.toLowerCase().includes(q)) score += 5;

  return score;
}

function findBestCorpusMatch(
  query: string,
  corpus: ResolvedPlatformArticle[],
  ctx: PlatformSearchContext,
): { article: ResolvedPlatformArticle; score: number } | null {
  const permissionCtx: PermissionContext = {
    userRole: ctx.userRole,
    enabledFeatures: ctx.enabledFeatures,
    planKey: ctx.planKey,
  };

  const scored = corpus
    .filter((article) => {
      const entry = PLATFORM_KNOWLEDGE_CORPUS.find((e) => e.id === article.id);
      return entry ? canAccessArticle(entry, permissionCtx) : true;
    })
    .map((article) => ({ article, score: scoreArticleMatch(query, article) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0] ?? null;
}

function findRouteMatchArticle(
  query: string,
  corpus: ResolvedPlatformArticle[],
): ResolvedPlatformArticle | null {
  const routeKey = resolveRouteKeyFromQuery(query);
  if (!routeKey) return null;

  const byPrimary = corpus.find((a) => a.primaryRouteKey === routeKey);
  if (byPrimary) return byPrimary;

  const byAction = corpus.find((a) => a.actionRouteKeys.includes(routeKey));
  return byAction ?? null;
}

export async function searchPlatformKnowledge(
  query: string,
  options: PlatformSearchOptions,
): Promise<PlatformSearchResult> {
  const { t, locale, ctx, getSearchTermsArray, subscriptionRaw, supabase, integrationContext } =
    options;
  const permissionCtx: PermissionContext = {
    userRole: ctx.userRole,
    enabledFeatures: ctx.enabledFeatures,
    planKey: ctx.planKey,
  };

  const corpus = resolvePlatformCorpus(PLATFORM_KNOWLEDGE_CORPUS, t, getSearchTermsArray);
  const subscription = parseCustomerLicenseCenter(subscriptionRaw);
  const pricingSummary =
    normalizeQuery(query).includes("kost") ||
    normalizeQuery(query).includes("price") ||
    normalizeQuery(query).includes("pricing")
      ? buildPublishedPricingSummary(locale, buildPricingLabels(t))
      : undefined;

  const restrictedNote = t("customerApp.companionPlatformKnowledge.permissions.restrictedAction");

  const platformSnapshotIntent = detectLivePlatformSnapshotIntent(query, { integrationContext });
  if (platformSnapshotIntent && supabase) {
    const snapshotResult = await getUnonightPlatformSnapshot(supabase, {
      providerKey: platformSnapshotIntent.providerKey,
      refresh: true,
    });

    if (snapshotResult.ok) {
      return {
        answer: buildVerifiedPlatformSnapshotAnswer(
          snapshotResult.data,
          t,
          locale,
          permissionCtx,
          platformSnapshotIntent.queryKind,
        ),
      };
    }

    if (platformSnapshotIntent.blocksKnowledgeCenter) {
      return {
        answer: buildPlatformSnapshotFailureAnswer(snapshotResult.code, t, permissionCtx),
      };
    }
  }

  // 0. Live verified integration status — before corpus and Knowledge Center
  const liveIntegrationIntent = detectLiveIntegrationStatusIntent(query, { integrationContext });
  if (liveIntegrationIntent) {
    if (liveIntegrationIntent.queryKind === "private_data") {
      return {
        answer: buildPrivateDataDeniedAnswer(t, permissionCtx),
      };
    }

    if (liveIntegrationIntent.queryKind === "role_disambiguation") {
      return {
        answer: buildRoleDisambiguationAnswer(t, permissionCtx),
      };
    }

    if (supabase && liveIntegrationIntent.requiresLive) {
      const toolResult = await getConnectedIntegrationStatus(supabase, {
        providerKey: liveIntegrationIntent.providerKey,
        refresh: true,
      });

      if (toolResult.ok) {
        return {
          answer: buildVerifiedIntegrationStatusAnswer(
            toolResult.data,
            t,
            locale,
            permissionCtx,
            liveIntegrationIntent.queryKind,
          ),
        };
      }

      if (liveIntegrationIntent.blocksKnowledgeCenter) {
        return {
          answer: buildIntegrationStatusFailureAnswer(toolResult.code, t, permissionCtx),
        };
      }
    }
  }

  // 1. Explicit intent detection (API definition vs keys vs connection vs access)
  const intent = detectPlatformQuestionIntent(query);
  if (intent) {
    const intentArticleId = resolveArticleIdForIntent(intent);
    const intentArticle = corpus.find((a) => a.id === intentArticleId);
    if (intentArticle) {
      return {
        matchedArticleId: intentArticle.id,
        answer: buildPlatformAnswer(intentArticle, t, permissionCtx, {
          source: "platform_corpus",
          confidence: "high",
          subscription,
          pricingSummary,
          restrictedNote,
        }),
      };
    }
  }

  // 1. Platform corpus match
  const corpusMatch = findBestCorpusMatch(query, corpus, ctx);
  if (corpusMatch && corpusMatch.score >= 10) {
    return {
      matchedArticleId: corpusMatch.article.id,
      answer: buildPlatformAnswer(corpusMatch.article, t, permissionCtx, {
        source: "platform_corpus",
        confidence: corpusMatch.score >= 50 ? "high" : "moderate",
        subscription,
        pricingSummary,
        restrictedNote,
      }),
    };
  }

  // 2. Route-aware nav matching
  const routeArticle = findRouteMatchArticle(query, corpus);
  if (routeArticle) {
    return {
      matchedArticleId: routeArticle.id,
      answer: buildPlatformAnswer(routeArticle, t, permissionCtx, {
        source: "route_match",
        confidence: "moderate",
        subscription,
        pricingSummary,
        restrictedNote,
      }),
    };
  }

  // 3. Knowledge Center RPC (optional) — skip when user requested live integration data
  if (supabase && !liveIntegrationIntent?.blocksKnowledgeCenter && !platformSnapshotIntent?.blocksKnowledgeCenter) {
    try {
      const kcResult = await retrieveKnowledgeAnswer(
        async (rpc, params) => {
          const { data } = await supabase.rpc(rpc, params);
          return data;
        },
        { query, language: locale, visibilityContext: "authenticated", sourceType: "admin_chat" },
      );
      if (kcResult.answered && kcResult.answer.trim()) {
        const fallbackArticle = corpus.find((a) => a.id === "knowledge-center") ?? corpus[0];
        const built = buildPlatformAnswer(fallbackArticle, t, permissionCtx, {
          source: "knowledge_center",
          confidence: "moderate",
        });
        return {
          answer: {
            directAnswer: kcResult.answer,
            explanation: t("customerApp.companionPlatformKnowledge.sources.knowledgeCenter"),
            steps: [],
            actions: built.actions,
            sources: [
              {
                id: kcResult.created_gap_id ?? "knowledge-center",
                label: t("customerApp.companionPlatformKnowledge.sources.knowledgeCenter"),
                kind: "knowledge_center",
              },
              ...built.sources,
            ],
            sourceId: kcResult.created_gap_id ?? "knowledge-center",
            source: "knowledge_center",
            confidence: kcResult.confidence_score >= 0.65 ? "high" : "moderate",
          },
        };
      }
    } catch {
      // KC unavailable — continue to fallback
    }
  }

  // 4. Customer context-only queries
  if (
    subscription &&
    (normalizeQuery(query).includes("abonnement") ||
      normalizeQuery(query).includes("subscription") ||
      normalizeQuery(query).includes("plan"))
  ) {
    const mySub = corpus.find((a) => a.id === "my-subscription");
    if (mySub) {
      return {
        matchedArticleId: "my-subscription",
        answer: buildPlatformAnswer(mySub, t, permissionCtx, {
          source: "customer_context",
          confidence: "high",
          subscription,
          restrictedNote,
        }),
      };
    }
  }

  // 5. Fallback guidance — never empty for platform questions
  const isPlatformQuestion =
    normalizeQuery(query).length > 2 &&
    (corpusMatch !== null ||
      routeArticle !== null ||
      normalizeQuery(query).includes("aipify") ||
      normalizeQuery(query).includes("app") ||
      normalizeQuery(query).includes("hvordan") ||
      normalizeQuery(query).includes("how"));

  if (isPlatformQuestion) {
    const partial = corpusMatch?.article ?? routeArticle;
    if (partial) {
      return {
        matchedArticleId: partial.id,
        answer: buildPlatformAnswer(partial, t, permissionCtx, {
          source: "fallback",
          confidence: "low",
          subscription,
          pricingSummary,
          restrictedNote,
        }),
      };
    }
  }

  return {
    answer: buildFallbackAnswer(t, permissionCtx),
  };
}

export function resolveArticleIdForQuery(query: string): PlatformCorpusArticleId | undefined {
  const q = normalizeQuery(query);
  return ACCEPTANCE_QUESTION_ARTICLE_MAP[q] ?? ACCEPTANCE_QUESTION_ARTICLE_MAP[`${q}?`];
}
