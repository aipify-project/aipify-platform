import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { isCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import {
  buildFallbackAnswer,
  buildHonestKnowledgeGapAnswer,
  buildPlatformAnswer,
  buildPricingLabels,
  resolvePlatformCorpus,
} from "@/lib/companion-platform-knowledge/answer-builder";
import { detectPlatformQuestionIntent,
  resolveArticleIdForIntent,
} from "@/lib/companion-platform-knowledge/intent-detection";
import {
  enrichAnswerWithInstallDiscovery,
} from "./discovery-answer";
import { enrichAnswerWithBusinessPackContext } from "./pack-answer";
import { enrichAnswerWithSchemaContext } from "./schema-answer";
import {
  buildPrivateDataDeniedAnswer,
  buildRoleDisambiguationAnswer,
} from "@/lib/companion-platform-knowledge/integration-status-answer";
import { resolveCompanionLiveToolRouting } from "@/lib/companion-platform-knowledge/live-routing";
import {
  buildUnsupportedLiveMetricAnswer,
} from "@/lib/companion-platform-knowledge/platform-snapshot-answer";
import {
  ACCEPTANCE_QUESTION_ARTICLE_MAP,
  PLATFORM_KNOWLEDGE_CORPUS,
} from "@/lib/companion-platform-knowledge/platform-corpus";
import { buildPublishedPricingSummary, parseCustomerLicenseCenter } from "@/lib/companion-platform-knowledge/pricing-bridge";
import { canAccessArticle, type PermissionContext } from "@/lib/companion-platform-knowledge/permission-gate";
import { resolveRouteKeyFromQuery } from "@/lib/companion-platform-knowledge/route-registry";
import type {
  PlatformSearchContext,
  PlatformSearchOptions,
  PlatformSearchResult,
  ResolvedPlatformArticle,
} from "@/lib/companion-platform-knowledge/types";
import {
  formatKnowledgeCenterAnswerBody,
  searchApprovedOrganizationKnowledge,
  searchCanonicalKnowledgeCenter,
} from "./knowledge-sources";
import { isAppNavigationQuery, isProductConceptQuery } from "./product-concept";
import type { OrganizationKnowledgeHit } from "./organization-knowledge";
import { dispatchCompanionReadTool } from "./companion-tool-dispatch";
import {
  selectToolByCapabilityId,
} from "./companion-tool-definition";
import { normalizeCompanionLiveResult } from "./companion-live-result";
import { matchLiveQuery } from "./companion-query-match";
import {
  buildGroundedLiveAnswer,
  buildGroundedLiveFailureAnswer,
  buildGroundedLiveGapAnswer,
} from "./grounded-answer";
import { matchOperationalQuery } from "./companion-operational-query-match";
import {
  buildGroundedOperationalAnswer,
  buildOperationalGapAnswer,
} from "./operational-answer";
import { mapDispatchCodeToGapReason } from "./tool-answer";
import {
  createEmptyCompanionTenantContext,
  loadCompanionTenantContext,
  resolveCompanionIntegrationContext,
} from "./tenant-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

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

  return corpus.find((a) => a.actionRouteKeys.includes(routeKey)) ?? null;
}

function buildKnowledgeCenterResult(
  directAnswer: string,
  articleTitle: string,
  articleSlug: string,
  score: number,
  t: Translator,
): PlatformSearchResult {
  return {
    answer: {
      title: articleTitle,
      directAnswer,
      explanation: t("customerApp.companionPlatformKnowledge.sources.knowledgeCenter"),
      steps: [],
      actions: [],
      sources: [
        {
          id: articleSlug,
          label: articleTitle,
          kind: "knowledge_center",
        },
      ],
      sourceId: articleSlug,
      source: "knowledge_center",
      confidence: score >= 65 ? "high" : "moderate",
      showSupportEscalation: false,
    },
  };
}

function buildOrganizationKnowledgeResult(
  hit: OrganizationKnowledgeHit,
  t: Translator,
): PlatformSearchResult | null {
  const body = hit.body?.trim() || hit.summary?.trim() || "";
  if (!body) return null;

  const sourceMeta = [
    hit.source_type,
    hit.category_slug,
    hit.published_at ? new Date(hit.published_at).toISOString().slice(0, 10) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    answer: {
      title: hit.title,
      directAnswer: body,
      explanation: t("customerApp.companionPlatformKnowledge.sources.organizationKnowledge"),
      steps: [],
      actions: [],
      sources: [
        {
          id: hit.slug || hit.id,
          label: hit.title,
          kind: "org_knowledge",
          meta: sourceMeta || hit.category_slug || undefined,
        },
      ],
      sourceId: hit.slug || hit.id,
      source: "organization_knowledge",
      confidence: hit.score >= 0.25 ? "high" : "moderate",
      showSupportEscalation: false,
    },
  };
}

