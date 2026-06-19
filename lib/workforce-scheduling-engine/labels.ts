import type { Translator } from "@/lib/i18n/translate";

export function buildWorkforceSchedulingLabels(t: Translator) {
  const p = "workforceScheduling";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.emptyState`),
    refresh: t(`${p}.refresh`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    companionAdvisor: t(`${p}.companionAdvisor`),
    coverageGaps: t(`${p}.coverageGaps`),
    openShifts: t(`${p}.openShifts`),
    onCallRotations: t(`${p}.onCallRotations`),
    pendingRequests: t(`${p}.pendingRequests`),
    activeConflicts: t(`${p}.activeConflicts`),
    partiallyStaffed: t(`${p}.partiallyStaffed`),
    crisisMode: t(`${p}.crisisMode`),
    noRecords: t(`${p}.noRecords`),
    statusIconLabel: t(`${p}.statusIconLabel`),
    integrations: t(`${p}.integrations`),
    auditRecent: t(`${p}.auditRecent`),
    sections: {
      overview: t(`${p}.sections.overview`),
      schedule: t(`${p}.sections.schedule`),
      employees: t(`${p}.sections.employees`),
      teams: t(`${p}.sections.teams`),
      shifts: t(`${p}.sections.shifts`),
      availability: t(`${p}.sections.availability`),
      coverage: t(`${p}.sections.coverage`),
      onCall: t(`${p}.sections.onCall`),
      locations: t(`${p}.sections.locations`),
      requests: t(`${p}.sections.requests`),
      conflicts: t(`${p}.sections.conflicts`),
      templates: t(`${p}.sections.templates`),
      policies: t(`${p}.sections.policies`),
      reports: t(`${p}.sections.reports`),
    },
    shiftStatus: {
      unassigned: t(`${p}.shiftStatus.unassigned`),
      partially_staffed: t(`${p}.shiftStatus.partiallyStaffed`),
      fully_covered: t(`${p}.shiftStatus.fullyCovered`),
      coverage_gap: t(`${p}.shiftStatus.coverageGap`),
    },
  };
}

export function buildPartnerWorkforceSchedulingLabels(t: Translator) {
  const p = "partnersPortal.workforceScheduling";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.emptyState`),
    refresh: t(`${p}.refresh`),
    attributionNote: t(`${p}.attributionNote`),
    noRecords: t(`${p}.noRecords`),
    sections: {
      overview: t(`${p}.sections.overview`),
      shifts: t(`${p}.sections.shifts`),
      coverage: t(`${p}.sections.coverage`),
      onCall: t(`${p}.sections.onCall`),
    },
  };
}
