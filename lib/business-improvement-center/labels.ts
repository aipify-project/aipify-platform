import type { Translator } from "@/lib/i18n/translate";

export function buildBusinessImprovementCenterLabels(t: Translator) {
  const p = "customerApp.businessImprovementCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    sections: {
      improvementOpportunities: t(`${p}.sections.improvementOpportunities`),
      recommendedActions: t(`${p}.sections.recommendedActions`),
      revenueOpportunities: t(`${p}.sections.revenueOpportunities`),
      costSavings: t(`${p}.sections.costSavings`),
      processImprovements: t(`${p}.sections.processImprovements`),
      customerExperienceImprovements: t(`${p}.sections.customerExperienceImprovements`),
      completedImprovements: t(`${p}.sections.completedImprovements`),
    },
    scoring: {
      impact: t(`${p}.scoring.impact`),
      risk: t(`${p}.scoring.risk`),
      complexity: t(`${p}.scoring.complexity`),
      priority: t(`${p}.scoring.priority`),
      low: t(`${p}.scoring.low`),
      medium: t(`${p}.scoring.medium`),
      high: t(`${p}.scoring.high`),
      critical: t(`${p}.scoring.critical`),
    },
    suggestedAction: t(`${p}.suggestedAction`),
    estimatedBenefit: t(`${p}.estimatedBenefit`),
    opportunityDiscovery: { title: t(`${p}.opportunityDiscovery.title`) },
    revenueIntelligence: {
      title: t(`${p}.revenueIntelligence.title`),
      customerCount: t(`${p}.revenueIntelligence.customerCount`),
    },
    costOptimization: {
      title: t(`${p}.costOptimization.title`),
      potentialSavings: t(`${p}.costOptimization.potentialSavings`),
    },
    processOptimization: {
      title: t(`${p}.processOptimization.title`),
      timeReduction: t(`${p}.processOptimization.timeReduction`),
    },
    customerExperience: {
      title: t(`${p}.customerExperience.title`),
      benchmark: t(`${p}.customerExperience.benchmark`),
    },
    improvementPlans: {
      title: t(`${p}.improvementPlans.title`),
      problem: t(`${p}.improvementPlans.problem`),
      cause: t(`${p}.improvementPlans.cause`),
      recommendedSolution: t(`${p}.improvementPlans.recommendedSolution`),
      expectedOutcome: t(`${p}.improvementPlans.expectedOutcome`),
    },
    executiveDashboard: {
      title: t(`${p}.executiveDashboard.title`),
      totalOpportunities: t(`${p}.executiveDashboard.totalOpportunities`),
      estimatedRevenueGain: t(`${p}.executiveDashboard.estimatedRevenueGain`),
      estimatedCostSavings: t(`${p}.executiveDashboard.estimatedCostSavings`),
      completedImprovements: t(`${p}.executiveDashboard.completedImprovements`),
      pendingImprovements: t(`${p}.executiveDashboard.pendingImprovements`),
    },
    companionAdvisor: {
      title: t(`${p}.companionAdvisor.title`),
      reason: t(`${p}.companionAdvisor.reason`),
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      approve: t(`${p}.actions.approve`),
    },
    status: {
      completed: t(`${p}.status.completed`),
      notAllowed: t(`${p}.status.notAllowed`),
      requiresAttention: t(`${p}.status.requiresAttention`),
      information: t(`${p}.status.information`),
      restricted: t(`${p}.status.restricted`),
      verified: t(`${p}.status.verified`),
      waiting: t(`${p}.status.waiting`),
    },
    links: {
      legacyEngine: t(`${p}.links.legacyEngine`),
      executiveImprovement: t(`${p}.links.executiveImprovement`),
    },
  };
}

export type BusinessImprovementCenterLabels = ReturnType<typeof buildBusinessImprovementCenterLabels>;

export function getScoreLabel(level: string, labels: BusinessImprovementCenterLabels["scoring"]): string {
  if (level === "low") return labels.low;
  if (level === "high") return labels.high;
  if (level === "critical") return labels.critical;
  return labels.medium;
}
