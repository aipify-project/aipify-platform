import type { Translator } from "@/lib/i18n/translate";
import {
  IMPACT_LEVELS,
  RECOMMENDATION_CATEGORIES,
  RECOMMENDATION_STATUSES,
} from "./constants";
import type { PlatformDecisionCenterLabels } from "./types";

export function buildPlatformDecisionCenterLabels(t: Translator): PlatformDecisionCenterLabels {
  const p = "platform.decisionCenter";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    executiveSummary: t(`${p}.executiveSummary`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      recommendations: t(`${p}.sections.recommendations`),
      highImpact: t(`${p}.sections.highImpact`),
      risks: t(`${p}.sections.risks`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
      recommendedActions: t(`${p}.sections.recommendedActions`),
      tasks: t(`${p}.sections.tasks`),
    },
    overview: {
      recommendationsGenerated: t(`${p}.overview.recommendationsGenerated`),
      recommendationsAccepted: t(`${p}.overview.recommendationsAccepted`),
      recommendationsDeclined: t(`${p}.overview.recommendationsDeclined`),
      highImpactOpportunities: t(`${p}.overview.highImpactOpportunities`),
      risksIdentified: t(`${p}.overview.risksIdentified`),
      pendingReviews: t(`${p}.overview.pendingReviews`),
    },
    table: {
      title: t(`${p}.table.title`),
      description: t(`${p}.table.description`),
      category: t(`${p}.table.category`),
      impactLevel: t(`${p}.table.impactLevel`),
      confidence: t(`${p}.table.confidence`),
      status: t(`${p}.table.status`),
      owner: t(`${p}.table.owner`),
      generatedDate: t(`${p}.table.generatedDate`),
      actions: t(`${p}.table.actions`),
    },
    categories: Object.fromEntries(
      RECOMMENDATION_CATEGORIES.map((key) => [key, t(`${p}.categories.${key}`)])
    ) as PlatformDecisionCenterLabels["categories"],
    impactLevels: Object.fromEntries(
      IMPACT_LEVELS.map((key) => [key, t(`${p}.impactLevels.${key}`)])
    ) as PlatformDecisionCenterLabels["impactLevels"],
    statuses: Object.fromEntries(
      RECOMMENDATION_STATUSES.map((key) => [key, t(`${p}.statuses.${key}`)])
    ) as PlatformDecisionCenterLabels["statuses"],
    filters: {
      category: t(`${p}.filters.category`),
      impactLevel: t(`${p}.filters.impactLevel`),
      status: t(`${p}.filters.status`),
      owner: t(`${p}.filters.owner`),
      confidenceMin: t(`${p}.filters.confidenceMin`),
      allCategories: t(`${p}.filters.allCategories`),
      allImpactLevels: t(`${p}.filters.allImpactLevels`),
      allStatuses: t(`${p}.filters.allStatuses`),
      apply: t(`${p}.filters.apply`),
    },
    actions: {
      accept: t(`${p}.actions.accept`),
      dismiss: t(`${p}.actions.dismiss`),
      startReview: t(`${p}.actions.startReview`),
      markImplemented: t(`${p}.actions.markImplemented`),
      createTask: t(`${p}.actions.createTask`),
      assignOwner: t(`${p}.actions.assignOwner`),
      addNote: t(`${p}.actions.addNote`),
      linkRoadmap: t(`${p}.actions.linkRoadmap`),
      applying: t(`${p}.actions.applying`),
    },
    prompts: {
      owner: t(`${p}.prompts.owner`),
      note: t(`${p}.prompts.note`),
      roadmapLink: t(`${p}.prompts.roadmapLink`),
      taskTitle: t(`${p}.prompts.taskTitle`),
    },
  };
}
