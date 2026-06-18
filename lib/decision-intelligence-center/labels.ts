import type { Translator } from "@/lib/i18n/translate";

export function buildDecisionIntelligenceCenterLabels(t: Translator) {
  const p = "customerApp.decisionIntelligenceCenter";
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
      activeDecisions: t(`${p}.sections.activeDecisions`),
      recommendedDecisions: t(`${p}.sections.recommendedDecisions`),
      strategicReviews: t(`${p}.sections.strategicReviews`),
      riskAnalysis: t(`${p}.sections.riskAnalysis`),
      decisionHistory: t(`${p}.sections.decisionHistory`),
      outcomeTracking: t(`${p}.sections.outcomeTracking`),
    },
    workspace: {
      owner: t(`${p}.workspace.owner`),
      businessArea: t(`${p}.workspace.businessArea`),
      priority: t(`${p}.workspace.priority`),
      reasoning: t(`${p}.workspace.reasoning`),
      expectedResult: t(`${p}.workspace.expectedResult`),
      actualResult: t(`${p}.workspace.actualResult`),
      outcomeSummary: t(`${p}.workspace.outcomeSummary`),
    },
    optionAnalysis: {
      title: t(`${p}.optionAnalysis.title`),
      benefits: t(`${p}.optionAnalysis.benefits`),
      risks: t(`${p}.optionAnalysis.risks`),
      cost: t(`${p}.optionAnalysis.cost`),
      complexity: t(`${p}.optionAnalysis.complexity`),
      expectedOutcome: t(`${p}.optionAnalysis.expectedOutcome`),
    },
    executiveAdvisor: {
      title: t(`${p}.executiveAdvisor.title`),
      recommendation: t(`${p}.executiveAdvisor.recommendation`),
      reason: t(`${p}.executiveAdvisor.reason`),
      supportingEvidence: t(`${p}.executiveAdvisor.supportingEvidence`),
      confidenceLevel: t(`${p}.executiveAdvisor.confidenceLevel`),
      potentialRisks: t(`${p}.executiveAdvisor.potentialRisks`),
      empty: t(`${p}.executiveAdvisor.empty`),
    },
    briefings: {
      title: t(`${p}.briefings.title`),
      whatChanged: t(`${p}.briefings.whatChanged`),
      requiresAttention: t(`${p}.briefings.requiresAttention`),
      recommendedActions: t(`${p}.briefings.recommendedActions`),
      morning: t(`${p}.briefings.morning`),
      weekly: t(`${p}.briefings.weekly`),
      monthly: t(`${p}.briefings.monthly`),
    },
    suggestedAction: t(`${p}.suggestedAction`),
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      complete: t(`${p}.actions.complete`),
      resolve: t(`${p}.actions.resolve`),
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
      personalDecisions: t(`${p}.links.personalDecisions`),
    },
  };
}

export type DecisionIntelligenceCenterLabels = ReturnType<typeof buildDecisionIntelligenceCenterLabels>;
