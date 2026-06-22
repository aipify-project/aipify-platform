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
import { finalizeCompanionSearchResult } from "./companion-output-pipeline";
import { applyCompanionModelSynthesis } from "./companion-model-synthesis";
import { matchConfirmedMemoryQuery } from "./companion-memory-query-match";
import {
  buildConfirmedMemoryAnswer,
  enrichAnswerWithMemoryContext,
} from "./memory-answer";
import {
  hasCompanionActionIntent,
  matchCompanionActionQuery,
  shouldPreferReadPath,
} from "./companion-action-query-match";
import {
  buildCompanionActionPlan,
  prepareCompanionActionApproval,
} from "./companion-action-plan";
import { evaluateCompanionActionSafety } from "./companion-action-governance";
import {
  buildCompanionActionApprovalRequiredAnswer,
  buildCompanionActionBlockedAnswer,
  buildCompanionActionReadyAnswer,
  buildCompanionActionUnavailableAnswer,
} from "./action-answer";
import {
  executeCompanionAction,
  shouldAttemptCompanionExecution,
} from "./companion-action-execute";
import { buildCompanionExecutionAnswer } from "./execution-answer";
import { companionActionExecutionAllowedInPhase11 } from "./companion-action-governance";
import {
  buildCreativeProviderDiscoveryAnswer,
  buildCreativeProviderUnavailableAnswer,
  hasCreativeProviderIntent,
  matchCreativeProviderQuery,
} from "./creative-answer";
import {
  buildMediaPlaybackUnavailableAnswer,
  buildMediaProviderDiscoveryAnswer,
  buildMediaProviderUnavailableAnswer,
  hasMediaProviderIntent,
  matchMediaProviderQuery,
} from "./media-answer";
import {
  buildBlockedServicesOperationAnswer,
  buildExternalServicesUnavailableAnswer,
  buildServicesProviderDiscoveryAnswer,
  buildServicesProviderUnavailableAnswer,
  hasBlockedServicesOperationIntent,
  hasExternalServicesAdapterIntent,
  hasServicesProviderIntent,
  matchServicesProviderQuery,
} from "./services-answer";
import {
  buildBlockedSupportOperationAnswer,
  buildExternalSupportUnavailableAnswer,
  buildSupportProviderDiscoveryAnswer,
  buildSupportProviderUnavailableAnswer,
  hasBlockedSupportOperationIntent,
  hasExternalSupportAdapterIntent,
  hasSupportProviderIntent,
  matchSupportProviderQuery,
} from "./support-answer";
import {
  buildBlockedIndustryPackOperationAnswer,
  buildExternalIndustryPackUnavailableAnswer,
  buildIndustryPackProviderDiscoveryAnswer,
  buildIndustryPackProviderUnavailableAnswer,
  hasBlockedIndustryPackOperationIntent,
  hasExternalIndustryPackAdapterIntent,
  hasIndustryPackProviderIntent,
  matchIndustryPackProviderQuery,
} from "./industry-pack-answer";
import {
  buildBlockedHostsOperationAnswer,
  buildExternalHostsUnavailableAnswer,
  buildHostsProviderDiscoveryAnswer,
  buildHostsProviderUnavailableAnswer,
  hasBlockedHostsOperationIntent,
  hasExternalHostsAdapterIntent,
  hasHostsProviderIntent,
  matchHostsProviderQuery,
} from "./hosts-answer";
import {
  buildBlockedHrOperationAnswer,
  buildExternalHrUnavailableAnswer,
  buildHrProviderDiscoveryAnswer,
  buildHrProviderUnavailableAnswer,
  hasBlockedHrOperationIntent,
  hasExternalHrAdapterIntent,
  hasHrProviderIntent,
  matchHrProviderQuery,
} from "./hr-answer";
import {
  buildBlockedCommerceOperationAnswer,
  buildCommerceProviderDiscoveryAnswer,
  buildCommerceProviderUnavailableAnswer,
  buildExternalCommerceUnavailableAnswer,
  hasBlockedCommerceOperationIntent,
  hasCommerceProviderIntent,
  hasExternalCommerceAdapterIntent,
  matchCommerceProviderQuery,
} from "./commerce-answer";
import {
  buildExternalWorkspaceUnavailableAnswer,
  buildWorkspaceProviderDiscoveryAnswer,
  buildWorkspaceProviderUnavailableAnswer,
  hasExternalWorkspaceConnectorIntent,
  hasWorkspaceProviderIntent,
  matchWorkspaceProviderQuery,
} from "./workspace-answer";
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

