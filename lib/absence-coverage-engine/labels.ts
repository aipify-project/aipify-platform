import type { Translator } from "@/lib/i18n/translate";

export function buildAbsenceCoverageLabels(t: Translator, namespace = "customerApp.absenceCoverage") {
  const p = namespace;
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
    maxCoverageLevel: t(`${p}.maxCoverageLevel`),
    readinessScore: t(`${p}.readinessScore`),
    transparentNotice: t(`${p}.transparentNotice`),
    settingsTitle: t(`${p}.settingsTitle`),
    settingsSubtitle: t(`${p}.settingsSubtitle`),
    sections: {
      overview: t(`${p}.sections.overview`),
      myVacationMode: t(`${p}.sections.myVacationMode`),
      teamAvailability: t(`${p}.sections.teamAvailability`),
      coverage: t(`${p}.sections.coverage`),
      delegation: t(`${p}.sections.delegation`),
      aipifyResponses: t(`${p}.sections.aipifyResponses`),
      schedules: t(`${p}.sections.schedules`),
      policies: t(`${p}.sections.policies`),
      returnSummary: t(`${p}.sections.returnSummary`),
      history: t(`${p}.sections.history`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      activeModes: t(`${p}.stats.activeModes`),
      teamAway: t(`${p}.stats.teamAway`),
      readinessScore: t(`${p}.stats.readinessScore`),
      delegations: t(`${p}.stats.delegations`),
      templates: t(`${p}.stats.templates`),
      leadContinuity: t(`${p}.stats.leadContinuity`),
    },
  };
}
