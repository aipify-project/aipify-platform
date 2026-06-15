import type { Translator } from "@/lib/i18n/translate";
import {
  APPROVAL_ROLES,
  GAP_TYPES,
  HEALTH_STATUSES,
  KNOWLEDGE_SOURCES,
  LOCALES,
  SUGGESTION_TYPES,
  TRANSLATION_STATUSES,
  WORKFLOW_STATUSES,
} from "./constants";
import type { KnowledgeEvolutionCenterLabels } from "./types";

export function buildKnowledgeEvolutionCenterLabels(t: Translator): KnowledgeEvolutionCenterLabels {
  const p = "platform.knowledgeEvolutionCenter";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      articles: t(`${p}.sections.articles`),
      gaps: t(`${p}.sections.gaps`),
      suggestions: t(`${p}.sections.suggestions`),
      recommendations: t(`${p}.sections.recommendations`),
      analytics: t(`${p}.sections.analytics`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
      localizations: t(`${p}.sections.localizations`),
      createArticle: t(`${p}.sections.createArticle`),
    },
    overview: {
      knowledgeArticles: t(`${p}.overview.knowledgeArticles`),
      suggestedImprovements: t(`${p}.overview.suggestedImprovements`),
      pendingReviews: t(`${p}.overview.pendingReviews`),
      recentlyUpdated: t(`${p}.overview.recentlyUpdated`),
      knowledgeGaps: t(`${p}.overview.knowledgeGaps`),
      learningOpportunities: t(`${p}.overview.learningOpportunities`),
    },
    table: {
      title: t(`${p}.table.title`),
      source: t(`${p}.table.source`),
      healthScore: t(`${p}.table.healthScore`),
      healthStatus: t(`${p}.table.healthStatus`),
      workflowStatus: t(`${p}.table.workflowStatus`),
      owner: t(`${p}.table.owner`),
      usage: t(`${p}.table.usage`),
      helpfulness: t(`${p}.table.helpfulness`),
      topic: t(`${p}.table.topic`),
      occurrences: t(`${p}.table.occurrences`),
      message: t(`${p}.table.message`),
      priority: t(`${p}.table.priority`),
      views: t(`${p}.table.views`),
      rating: t(`${p}.table.rating`),
      resolutionRate: t(`${p}.table.resolutionRate`),
    },
    sources: Object.fromEntries(
      KNOWLEDGE_SOURCES.map((key) => [key, t(`${p}.sources.${key}`)])
    ) as KnowledgeEvolutionCenterLabels["sources"],
    gapTypes: Object.fromEntries(
      GAP_TYPES.map((key) => [key, t(`${p}.gapTypes.${key}`)])
    ) as KnowledgeEvolutionCenterLabels["gapTypes"],
    suggestionTypes: Object.fromEntries(
      SUGGESTION_TYPES.map((key) => [key, t(`${p}.suggestionTypes.${key}`)])
    ) as KnowledgeEvolutionCenterLabels["suggestionTypes"],
    workflowStatuses: Object.fromEntries(
      WORKFLOW_STATUSES.map((key) => [key, t(`${p}.workflowStatuses.${key}`)])
    ) as KnowledgeEvolutionCenterLabels["workflowStatuses"],
    healthStatuses: Object.fromEntries(
      HEALTH_STATUSES.map((key) => [key, t(`${p}.healthStatuses.${key}`)])
    ) as KnowledgeEvolutionCenterLabels["healthStatuses"],
    approvalRoles: Object.fromEntries(
      APPROVAL_ROLES.map((key) => [key, t(`${p}.approvalRoles.${key}`)])
    ) as KnowledgeEvolutionCenterLabels["approvalRoles"],
    locales: Object.fromEntries(
      LOCALES.map((key) => [key, t(`${p}.locales.${key}`)])
    ) as KnowledgeEvolutionCenterLabels["locales"],
    translationStatuses: Object.fromEntries(
      TRANSLATION_STATUSES.map((key) => [key, t(`${p}.translationStatuses.${key}`)])
    ) as KnowledgeEvolutionCenterLabels["translationStatuses"],
    filters: {
      healthStatus: t(`${p}.filters.healthStatus`),
      workflowStatus: t(`${p}.filters.workflowStatus`),
      source: t(`${p}.filters.source`),
      locale: t(`${p}.filters.locale`),
      allHealth: t(`${p}.filters.allHealth`),
      allStatuses: t(`${p}.filters.allStatuses`),
      allSources: t(`${p}.filters.allSources`),
      allLocales: t(`${p}.filters.allLocales`),
      apply: t(`${p}.filters.apply`),
    },
    analytics: {
      mostViewed: t(`${p}.analytics.mostViewed`),
      highestRated: t(`${p}.analytics.highestRated`),
      lowestRated: t(`${p}.analytics.lowestRated`),
      mostRequested: t(`${p}.analytics.mostRequested`),
      resolutionContribution: t(`${p}.analytics.resolutionContribution`),
    },
    actions: {
      approve: t(`${p}.actions.approve`),
      publish: t(`${p}.actions.publish`),
      archive: t(`${p}.actions.archive`),
      submitReview: t(`${p}.actions.submitReview`),
      accept: t(`${p}.actions.accept`),
      decline: t(`${p}.actions.decline`),
      resolveGap: t(`${p}.actions.resolveGap`),
      applying: t(`${p}.actions.applying`),
    },
    create: {
      title: t(`${p}.create.title`),
      summary: t(`${p}.create.summary`),
      submit: t(`${p}.create.submit`),
      placeholderTitle: t(`${p}.create.placeholderTitle`),
      placeholderSummary: t(`${p}.create.placeholderSummary`),
    },
  };
}