const CORPUS_NAV_MIN_SCORE = 50;

async function executeGroundedLiveRead(
  supabase: SupabaseClient,
  tenantContext: CompanionTenantContext,
  liveMatch: import("./companion-query-match").CompanionLiveQueryMatch,
  t: Translator,
  locale: CustomerActiveLocale,
): Promise<PlatformSearchResult> {
  const tool = selectToolByCapabilityId(tenantContext.toolRegistry, liveMatch.capability_id);
  if (!tool) {
    return { answer: buildGroundedLiveGapAnswer(t, "missing_tool") };
  }

  const dispatchResult = await dispatchCompanionReadTool(supabase, tool, {
    providerKey: liveMatch.provider_key,
    refresh: true,
  });

  if (!dispatchResult.ok && dispatchResult.gap) {
    return {
      answer: buildGroundedLiveGapAnswer(t, mapDispatchCodeToGapReason(dispatchResult.code)),
    };
  }

  if (!dispatchResult.ok) {
    return { answer: buildGroundedLiveFailureAnswer(t, dispatchResult.code) };
  }

  const liveResult = normalizeCompanionLiveResult(dispatchResult, liveMatch);
  return {
    answer: buildGroundedLiveAnswer(liveResult, liveMatch, t, locale),
  };
}

async function resolveLiveToolAnswer(
  query: string,
  options: PlatformSearchOptions,
  permissionCtx: PermissionContext,
  integrationContext: string | null,
  activeLocale: CustomerActiveLocale,
  tenantContext: CompanionTenantContext,
): Promise<PlatformSearchResult | null> {
  const { t, locale, supabase, snapshotContext } = options;
  const routingOptions = { integrationContext, snapshotContext, locale: activeLocale };
  const liveRouting = resolveCompanionLiveToolRouting(query, routingOptions);
  const providerKey = integrationContext ?? "unknown";

  if (liveRouting.tool === "forbidden_data_denied") {
    return { answer: buildPrivateDataDeniedAnswer(t, permissionCtx) };
  }

  if (liveRouting.tool === "unsupported_live_metric") {
    return { answer: buildUnsupportedLiveMetricAnswer(t, permissionCtx, providerKey) };
  }

  const liveIntegrationIntent = liveRouting.integrationStatusIntent;
  if (liveIntegrationIntent?.queryKind === "private_data") {
    return { answer: buildPrivateDataDeniedAnswer(t, permissionCtx) };
  }
  if (liveIntegrationIntent?.queryKind === "role_disambiguation") {
    return { answer: buildRoleDisambiguationAnswer(t, permissionCtx) };
  }

  const liveMatch = matchLiveQuery({
    query,
    tenantContext,
    integrationContext,
    locale: activeLocale,
    liveRouting,
  });

  if (liveMatch && supabase) {
    return executeGroundedLiveRead(supabase, tenantContext, liveMatch, t, activeLocale);
  }

  return null;
}

function resolveOperationalAnswer(
  query: string,
  t: Translator,
  activeLocale: CustomerActiveLocale,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  const operationalMatch = matchOperationalQuery(query, tenantContext);
  if (!operationalMatch) return null;

  const { operationalContext } = tenantContext;

  if (operationalContext.warnings.includes("permission_denied")) {
    return { answer: buildOperationalGapAnswer(t, "permission_denied") };
  }

  if (operationalContext.warnings.includes("app_suspended")) {
    return { answer: buildOperationalGapAnswer(t, "unavailable") };
  }

  if (
    operationalContext.completeness === "missing" &&
    operationalContext.warnings.includes("empty")
  ) {
    return { answer: buildOperationalGapAnswer(t, "empty") };
  }

  return {
    answer: buildGroundedOperationalAnswer(
      operationalContext,
      operationalMatch,
      t,
      activeLocale,
    ),
  };
}

async function resolveNavigationCorpusAnswer(
  query: string,
  options: PlatformSearchOptions,
  permissionCtx: PermissionContext,
  corpus: ResolvedPlatformArticle[],
  subscription: ReturnType<typeof parseCustomerLicenseCenter>,
  pricingSummary: string | undefined,
  restrictedNote: string,
): Promise<PlatformSearchResult | null> {
  const { t } = options;

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

  const corpusMatch = findBestCorpusMatch(query, corpus, options.ctx);
  if (corpusMatch && corpusMatch.score >= CORPUS_NAV_MIN_SCORE) {
    return {
      matchedArticleId: corpusMatch.article.id,
      answer: buildPlatformAnswer(corpusMatch.article, t, permissionCtx, {
        source: "platform_corpus",
        confidence: corpusMatch.score >= 80 ? "high" : "moderate",
        subscription,
        pricingSummary,
        restrictedNote,
      }),
    };
  }

  return null;
}

