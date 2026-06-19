import type { Translator } from "@/lib/i18n/translate";

export function buildChangeOperationsLabels(t: Translator) {
  const p = "platform.changeOperations";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.emptyState`),
    refresh: t(`${p}.refresh`),
    back: t(`${p}.back`),
    records: t(`${p}.records`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    auditRecent: t(`${p}.auditRecent`),
    reports: t(`${p}.reports`),
    status: t(`${p}.status`),
    calendar: t(`${p}.calendar`),
    history: t(`${p}.history`),
    advisory: t(`${p}.advisory`),
    sections: {
      overview: t(`${p}.sections.overview`),
      changeRequests: t(`${p}.sections.changeRequests`),
      releases: t(`${p}.sections.releases`),
      deployments: t(`${p}.sections.deployments`),
      approvals: t(`${p}.sections.approvals`),
      environments: t(`${p}.sections.environments`),
      featureFlags: t(`${p}.sections.featureFlags`),
      databaseChanges: t(`${p}.sections.databaseChanges`),
      emergencyChanges: t(`${p}.sections.emergencyChanges`),
      rollback: t(`${p}.sections.rollback`),
      evidence: t(`${p}.sections.evidence`),
      reports: t(`${p}.sections.reports`),
      calendar: t(`${p}.sections.calendar`),
      history: t(`${p}.sections.history`),
      advisory: t(`${p}.sections.advisory`),
    },
  };
}

export function buildChangeHistoryLabels(t: Translator) {
  const p = "customerApp.changeHistory";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.emptyState`),
    refresh: t(`${p}.refresh`),
    records: t(`${p}.records`),
    noRecords: t(`${p}.noRecords`),
    status: t(`${p}.status`),
    impact: t(`${p}.impact`),
    version: t(`${p}.version`),
    upcoming: t(`${p}.upcoming`),
    completed: t(`${p}.completed`),
  };
}
