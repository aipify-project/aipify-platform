import type { Translator } from "@/lib/i18n/translate";

export function buildEventCenterLabels(t: Translator) {
  const p = "customerApp.eventCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    liveActivity: t(`${p}.liveActivity`),
    eventRegistry: t(`${p}.eventRegistry`),
    correlations: t(`${p}.correlations`),
    alertOrchestration: t(`${p}.alertOrchestration`),
    businessPackSignals: t(`${p}.businessPackSignals`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    signalBriefing: t(`${p}.signalBriefing`),
    mobileAccess: t(`${p}.mobileAccess`),
    signalClass: {
      information: t(`${p}.signalClass.information`),
      positive: t(`${p}.signalClass.positive`),
      attention: t(`${p}.signalClass.attention`),
      risk: t(`${p}.signalClass.risk`),
      critical: t(`${p}.signalClass.critical`),
    },
    sections: {
      overview: t(`${p}.sections.overview`),
      liveActivity: t(`${p}.sections.liveActivity`),
      signals: t(`${p}.sections.signals`),
      alerts: t(`${p}.sections.alerts`),
      subscriptions: t(`${p}.sections.subscriptions`),
      sources: t(`${p}.sections.sources`),
      history: t(`${p}.sections.history`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      registryEvents: t(`${p}.stats.registryEvents`),
      openSignals: t(`${p}.stats.openSignals`),
      openAlerts: t(`${p}.stats.openAlerts`),
      activeSubscriptions: t(`${p}.stats.activeSubscriptions`),
      eventSources: t(`${p}.stats.eventSources`),
    },
    executive: {
      positiveSignals: t(`${p}.executive.positiveSignals`),
      riskSignals: t(`${p}.executive.riskSignals`),
      criticalSignals: t(`${p}.executive.criticalSignals`),
      growthSignals: t(`${p}.executive.growthSignals`),
      revenueSignals: t(`${p}.executive.revenueSignals`),
    },
  };
}
