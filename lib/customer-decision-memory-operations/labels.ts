import type { Translator } from "@/lib/i18n/translate";
import type { DecisionMemoryLabels, DecisionMemoryTab } from "./types";
import { DECISION_MEMORY_TABS } from "./constants";

export function buildDecisionMemoryLabels(t: Translator): DecisionMemoryLabels {
  const p = "decisionMemoryOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      DECISION_MEMORY_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<DecisionMemoryTab, string>,
    overview: {
      healthScore: t(`${p}.overview.healthScore`),
      healthStatus: t(`${p}.overview.healthStatus`),
      totalDecisions: t(`${p}.overview.totalDecisions`),
      pendingDecisions: t(`${p}.overview.pendingDecisions`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      reviewsDue: t(`${p}.overview.reviewsDue`),
      patternsActive: t(`${p}.overview.patternsActive`),
      successfulOutcomes: t(`${p}.overview.successfulOutcomes`),
    },
    sections: {
      executiveBriefings: t(`${p}.sections.executiveBriefings`),
      patterns: t(`${p}.sections.patterns`),
      knowledgeBase: t(`${p}.sections.knowledgeBase`),
      businessPacks: t(`${p}.sections.businessPacks`),
      decisionHealth: t(`${p}.sections.decisionHealth`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    actions: {
      refreshDecisions: t(`${p}.actions.refreshDecisions`),
      generateBriefing: t(`${p}.actions.generateBriefing`),
      approveDecision: t(`${p}.actions.approveDecision`),
      completeReview: t(`${p}.actions.completeReview`),
    },
    healthStatus: {
      excellent: t(`${p}.healthStatus.excellent`),
      healthy: t(`${p}.healthStatus.healthy`),
      needs_review: t(`${p}.healthStatus.needs_review`),
      decision_risk: t(`${p}.healthStatus.decision_risk`),
    },
    successLevel: {
      successful: t(`${p}.successLevel.successful`),
      partially_successful: t(`${p}.successLevel.partially_successful`),
      needs_review: t(`${p}.successLevel.needs_review`),
      unsuccessful: t(`${p}.successLevel.unsuccessful`),
      pending: t(`${p}.successLevel.pending`),
    },
    reviewStatus: {
      scheduled: t(`${p}.reviewStatus.scheduled`),
      due: t(`${p}.reviewStatus.due`),
      completed: t(`${p}.reviewStatus.completed`),
      overdue: t(`${p}.reviewStatus.overdue`),
      skipped: t(`${p}.reviewStatus.skipped`),
    },
  };
}