export async function orchestrateCompanionSearch(
  query: string,
  options: PlatformSearchOptions,
  tenantContext?: CompanionTenantContext,
): Promise<PlatformSearchResult> {
  const { t, locale, ctx, getSearchTermsArray, subscriptionRaw, supabase } = options;
  const activeLocale: CustomerActiveLocale = isCustomerActiveLocale(locale) ? locale : "en";
  const resolvedTenantContext =
    tenantContext ??
    options.tenantContext ??
    (supabase
      ? await loadCompanionTenantContext(supabase, { locale: activeLocale })
      : createEmptyCompanionTenantContext({ locale: activeLocale }));

  const permissionCtx: PermissionContext = {
    userRole: ctx.userRole,
    enabledFeatures: resolvedTenantContext.enabledFeatures.length
      ? resolvedTenantContext.enabledFeatures
      : ctx.enabledFeatures,
    planKey: resolvedTenantContext.planKey ?? ctx.planKey,
  };

  const integrationContext = resolveCompanionIntegrationContext(
    options.integrationContext,
    resolvedTenantContext,
  );

  const corpus = resolvePlatformCorpus(PLATFORM_KNOWLEDGE_CORPUS, t, getSearchTermsArray);
  const subscription = parseCustomerLicenseCenter(subscriptionRaw);
  const normalized = normalizeQuery(query);
  const pricingSummary =
    normalized.includes("kost") || normalized.includes("price") || normalized.includes("pricing")
      ? buildPublishedPricingSummary(locale, buildPricingLabels(t))
      : undefined;
  const restrictedNote = t("customerApp.companionPlatformKnowledge.permissions.restrictedAction");
  const productConcept = isProductConceptQuery(query);
  const navigationQuery = isAppNavigationQuery(query);

  if (supabase && productConcept) {
    const kcArticle = await searchCanonicalKnowledgeCenter(supabase, query, activeLocale);
    if (kcArticle) {
      const directAnswer = formatKnowledgeCenterAnswerBody(kcArticle);
      if (directAnswer) {
        return buildKnowledgeCenterResult(
          directAnswer,
          kcArticle.title,
          kcArticle.slug,
          kcArticle.score,
          t,
        );
      }
    }
  }

  if (supabase && !navigationQuery) {
    const orgOutcome = await searchApprovedOrganizationKnowledge(supabase, query);
    if (orgOutcome.kind === "hit") {
      const orgResult = buildOrganizationKnowledgeResult(orgOutcome.hit, t);
      if (orgResult) return orgResult;
    }
  }

  const liveResult = await resolveLiveToolAnswer(
    query,
    { ...options, integrationContext },
    permissionCtx,
    integrationContext,
    activeLocale,
    resolvedTenantContext,
  );
  if (liveResult) return liveResult;

  const operationalResult = resolveOperationalAnswer(
    query,
    t,
    activeLocale,
    resolvedTenantContext,
  );
  if (operationalResult) return operationalResult;

  if (navigationQuery || detectPlatformQuestionIntent(query)) {
    const navResult = await resolveNavigationCorpusAnswer(
      query,
      options,
      permissionCtx,
      corpus,
      subscription,
      pricingSummary,
      restrictedNote,
    );
    if (navResult) {
      const intent = detectPlatformQuestionIntent(query);
      if (intent === "connect-system" || navResult.matchedArticleId === "connect-system") {
        return {
          ...navResult,
          answer: enrichAnswerWithInstallDiscovery(
            navResult.answer,
            resolvedTenantContext.discovery,
            t,
          ),
        };
      }
      if (navResult.matchedArticleId === "business-packs") {
        return {
          ...navResult,
          answer: enrichAnswerWithBusinessPackContext(
            navResult.answer,
            resolvedTenantContext.businessPackContext,
            t,
          ),
        };
      }
      if (navResult.matchedArticleId === "aipify-data-access") {
        return {
          ...navResult,
          answer: enrichAnswerWithSchemaContext(
            navResult.answer,
            resolvedTenantContext.schemaContext,
            t,
          ),
        };
      }
      return navResult;
    }
  }

  if (
    subscription &&
    (normalized.includes("abonnement") ||
      normalized.includes("subscription") ||
      normalized.includes("plan"))
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

  if (productConcept || navigationQuery || normalized.includes("aipify")) {
    return { answer: buildHonestKnowledgeGapAnswer(t) };
  }

  return { answer: buildFallbackAnswer(t, permissionCtx) };
}
