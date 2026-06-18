import type { Translator } from "@/lib/i18n/translate";

export function buildEconomicIntelligenceCenterLabels(t: Translator) {
  const p = "customerApp.economicIntelligenceCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    source: t(`${p}.source`),
    date: t(`${p}.date`),
    confidence: t(`${p}.confidence`),
    impact: t(`${p}.impact`),
    evidence: t(`${p}.evidence`),
    reasoning: t(`${p}.reasoning`),
    preparation: t(`${p}.preparation`),
    potentialImpact: t(`${p}.potentialImpact`),
    sections: {
      economicOverview: t(`${p}.sections.economicOverview`),
      inflation: t(`${p}.sections.inflation`),
      interestRates: t(`${p}.sections.interestRates`),
      employment: t(`${p}.sections.employment`),
      consumerTrends: t(`${p}.sections.consumerTrends`),
      businessClimate: t(`${p}.sections.businessClimate`),
      economicRisks: t(`${p}.sections.economicRisks`),
      economicOpportunities: t(`${p}.sections.economicOpportunities`),
    },
    economicMonitoringEngine: { title: t(`${p}.economicMonitoringEngine.title`) },
    regionalEconomicIntelligence: { title: t(`${p}.regionalEconomicIntelligence.title`) },
    businessImpactEngine: { title: t(`${p}.businessImpactEngine.title`) },
    consumerSpendingIntelligence: { title: t(`${p}.consumerSpendingIntelligence.title`) },
    hiringWorkforceIntelligence: { title: t(`${p}.hiringWorkforceIntelligence.title`) },
    economicOpportunityEngine: { title: t(`${p}.economicOpportunityEngine.title`) },
    executiveEconomicDashboard: { title: t(`${p}.executiveEconomicDashboard.title`) },
    companionAdvisor: { title: t(`${p}.companionAdvisor.title`), evidence: t(`${p}.companionAdvisor.evidence`) },
    scenarioModeling: { title: t(`${p}.scenarioModeling.title`) },
    governanceControls: {
      title: t(`${p}.governanceControls.title`),
      enabled: t(`${p}.governanceControls.enabled`),
      disabled: t(`${p}.governanceControls.disabled`),
      humanControl: t(`${p}.governanceControls.humanControl`),
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      escalate: t(`${p}.actions.escalate`),
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
      industryIntelligence: t(`${p}.links.industryIntelligence`),
      consciousness: t(`${p}.links.consciousness`),
      strategicIntelligence: t(`${p}.links.strategicIntelligence`),
      executiveBoard: t(`${p}.links.executiveBoard`),
    },
  };
}

export type EconomicIntelligenceCenterLabels = ReturnType<typeof buildEconomicIntelligenceCenterLabels>;
