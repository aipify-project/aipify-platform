import type { Translator } from "@/lib/i18n/translate";

export function buildMarketIntelligenceCenterLabels(t: Translator) {
  const p = "customerApp.marketIntelligenceCenter";
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
    opportunityScore: t(`${p}.opportunityScore`),
    potentialRevenue: t(`${p}.potentialRevenue`),
    adoptionPotential: t(`${p}.adoptionPotential`),
    marketSize: t(`${p}.marketSize`),
    competitionLevel: t(`${p}.competitionLevel`),
    sections: {
      marketOverview: t(`${p}.sections.marketOverview`),
      customerTrends: t(`${p}.sections.customerTrends`),
      opportunityDetection: t(`${p}.sections.opportunityDetection`),
      marketGaps: t(`${p}.sections.marketGaps`),
      expansionOpportunities: t(`${p}.sections.expansionOpportunities`),
      emergingDemand: t(`${p}.sections.emergingDemand`),
      marketForecasts: t(`${p}.sections.marketForecasts`),
    },
    marketMonitoringEngine: { title: t(`${p}.marketMonitoringEngine.title`) },
    customerBehaviorIntelligence: { title: t(`${p}.customerBehaviorIntelligence.title`) },
    opportunityDiscoveryEngine: { title: t(`${p}.opportunityDiscoveryEngine.title`) },
    marketGapDetection: { title: t(`${p}.marketGapDetection.title`) },
    geographicExpansionIntelligence: { title: t(`${p}.geographicExpansionIntelligence.title`) },
    revenueOpportunityEngine: { title: t(`${p}.revenueOpportunityEngine.title`) },
    executiveMarketDashboard: { title: t(`${p}.executiveMarketDashboard.title`) },
    companionAdvisor: { title: t(`${p}.companionAdvisor.title`), evidence: t(`${p}.companionAdvisor.evidence`) },
    forecastingEngine: { title: t(`${p}.forecastingEngine.title`) },
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
      economicIntelligence: t(`${p}.links.economicIntelligence`),
      consciousness: t(`${p}.links.consciousness`),
      strategicIntelligence: t(`${p}.links.strategicIntelligence`),
    },
  };
}

export type MarketIntelligenceCenterLabels = ReturnType<typeof buildMarketIntelligenceCenterLabels>;
