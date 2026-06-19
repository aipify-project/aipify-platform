import type { Translator } from "@/lib/i18n/translate";

export function buildTimeAttendanceLabels(t: Translator) {
  const p = "customerApp.timeAttendance";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    distinctionNote: t(`${p}.distinctionNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    noRecords: t(`${p}.noRecords`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    companionTimeAdvisor: t(`${p}.companionTimeAdvisor`),
    sections: {
      overview: t(`${p}.sections.overview`),
      myTime: t(`${p}.sections.myTime`),
      teamTime: t(`${p}.sections.teamTime`),
      attendance: t(`${p}.sections.attendance`),
      timesheets: t(`${p}.sections.timesheets`),
      leave: t(`${p}.sections.leave`),
      balances: t(`${p}.sections.balances`),
      overtime: t(`${p}.sections.overtime`),
      corrections: t(`${p}.sections.corrections`),
      approvals: t(`${p}.sections.approvals`),
      payrollPreparation: t(`${p}.sections.payrollPreparation`),
      projects: t(`${p}.sections.projects`),
      policies: t(`${p}.sections.policies`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      hoursThisWeek: t(`${p}.stats.hoursThisWeek`),
      pendingApprovals: t(`${p}.stats.pendingApprovals`),
      openCorrections: t(`${p}.stats.openCorrections`),
      leavePending: t(`${p}.stats.leavePending`),
      payrollDrafts: t(`${p}.stats.payrollDrafts`),
    },
    leaveCenter: {
      title: t(`${p}.leaveCenter.title`),
      subtitle: t(`${p}.leaveCenter.subtitle`),
    },
    payrollCenter: {
      title: t(`${p}.payrollCenter.title`),
      subtitle: t(`${p}.payrollCenter.subtitle`),
    },
    policyCenter: {
      title: t(`${p}.policyCenter.title`),
      subtitle: t(`${p}.policyCenter.subtitle`),
    },
    integrations: t(`${p}.integrations`),
    attributionPreserved: t(`${p}.attributionPreserved`),
  };
}

export function buildPartnerTeamTimeLabels(t: Translator) {
  const p = "partnersPortal.teamTime";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    noRecords: t(`${p}.noRecords`),
    attributionPreserved: t(`${p}.attributionPreserved`),
    sections: {
      overview: t(`${p}.sections.overview`),
      team: t(`${p}.sections.team`),
      time: t(`${p}.sections.time`),
      leave: t(`${p}.sections.leave`),
    },
    stats: {
      teamSize: t(`${p}.stats.teamSize`),
      hoursThisWeek: t(`${p}.stats.hoursThisWeek`),
    },
  };
}
