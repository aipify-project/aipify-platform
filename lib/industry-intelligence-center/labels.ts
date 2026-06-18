import type { Translator } from "@/lib/i18n/translate";

export function buildIndustryIntelligenceCenterLabels(t: Translator) {
  const p = "customerApp.industryIntelligenceCenter";
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
    relevance: t(`${p}.relevance`),
    evidence: t(`${p}.evidence`),
    signal: t(`${p}.signal`),
    benchmark: t(`${p}.benchmark`),
    trend: t(`${p}.trend`),
    risk: t(`${p}.risk`),
    opportunity: t(`${p}.opportunity`),
    comparison: t(`${p}.comparison`),
    sections: {
      industryOverview: t(`${p}.sections.industryOverview`),
      marketTrends: t(`${p}.sections.marketTrends`),
      regulatoryChanges: t(`${p}.sections.regulatoryChanges`),
      competitiveIntelligence: t(`${p}.sections.competitiveIntelligence`),
      emergingOpportunities: t(`${p}.sections.emergingOpportunities`),
      industryRisks: t(`${p}.sections.industryRisks`),
      industryBenchmarks: t(`${p}.sections.industryBenchmarks`),
    },
    industryProfiles: { title: t(`${p}.industryProfiles.title`) },
    marketMonitoringEngine: { title: t(`${p}.marketMonitoringEngine.title`) },
    competitiveIntelligence: { title: t(`${p}.competitiveIntelligence.title`) },
    regulatoryIntelligence: { title: t(`${p}.regulatoryIntelligence.title`) },
    industryBenchmarkEngine: { title: t(`${p}.industryBenchmarkEngine.title`) },
    opportunityDetection: { title: t(`${p}.opportunityDetection.title`) },
    executiveIndustryDashboard: { title: t(`${p}.executiveIndustryDashboard.title`) },
    companionAdvisor: { title: t(`${p}.companionAdvisor.title`), evidence: t(`${p}.companionAdvisor.evidence`) },
    businessPackAwareness: { title: t(`${p}.businessPackAwareness.title`) },
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
      consciousness: t(`${p}.links.consciousness`),
      corporateBrain: t(`${p}.links.corporateBrain`),
      strategicIntelligence: t(`${p}.links.strategicIntelligence`),
      industryPacks: t(`${p}.links.industryPacks`),
      legacyIndustryIntelligence: t(`${p}.links.legacyIndustryIntelligence`),
    },
  };
}

export type IndustryIntelligenceCenterLabels = ReturnType<typeof buildIndustryIntelligenceCenterLabels>;
