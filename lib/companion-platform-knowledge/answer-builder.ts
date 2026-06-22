import type { Translator } from "@/lib/i18n/translate";
import {
  buildPublishedPricingSummary,
  enrichMySubscriptionAnswer,
  type PricingBridgeLabels,
} from "./pricing-bridge";
import { filterActionsByPermission, type PermissionContext } from "./permission-gate";
import { getPlatformRouteByKey, PLATFORM_ROUTE_REGISTRY } from "./route-registry";
import type {
  CustomerSubscriptionContext,
  PlatformCorpusEntry,
  PlatformKnowledgeAction,
  PlatformKnowledgeAnswer,
  PlatformKnowledgeSource,
  PlatformKnowledgeSourceKind,
  PlatformKnowledgeSourceRef,
  ResolvedPlatformArticle,
} from "./types";

const ACTIONS_BASE = "customerApp.companionPlatformKnowledge.actions";

export function resolvePlatformCorpus(
  entries: PlatformCorpusEntry[],
  t: Translator,
  getArray: (key: string) => string[],
): ResolvedPlatformArticle[] {
  return entries.map((entry) => ({
    id: entry.id,
    title: t(entry.titleKey),
    directAnswer: t(entry.directAnswerKey),
    explanation: t(entry.explanationKey),
    steps: entry.stepKeys.map((key) => t(key)).filter(Boolean),
    searchTerms: getArray(entry.searchTermsKey),
    category: entry.category,
    primaryRouteKey: entry.primaryRouteKey,
    actionRouteKeys: entry.actionRouteKeys,
    requiredRoles: entry.requiredRoles,
    featureKey: entry.featureKey,
    requiresCustomerContext: entry.requiresCustomerContext,
  }));
}

export function buildActionForRoute(
  routeKey: string,
  t: Translator,
): PlatformKnowledgeAction | undefined {
  const route = getPlatformRouteByKey(routeKey);
  if (!route) return undefined;
  const labelKey = `${ACTIONS_BASE}.${routeKey}`;
  const label = t(labelKey);
  const resolvedLabel = label !== labelKey ? label : t(route.titleKey);
  return {
    labelKey: label !== labelKey ? labelKey : route.titleKey,
    label: resolvedLabel,
    href: route.href,
    routeKey: route.routeKey,
  };
}

export function buildActionsForArticle(
  article: ResolvedPlatformArticle | PlatformCorpusEntry,
  t: Translator,
  ctx: PermissionContext,
): PlatformKnowledgeAction[] {
  const routeKeys = "actionRouteKeys" in article ? article.actionRouteKeys : [];
  const actions = routeKeys
    .map((key) => buildActionForRoute(key, t))
    .filter((a): a is PlatformKnowledgeAction => a !== undefined);
  return filterActionsByPermission(actions, ctx);
}

function mapSourceKind(source: PlatformKnowledgeSource): PlatformKnowledgeSourceKind {
  switch (source) {
    case "route_match":
      return "route_registry";
    case "knowledge_center":
      return "knowledge_center";
    case "customer_context":
      return "customer_context";
    default:
      return "platform_corpus";
  }
}

export function buildSourcesForAnswer(
  article: ResolvedPlatformArticle,
  source: PlatformKnowledgeSource,
  t: Translator,
): PlatformKnowledgeSourceRef[] {
  const refs: PlatformKnowledgeSourceRef[] = [
    {
      id: article.id,
      label: article.title,
      kind: mapSourceKind(source),
    },
  ];

  if (source === "knowledge_center") {
    refs.push({
      id: "knowledge-center",
      label: t("customerApp.companionPlatformKnowledge.sources.knowledgeCenter"),
      kind: "knowledge_center",
    });
  }

  if (article.primaryRouteKey) {
    const route = getPlatformRouteByKey(article.primaryRouteKey);
    if (route) {
      const routeLabel = t(route.titleKey);
      if (!refs.some((ref) => ref.id === route.routeKey)) {
        refs.push({
          id: route.routeKey,
          label: routeLabel,
          kind: "route_registry",
        });
      }
    }
  }

  return refs;
}

