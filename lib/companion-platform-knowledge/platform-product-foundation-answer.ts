import type { Translator } from "@/lib/i18n/translate";
import { buildPlatformAnswer } from "./answer-builder";
import type { PermissionContext } from "./permission-gate";
import type {
  CustomerSubscriptionContext,
  PlatformKnowledgeAction,
  PlatformSearchResult,
  ResolvedPlatformArticle,
} from "./types";

/** Growth Partners uses existing i18n keys — no new locale strings in this phase. */
export function buildGrowthPartnersFoundationResult(
  t: Translator,
  permissionCtx: PermissionContext,
): PlatformSearchResult {
  const titleKey = "customerApp.companionRelationshipIntelligence.relationshipTypes.growthPartners";
  const title = t(titleKey);
  const resolvedTitle = title !== titleKey ? title : "Growth Partners";

  const bodyKey = "customerApp.companionPlatformKnowledge.sales.partnerAttributionMetadataOnly";
  const body = t(bodyKey);
  const resolvedBody =
    body !== bodyKey
      ? body
      : "Growth Partner attribution is metadata-only — partners do not own customers.";

  const explanationKey = "customerApp.companionPlatformKnowledge.articles.aipifyOverview.explanation";
  const explanation = t(explanationKey);
  const resolvedExplanation = explanation !== explanationKey ? explanation : "";

  const article: ResolvedPlatformArticle = {
    id: "growth-partners",
    title: resolvedTitle,
    directAnswer: resolvedBody,
    explanation: resolvedExplanation,
    steps: [],
    searchTerms: [],
    category: "general",
    actionRouteKeys: [],
  };

  const answer = buildPlatformAnswer(article, t, permissionCtx, {
    source: "platform_corpus",
    confidence: "high",
  });

  const growthPartnerAction: PlatformKnowledgeAction = {
    labelKey: titleKey,
    label: resolvedTitle,
    href: "/growth-partners",
    routeKey: "growthPartners",
    variant: "primary",
  };

  return {
    matchedArticleId: "growth-partners",
    answer: {
      ...answer,
      actions: [growthPartnerAction],
    },
  };
}
