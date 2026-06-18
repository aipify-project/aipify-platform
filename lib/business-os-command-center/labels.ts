import type { Translator } from "@/lib/i18n/translate";

export function buildBusinessOsCommandCenterLabels(t: Translator) {
  const p = "customerApp.businessOsCommandCenter";
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
      executiveOverview: t(`${p}.sections.executiveOverview`),
      operationalOverview: t(`${p}.sections.operationalOverview`),
      financialOverview: t(`${p}.sections.financialOverview`),
      customerOverview: t(`${p}.sections.customerOverview`),
      workforceOverview: t(`${p}.sections.workforceOverview`),
      intelligenceOverview: t(`${p}.sections.intelligenceOverview`),
      companionRecommendations: t(`${p}.sections.companionRecommendations`),
    },
    executiveMissionControl: { title: t(`${p}.executiveMissionControl.title`) },
    organizationRadar: {
      title: t(`${p}.organizationRadar.title`),
      healthy: t(`${p}.organizationRadar.healthy`),
      emergingRisk: t(`${p}.organizationRadar.emergingRisk`),
      critical: t(`${p}.organizationRadar.critical`),
      information: t(`${p}.organizationRadar.information`),
    },
    liveBusinessPulse: {
      title: t(`${p}.liveBusinessPulse.title`),
      today: t(`${p}.liveBusinessPulse.today`),
      thisWeek: t(`${p}.liveBusinessPulse.thisWeek`),
      thisMonth: t(`${p}.liveBusinessPulse.thisMonth`),
    },
    unifiedEventStream: { title: t(`${p}.unifiedEventStream.title`) },
    morningBriefing: {
      title: t(`${p}.morningBriefing.title`),
      sinceLogin: t(`${p}.morningBriefing.sinceLogin`),
      recommendedActions: t(`${p}.morningBriefing.recommendedActions`),
    },
    widgets: {
      title: t(`${p}.widgets.title`),
      pin: t(`${p}.widgets.pin`),
      unpin: t(`${p}.widgets.unpin`),
      hide: t(`${p}.widgets.hide`),
      show: t(`${p}.widgets.show`),
    },
    crossSystemIntelligence: {
      title: t(`${p}.crossSystemIntelligence.title`),
      suggestedAction: t(`${p}.crossSystemIntelligence.suggestedAction`),
    },
    companionAdvisor: {
      title: t(`${p}.companionAdvisor.title`),
      reason: t(`${p}.companionAdvisor.reason`),
    },
    executiveReadiness: {
      title: t(`${p}.executiveReadiness.title`),
      keyMetrics: t(`${p}.executiveReadiness.keyMetrics`),
      risks: t(`${p}.executiveReadiness.risks`),
      achievements: t(`${p}.executiveReadiness.achievements`),
      priorities: t(`${p}.executiveReadiness.priorities`),
      boardMeeting: t(`${p}.executiveReadiness.boardMeeting`),
      investorMeeting: t(`${p}.executiveReadiness.investorMeeting`),
      managementReview: t(`${p}.executiveReadiness.managementReview`),
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      setReadinessMode: t(`${p}.actions.setReadinessMode`),
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
      presenceFeed: t(`${p}.links.presenceFeed`),
      desktopConnect: t(`${p}.links.desktopConnect`),
      portalHome: t(`${p}.links.portalHome`),
    },
  };
}

export type BusinessOsCommandCenterLabels = ReturnType<typeof buildBusinessOsCommandCenterLabels>;

export function getRadarTierLabel(tier: string, labels: BusinessOsCommandCenterLabels["organizationRadar"]): string {
  if (tier === "healthy") return labels.healthy;
  if (tier === "emerging_risk") return labels.emergingRisk;
  if (tier === "critical") return labels.critical;
  return labels.information;
}

export function getPulsePeriodLabel(period: string, labels: BusinessOsCommandCenterLabels["liveBusinessPulse"]): string {
  if (period === "today") return labels.today;
  if (period === "this_week") return labels.thisWeek;
  if (period === "this_month") return labels.thisMonth;
  return period;
}
