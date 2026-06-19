import type { Translator } from "@/lib/i18n/translate";
import type { OrganizationalLearningLabels, OrganizationalLearningTab } from "./types";
import { ORGANIZATIONAL_LEARNING_TABS } from "./constants";

export function buildOrganizationalLearningLabels(t: Translator): OrganizationalLearningLabels {
  const p = "organizationalLearningOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      ORGANIZATIONAL_LEARNING_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<OrganizationalLearningTab, string>,
    overview: {
      totalLessons: t(`${p}.overview.totalLessons`),
      activeImprovements: t(`${p}.overview.activeImprovements`),
      successStories: t(`${p}.overview.successStories`),
      reviewsCompleted: t(`${p}.overview.reviewsCompleted`),
      patternsDetected: t(`${p}.overview.patternsDetected`),
      opportunities: t(`${p}.overview.opportunities`),
      libraryItems: t(`${p}.overview.libraryItems`),
      avgLearningScore: t(`${p}.overview.avgLearningScore`),
    },
    sections: {
      executiveDashboard: t(`${p}.sections.executiveDashboard`),
      departmentScores: t(`${p}.sections.departmentScores`),
      learningLibrary: t(`${p}.sections.learningLibrary`),
      repeatedMistakes: t(`${p}.sections.repeatedMistakes`),
      improvementOpportunities: t(`${p}.sections.improvementOpportunities`),
      businessPacks: t(`${p}.sections.businessPacks`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    actions: {
      refreshLearning: t(`${p}.actions.refreshLearning`),
      generateLearningReport: t(`${p}.actions.generateLearningReport`),
      submitImprovement: t(`${p}.actions.submitImprovement`),
      completeReview: t(`${p}.actions.completeReview`),
    },
    learningStatus: {
      excellent: t(`${p}.learningStatus.excellent`),
      improving: t(`${p}.learningStatus.improving`),
      stagnating: t(`${p}.learningStatus.stagnating`),
      improvement_needed: t(`${p}.learningStatus.improvement_needed`),
    },
    pipelineStage: {
      suggestion: t(`${p}.pipelineStage.suggestion`),
      review: t(`${p}.pipelineStage.review`),
      approval: t(`${p}.pipelineStage.approval`),
      implementation: t(`${p}.pipelineStage.implementation`),
      outcome: t(`${p}.pipelineStage.outcome`),
      validation: t(`${p}.pipelineStage.validation`),
    },
  };
}