function resolveConfirmedMemoryAnswer(
  query: string,
  t: Translator,
  activeLocale: CustomerActiveLocale,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (tenantContext.memoryContext.permission_status === "denied") return null;

  const memoryMatch = matchConfirmedMemoryQuery(query, tenantContext);
  if (!memoryMatch) return null;

  return {
    answer: buildConfirmedMemoryAnswer(memoryMatch, tenantContext.memoryContext, t, activeLocale),
  };
}

async function resolveApprovedOrganizationKnowledgeAnswer(
  query: string,
  supabase: SupabaseClient,
  t: Translator,
  navigationQuery: boolean,
): Promise<PlatformSearchResult | null> {
  if (navigationQuery) return null;

  const orgOutcome = await searchApprovedOrganizationKnowledge(supabase, query);
  if (orgOutcome.kind === "hit") {
    return buildOrganizationKnowledgeResult(orgOutcome.hit, t);
  }
  return null;
}

async function resolveCompanionActionAnswer(
  query: string,
  options: PlatformSearchOptions,
  activeLocale: CustomerActiveLocale,
  tenantContext: CompanionTenantContext,
): Promise<PlatformSearchResult | null> {
  const { t, supabase } = options;
  const actionMatch = matchCompanionActionQuery(query, tenantContext);

  if (shouldPreferReadPath(query, actionMatch)) {
    return null;
  }

  if (!actionMatch) {
    if (hasCompanionActionIntent(query)) {
      return {
        answer: buildCompanionActionUnavailableAnswer(t, tenantContext.actionContext),
      };
    }
    return null;
  }

  const { definition } = actionMatch;
  const permission =
    !definition.required_permission ||
    tenantContext.effectivePermissions.includes(definition.required_permission);

  const safety = evaluateCompanionActionSafety(definition, tenantContext.actionContext, {
    hasPermission: permission,
    schemaValid: true,
    providerVerified:
      definition.source === "companion_policy" ||
      !definition.provider_key ||
      definition.provider_key === "schema" ||
      tenantContext.connectedProviders.includes(definition.provider_key),
  });

  if (safety.blocked && safety.reason) {
    return {
      answer: buildCompanionActionBlockedAnswer(
        safety.reason,
        definition,
        tenantContext.actionContext,
        t,
      ),
    };
  }

  let plan = buildCompanionActionPlan({
    definition,
    actionContext: tenantContext.actionContext,
    organizationId: tenantContext.organizationId,
    requestedBy: tenantContext.identityContext.preferred_name,
    connectedProviders: tenantContext.connectedProviders,
    effectivePermissions: tenantContext.effectivePermissions,
  });

  const explanation = t("customerApp.companionPlatformKnowledge.actions.planExplanation").replace(
    "{actionId}",
    definition.action_id,
  );

  if (supabase && plan.approval_status === "pending") {
    plan = await prepareCompanionActionApproval(supabase, plan, definition, explanation);
  }

  if (
    companionActionExecutionAllowedInPhase11() &&
    shouldAttemptCompanionExecution(query, plan)
  ) {
    const execution = await executeCompanionAction({
      query,
      definition,
      plan,
      actionContext: tenantContext.actionContext,
      hasPermission: permission,
      schemaValid: true,
      providerVerified:
        definition.source === "companion_policy" ||
        !definition.provider_key ||
        definition.provider_key === "schema" ||
        tenantContext.connectedProviders.includes(definition.provider_key),
      supabase,
    });

    return {
      answer: buildCompanionExecutionAnswer(
        definition,
        execution,
        tenantContext.actionContext,
        t,
        activeLocale,
      ),
    };
  }

  if (plan.approval_status === "pending") {
    return {
      answer: buildCompanionActionApprovalRequiredAnswer(
        definition,
        plan,
        tenantContext.actionContext,
        t,
        activeLocale,
      ),
    };
  }

  if (plan.approval_status === "not_required") {
    return {
      answer: buildCompanionActionReadyAnswer(
        definition,
        plan,
        tenantContext.actionContext,
        t,
        activeLocale,
      ),
    };
  }

  return {
    answer: buildCompanionActionBlockedAnswer(
      safety.reason ?? "write_boundary",
      definition,
      tenantContext.actionContext,
      t,
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

function hasRegisteredPlaybackCapabilities(tenantContext: CompanionTenantContext): boolean {
  return tenantContext.mediaContext.capabilities.some(
    (capability) =>
      capability.capability_key.startsWith("playback.") ||
      capability.capability_key.startsWith("playlist."),
  );
}

function resolveMediaProviderAnswer(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (!hasMediaProviderIntent(query)) {
    return null;
  }

  if (tenantContext.mediaContext.permission_denied) {
    return {
      answer: buildMediaProviderUnavailableAnswer(t, tenantContext.mediaContext),
    };
  }

  const normalized = query.trim().toLowerCase();
  const playbackIntent = /\b(playback|playlist|play|pause|skip|volume|speaker|audio)\b/i.test(
    normalized,
  );
  const deviceIntent = /\b(device|devices|connected)\b/i.test(normalized);

  if (playbackIntent && !deviceIntent && !hasRegisteredPlaybackCapabilities(tenantContext)) {
    return {
      answer: buildMediaPlaybackUnavailableAnswer(t),
    };
  }

  const match = matchMediaProviderQuery(query, tenantContext);
  if (!match) {
    return {
      answer: buildMediaProviderUnavailableAnswer(t, tenantContext.mediaContext),
    };
  }

  return {
    answer: buildMediaProviderDiscoveryAnswer(match, tenantContext.mediaContext, t),
  };
}

function resolveServicesProviderAnswer(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (hasBlockedServicesOperationIntent(query)) {
    return {
      answer: buildBlockedServicesOperationAnswer(t),
    };
  }

  if (!hasServicesProviderIntent(query)) {
    return null;
  }

  if (tenantContext.servicesContext.permission_denied) {
    return {
      answer: buildServicesProviderUnavailableAnswer(t, tenantContext.servicesContext),
    };
  }

  if (hasExternalServicesAdapterIntent(query)) {
    return {
      answer: buildExternalServicesUnavailableAnswer(t),
    };
  }

  const match = matchServicesProviderQuery(query, tenantContext);
  if (!match) {
    return {
      answer: buildServicesProviderUnavailableAnswer(t, tenantContext.servicesContext),
    };
  }

  return {
    answer: buildServicesProviderDiscoveryAnswer(match, tenantContext.servicesContext, t),
  };
}

function resolveIndustryPackProviderAnswer(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (hasBlockedIndustryPackOperationIntent(query)) {
    return {
      answer: buildBlockedIndustryPackOperationAnswer(t),
    };
  }

  if (!hasIndustryPackProviderIntent(query)) {
    return null;
  }

  if (tenantContext.industryPackContext.permission_denied) {
    return {
      answer: buildIndustryPackProviderUnavailableAnswer(t, tenantContext.industryPackContext),
    };
  }

  if (hasExternalIndustryPackAdapterIntent(query)) {
    return {
      answer: buildExternalIndustryPackUnavailableAnswer(t),
    };
  }

  const match = matchIndustryPackProviderQuery(query, tenantContext);
  if (!match) {
    return {
      answer: buildIndustryPackProviderUnavailableAnswer(t, tenantContext.industryPackContext),
    };
  }

  return {
    answer: buildIndustryPackProviderDiscoveryAnswer(match, tenantContext.industryPackContext, t),
  };
}

function resolveHostsProviderAnswer(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (hasBlockedHostsOperationIntent(query)) {
    return {
      answer: buildBlockedHostsOperationAnswer(t),
    };
  }

  if (!hasHostsProviderIntent(query)) {
    return null;
  }

  if (tenantContext.hostsContext.permission_denied) {
    return {
      answer: buildHostsProviderUnavailableAnswer(t, tenantContext.hostsContext),
    };
  }

  if (hasExternalHostsAdapterIntent(query)) {
    return {
      answer: buildExternalHostsUnavailableAnswer(t),
    };
  }

  const match = matchHostsProviderQuery(query, tenantContext);
  if (!match) {
    return {
      answer: buildHostsProviderUnavailableAnswer(t, tenantContext.hostsContext),
    };
  }

  return {
    answer: buildHostsProviderDiscoveryAnswer(match, tenantContext.hostsContext, t),
  };
}

function resolveHrProviderAnswer(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (hasBlockedHrOperationIntent(query)) {
    return {
      answer: buildBlockedHrOperationAnswer(t),
    };
  }

  if (!hasHrProviderIntent(query)) {
    return null;
  }

  if (tenantContext.hrContext.permission_denied) {
    return {
      answer: buildHrProviderUnavailableAnswer(t, tenantContext.hrContext),
    };
  }

  if (hasExternalHrAdapterIntent(query)) {
    return {
      answer: buildExternalHrUnavailableAnswer(t),
    };
  }

  const match = matchHrProviderQuery(query, tenantContext);
  if (!match) {
    return {
      answer: buildHrProviderUnavailableAnswer(t, tenantContext.hrContext),
    };
  }

  return {
    answer: buildHrProviderDiscoveryAnswer(match, tenantContext.hrContext, t),
  };
}

function resolveSupportProviderAnswer(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (hasBlockedSupportOperationIntent(query)) {
    return {
      answer: buildBlockedSupportOperationAnswer(t),
    };
  }

  if (!hasSupportProviderIntent(query)) {
    return null;
  }

  if (tenantContext.supportContext.permission_denied) {
    return {
      answer: buildSupportProviderUnavailableAnswer(t, tenantContext.supportContext),
    };
  }

  if (hasExternalSupportAdapterIntent(query)) {
    return {
      answer: buildExternalSupportUnavailableAnswer(t),
    };
  }

  const match = matchSupportProviderQuery(query, tenantContext);
  if (!match) {
    return {
      answer: buildSupportProviderUnavailableAnswer(t, tenantContext.supportContext),
    };
  }

  return {
    answer: buildSupportProviderDiscoveryAnswer(match, tenantContext.supportContext, t),
  };
}

function resolveCommerceProviderAnswer(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (hasBlockedCommerceOperationIntent(query)) {
    return {
      answer: buildBlockedCommerceOperationAnswer(t),
    };
  }

  if (!hasCommerceProviderIntent(query)) {
    return null;
  }

  if (tenantContext.commerceContext.permission_denied) {
    return {
      answer: buildCommerceProviderUnavailableAnswer(t, tenantContext.commerceContext),
    };
  }

  if (hasExternalCommerceAdapterIntent(query)) {
    return {
      answer: buildExternalCommerceUnavailableAnswer(t),
    };
  }

  const match = matchCommerceProviderQuery(query, tenantContext);
  if (!match) {
    return {
      answer: buildCommerceProviderUnavailableAnswer(t, tenantContext.commerceContext),
    };
  }

  return {
    answer: buildCommerceProviderDiscoveryAnswer(match, tenantContext.commerceContext, t),
  };
}

function resolveWorkspaceProviderAnswer(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (!hasWorkspaceProviderIntent(query)) {
    return null;
  }

  if (tenantContext.workspaceContext.permission_denied) {
    return {
      answer: buildWorkspaceProviderUnavailableAnswer(t, tenantContext.workspaceContext),
    };
  }

  if (hasExternalWorkspaceConnectorIntent(query)) {
    return {
      answer: buildExternalWorkspaceUnavailableAnswer(t),
    };
  }

  const match = matchWorkspaceProviderQuery(query, tenantContext);
  if (!match) {
    return {
      answer: buildWorkspaceProviderUnavailableAnswer(t, tenantContext.workspaceContext),
    };
  }

  return {
    answer: buildWorkspaceProviderDiscoveryAnswer(match, tenantContext.workspaceContext, t),
  };
}

function resolveCreativeProviderAnswer(
  query: string,
  t: Translator,
  tenantContext: CompanionTenantContext,
): PlatformSearchResult | null {
  if (!hasCreativeProviderIntent(query)) {
    return null;
  }

  if (tenantContext.creativeContext.permission_denied) {
    return {
      answer: buildCreativeProviderUnavailableAnswer(t, tenantContext.creativeContext),
    };
  }

  const match = matchCreativeProviderQuery(query, tenantContext);
  if (!match) {
    return {
      answer: buildCreativeProviderUnavailableAnswer(t, tenantContext.creativeContext),
    };
  }

  return {
    answer: buildCreativeProviderDiscoveryAnswer(
      match,
      tenantContext.creativeContext,
      t,
    ),
  };
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
  const finalize = (
    result: PlatformSearchResult,
    options?: { liveAnswer?: boolean; skipMemoryEnrichment?: boolean },
  ) => {
    const enrichedAnswer =
      options?.skipMemoryEnrichment
        ? result.answer
        : enrichAnswerWithMemoryContext(
            result.answer,
            query,
            resolvedTenantContext.memoryContext,
            t,
            { liveAnswer: options?.liveAnswer },
          );

    return finalizeCompanionSearchResult(
      applyCompanionModelSynthesis({
        result: { ...result, answer: enrichedAnswer },
        query,
        tenantContext: resolvedTenantContext,
        locale: activeLocale,
        t,
        skipSynthesis: options?.skipMemoryEnrichment,
        liveAnswer: options?.liveAnswer,
      }),
      resolvedTenantContext.identityContext,
      {
        locale: activeLocale,
        userName: resolvedTenantContext.identityContext.preferred_name,
        context: result.answer.source,
      },
    );
  };

  if (supabase && productConcept) {
    const kcArticle = await searchCanonicalKnowledgeCenter(supabase, query, activeLocale);
    if (kcArticle) {
      const directAnswer = formatKnowledgeCenterAnswerBody(kcArticle);
      if (directAnswer) {
        return finalize(
          buildKnowledgeCenterResult(
            directAnswer,
            kcArticle.title,
            kcArticle.slug,
            kcArticle.score,
            t,
          ),
        );
      }
    }
  }

  const actionResult = await resolveCompanionActionAnswer(
    query,
    options,
    activeLocale,
    resolvedTenantContext,
  );
  if (actionResult) return finalize(actionResult, { skipMemoryEnrichment: true });

  const mediaResult = resolveMediaProviderAnswer(query, t, resolvedTenantContext);
  if (mediaResult) return finalize(mediaResult);

  const servicesResult = resolveServicesProviderAnswer(query, t, resolvedTenantContext);
  if (servicesResult) return finalize(servicesResult);

  const industryPackResult = resolveIndustryPackProviderAnswer(query, t, resolvedTenantContext);
  if (industryPackResult) return finalize(industryPackResult);

  const hostsResult = resolveHostsProviderAnswer(query, t, resolvedTenantContext);
  if (hostsResult) return finalize(hostsResult);

  const hrResult = resolveHrProviderAnswer(query, t, resolvedTenantContext);
  if (hrResult) return finalize(hrResult);

  const supportResult = resolveSupportProviderAnswer(query, t, resolvedTenantContext);
  if (supportResult) return finalize(supportResult);

  const commerceResult = resolveCommerceProviderAnswer(query, t, resolvedTenantContext);
  if (commerceResult) return finalize(commerceResult);

  const workspaceResult = resolveWorkspaceProviderAnswer(query, t, resolvedTenantContext);
  if (workspaceResult) return finalize(workspaceResult);

  const creativeResult = resolveCreativeProviderAnswer(
    query,
    t,
    resolvedTenantContext,
  );
  if (creativeResult) return finalize(creativeResult);

  const liveResult = await resolveLiveToolAnswer(
    query,
    { ...options, integrationContext },
    permissionCtx,
    integrationContext,
    activeLocale,
    resolvedTenantContext,
  );
  if (liveResult) return finalize(liveResult, { liveAnswer: true });

  const confirmedMemoryResult = resolveConfirmedMemoryAnswer(
    query,
    t,
    activeLocale,
    resolvedTenantContext,
  );
  if (confirmedMemoryResult) return finalize(confirmedMemoryResult);

  if (supabase && !navigationQuery) {
    const approvedOrgResult = await resolveApprovedOrganizationKnowledgeAnswer(
      query,
      supabase,
      t,
      navigationQuery,
    );
    if (approvedOrgResult) return finalize(approvedOrgResult);
  }

  const operationalResult = resolveOperationalAnswer(
    query,
    t,
    activeLocale,
    resolvedTenantContext,
  );
  if (operationalResult) return finalize(operationalResult);

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
        return finalize({
          ...navResult,
          answer: enrichAnswerWithInstallDiscovery(
            navResult.answer,
            resolvedTenantContext.discovery,
            t,
          ),
        });
      }
      if (navResult.matchedArticleId === "business-packs") {
        return finalize({
          ...navResult,
          answer: enrichAnswerWithBusinessPackContext(
            navResult.answer,
            resolvedTenantContext.businessPackContext,
            t,
          ),
        });
      }
      if (navResult.matchedArticleId === "aipify-data-access") {
        return finalize({
          ...navResult,
          answer: enrichAnswerWithSchemaContext(
            navResult.answer,
            resolvedTenantContext.schemaContext,
            t,
          ),
        });
      }
      return finalize(navResult);
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
      return finalize({
        matchedArticleId: "my-subscription",
        answer: buildPlatformAnswer(mySub, t, permissionCtx, {
          source: "customer_context",
          confidence: "high",
          subscription,
          restrictedNote,
        }),
      });
    }
  }

  if (productConcept || navigationQuery || normalized.includes("aipify")) {
    return finalize({ answer: buildHonestKnowledgeGapAnswer(t) });
  }

  return finalize({ answer: buildFallbackAnswer(t, permissionCtx) });
}