export function buildPlatformAnswer(
  article: ResolvedPlatformArticle,
  t: Translator,
  ctx: PermissionContext,
  options: {
    source: PlatformKnowledgeSource;
    confidence: PlatformKnowledgeAnswer["confidence"];
    subscription?: CustomerSubscriptionContext | null;
    pricingSummary?: string;
    restrictedNote?: string;
  },
): PlatformKnowledgeAnswer {
  let directAnswer = article.directAnswer;
  let status: string | undefined;

  if (article.id === "subscription-pricing" && options.pricingSummary) {
    directAnswer = `${directAnswer}\n\n${options.pricingSummary}`;
  }

  if (article.id === "my-subscription") {
    const enriched = enrichMySubscriptionAnswer(
      directAnswer,
      options.subscription ?? null,
      t("customerApp.companionPlatformKnowledge.fallback.subscriptionUnavailable"),
    );
    directAnswer = enriched.directAnswer;
    status = enriched.status;
  }

  if (options.restrictedNote && article.requiredRoles && !article.requiredRoles.includes(ctx.userRole)) {
    directAnswer = `${directAnswer}\n\n${options.restrictedNote}`;
  }

  const actions = buildActionsForArticle(article, t, ctx);
  const explanation = article.explanation || undefined;

  return {
    title: article.title,
    directAnswer,
    explanation,
    status,
    steps: article.steps,
    actions,
    sources: buildSourcesForAnswer(article, options.source, t),
    sourceId: article.id,
    source: options.source,
    confidence: options.confidence,
    showSupportEscalation: options.confidence === "low",
  };
}

export function buildFallbackAnswer(t: Translator, ctx: PermissionContext): PlatformKnowledgeAnswer {
  const actions = filterActionsByPermission(
    [
      buildActionForRoute("aipifyCompanion", t),
      buildActionForRoute("knowledgeCenter", t),
      buildActionForRoute("contactSupport", t),
    ].filter((a): a is PlatformKnowledgeAction => a !== undefined),
    ctx,
  );

  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.fallback.directAnswer"),
    explanation: t("customerApp.companionPlatformKnowledge.fallback.explanation"),
    steps: [
      t("customerApp.companionPlatformKnowledge.fallback.step1"),
      t("customerApp.companionPlatformKnowledge.fallback.step2"),
    ].filter(Boolean),
    actions,
    sources: [
      {
        id: "platform-fallback",
        label: t("customerApp.companionPlatformKnowledge.sources.platformGuide"),
        kind: "platform_corpus",
      },
    ],
    sourceId: "platform-fallback",
    source: "fallback",
    confidence: "moderate",
    showSupportEscalation: true,
  };
}

export function buildPricingLabels(t: Translator): PricingBridgeLabels {
  return {
    custom: t("customerApp.companionPlatformKnowledge.pricing.custom"),
    perMonth: t("customerApp.companionPlatformKnowledge.pricing.perMonth"),
    perMonthShort: t("customerApp.companionPlatformKnowledge.pricing.perMonthShort"),
    planStarter: t("customerApp.companionPlatformKnowledge.pricing.planStarter"),
    planProfessional: t("customerApp.companionPlatformKnowledge.pricing.planProfessional"),
    planBusiness: t("customerApp.companionPlatformKnowledge.pricing.planBusiness"),
    planEnterprise: t("customerApp.companionPlatformKnowledge.pricing.planEnterprise"),
  };
}

export function answerToLegacyArticle(answer: PlatformKnowledgeAnswer): {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  category: string;
  related_module?: string;
  related_articles: Array<{ id: string; title: string }>;
  searchText: string;
} {
  const content = [answer.directAnswer, answer.explanation ?? "", ...answer.steps].join(" ");
  return {
    id: answer.sourceId,
    title: answer.title ?? answer.sourceId,
    summary: answer.explanation ? `${answer.directAnswer}\n\n${answer.explanation}` : answer.directAnswer,
    steps: answer.steps,
    category: "platform",
    related_articles: [],
    searchText: content.toLowerCase(),
  };
}

export function verifyRouteRegistryHrefs(): string[] {
  return PLATFORM_ROUTE_REGISTRY.map((r) => r.href);
}
