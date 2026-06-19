import type { Translator } from "@/lib/i18n/translate";

export function buildExecutiveCommandCenterLabels(t: Translator) {
  const p = "customerApp.executiveCommandCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    overallHealthScore: t(`${p}.overallHealthScore`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    sinceLastLogin: t(`${p}.sinceLastLogin`),
    morningBriefing: t(`${p}.morningBriefing`),
    organizationalTimeline: t(`${p}.organizationalTimeline`),
    businessPackSignals: t(`${p}.businessPackSignals`),
    boardReadyReports: t(`${p}.boardReadyReports`),
    commandMode: t(`${p}.commandMode`),
    mobileExecutiveMode: t(`${p}.mobileExecutiveMode`),
    priority: {
      information: t(`${p}.priority.information`),
      attention: t(`${p}.priority.attention`),
      urgent: t(`${p}.priority.urgent`),
      critical: t(`${p}.priority.critical`),
    },
    sections: {
      overview: t(`${p}.sections.overview`),
      sinceLastLogin: t(`${p}.sections.sinceLastLogin`),
      alerts: t(`${p}.sections.alerts`),
      approvals: t(`${p}.sections.approvals`),
      risks: t(`${p}.sections.risks`),
      opportunities: t(`${p}.sections.opportunities`),
      performance: t(`${p}.sections.performance`),
      companionBriefing: t(`${p}.sections.companionBriefing`),
    },
    stats: {
      sinceLastLoginItems: t(`${p}.stats.sinceLastLoginItems`),
      openAlerts: t(`${p}.stats.openAlerts`),
      pendingActions: t(`${p}.stats.pendingActions`),
      openOpportunities: t(`${p}.stats.openOpportunities`),
      criticalItems: t(`${p}.stats.criticalItems`),
    },
    briefing: {
      revenue: t(`${p}.briefing.revenue`),
      customer: t(`${p}.briefing.customer`),
      risk: t(`${p}.briefing.risk`),
      operational: t(`${p}.briefing.operational`),
      growth: t(`${p}.briefing.growth`),
      companion: t(`${p}.briefing.companion`),
    },
  };
}
