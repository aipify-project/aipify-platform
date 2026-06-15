import type { Translator } from "@/lib/i18n/translate";
import {
  EFFORT_LEVELS,
  IDEA_SOURCES,
  IMPACT_LEVELS,
  INITIATIVE_STATUSES,
  PRIORITY_LEVELS,
  RELEASE_CHANNELS,
  REQUEST_SOURCES,
  ROADMAP_CATEGORIES,
  ROADMAP_VIEWS,
} from "./constants";
import type { ProductRoadmapCenterLabels } from "./types";

export function buildProductRoadmapCenterLabels(t: Translator): ProductRoadmapCenterLabels {
  const p = "platform.productRoadmapCenter";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      views: t(`${p}.sections.views`),
      table: t(`${p}.sections.table`),
      scoring: t(`${p}.sections.scoring`),
      requests: t(`${p}.sections.requests`),
      release: t(`${p}.sections.release`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
      createIdea: t(`${p}.sections.createIdea`),
    },
    overview: {
      plannedInitiatives: t(`${p}.overview.plannedInitiatives`),
      inDevelopment: t(`${p}.overview.inDevelopment`),
      readyForRelease: t(`${p}.overview.readyForRelease`),
      customerRequested: t(`${p}.overview.customerRequested`),
      recentlyCompleted: t(`${p}.overview.recentlyCompleted`),
      deferredItems: t(`${p}.overview.deferredItems`),
    },
    table: {
      initiative: t(`${p}.table.initiative`),
      category: t(`${p}.table.category`),
      priority: t(`${p}.table.priority`),
      status: t(`${p}.table.status`),
      owner: t(`${p}.table.owner`),
      targetRelease: t(`${p}.table.targetRelease`),
      source: t(`${p}.table.source`),
      view: t(`${p}.table.view`),
      score: t(`${p}.table.score`),
      supportingRequests: t(`${p}.table.supportingRequests`),
      enterpriseRequests: t(`${p}.table.enterpriseRequests`),
      partnerRequests: t(`${p}.table.partnerRequests`),
      relatedPhases: t(`${p}.table.relatedPhases`),
      actions: t(`${p}.table.actions`),
    },
    categories: Object.fromEntries(
      ROADMAP_CATEGORIES.map((key) => [key, t(`${p}.categories.${key}`)])
    ) as ProductRoadmapCenterLabels["categories"],
    views: Object.fromEntries(
      ROADMAP_VIEWS.map((key) => [key, t(`${p}.views.${key}`)])
    ) as ProductRoadmapCenterLabels["views"],
    sources: Object.fromEntries(
      IDEA_SOURCES.map((key) => [key, t(`${p}.sources.${key}`)])
    ) as ProductRoadmapCenterLabels["sources"],
    priorities: Object.fromEntries(
      PRIORITY_LEVELS.map((key) => [key, t(`${p}.priorities.${key}`)])
    ) as ProductRoadmapCenterLabels["priorities"],
    statuses: Object.fromEntries(
      INITIATIVE_STATUSES.map((key) => [key, t(`${p}.statuses.${key}`)])
    ) as ProductRoadmapCenterLabels["statuses"],
    efforts: Object.fromEntries(
      EFFORT_LEVELS.map((key) => [key, t(`${p}.efforts.${key}`)])
    ) as ProductRoadmapCenterLabels["efforts"],
    impacts: Object.fromEntries(
      IMPACT_LEVELS.map((key) => [key, t(`${p}.impacts.${key}`)])
    ) as ProductRoadmapCenterLabels["impacts"],
    requestSources: Object.fromEntries(
      REQUEST_SOURCES.map((key) => [key, t(`${p}.requestSources.${key}`)])
    ) as ProductRoadmapCenterLabels["requestSources"],
    releaseChannels: Object.fromEntries(
      RELEASE_CHANNELS.map((key) => [key, t(`${p}.releaseChannels.${key}`)])
    ) as ProductRoadmapCenterLabels["releaseChannels"],
    scoring: {
      customerDemand: t(`${p}.scoring.customerDemand`),
      revenuePotential: t(`${p}.scoring.revenuePotential`),
      strategicAlignment: t(`${p}.scoring.strategicAlignment`),
      implementationComplexity: t(`${p}.scoring.implementationComplexity`),
      riskReduction: t(`${p}.scoring.riskReduction`),
      competitiveAdvantage: t(`${p}.scoring.competitiveAdvantage`),
      composite: t(`${p}.scoring.composite`),
    },
    filters: {
      category: t(`${p}.filters.category`),
      priority: t(`${p}.filters.priority`),
      status: t(`${p}.filters.status`),
      source: t(`${p}.filters.source`),
      view: t(`${p}.filters.view`),
      releaseWindow: t(`${p}.filters.releaseWindow`),
      allCategories: t(`${p}.filters.allCategories`),
      allPriorities: t(`${p}.filters.allPriorities`),
      allStatuses: t(`${p}.filters.allStatuses`),
      allSources: t(`${p}.filters.allSources`),
      allViews: t(`${p}.filters.allViews`),
      allWindows: t(`${p}.filters.allWindows`),
      apply: t(`${p}.filters.apply`),
    },
    actions: {
      approve: t(`${p}.actions.approve`),
      plan: t(`${p}.actions.plan`),
      startDevelopment: t(`${p}.actions.startDevelopment`),
      moveToTesting: t(`${p}.actions.moveToTesting`),
      publishRelease: t(`${p}.actions.publishRelease`),
      decline: t(`${p}.actions.decline`),
      linkRequest: t(`${p}.actions.linkRequest`),
      moveToNow: t(`${p}.actions.moveToNow`),
      moveToNext: t(`${p}.actions.moveToNext`),
      applying: t(`${p}.actions.applying`),
    },
    create: {
      title: t(`${p}.create.title`),
      description: t(`${p}.create.description`),
      submit: t(`${p}.create.submit`),
      placeholderTitle: t(`${p}.create.placeholderTitle`),
      placeholderDescription: t(`${p}.create.placeholderDescription`),
    },
  };
}
