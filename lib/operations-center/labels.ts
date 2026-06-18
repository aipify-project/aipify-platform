import type { Translator } from "@/lib/i18n/translate";

export function buildOperationsCenterLabels(t: Translator) {
  const p = "customerApp.operationsCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    humanOversight: t(`${p}.humanOversight`),
    safetyNote: t(`${p}.safetyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    privacyNote: t(`${p}.privacyNote`),
    sections: {
      completed: t(`${p}.sections.completed`),
      requiresAttention: t(`${p}.sections.requiresAttention`),
      waiting: t(`${p}.sections.waiting`),
      information: t(`${p}.sections.information`),
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
    sinceLastLogin: {
      title: t(`${p}.sinceLastLogin.title`),
      today: t(`${p}.sinceLastLogin.today`),
      yesterday: t(`${p}.sinceLastLogin.yesterday`),
      thisWeek: t(`${p}.sinceLastLogin.thisWeek`),
      activities: t(`${p}.sinceLastLogin.activities`),
      alerts: t(`${p}.sinceLastLogin.alerts`),
      recommendations: t(`${p}.sinceLastLogin.recommendations`),
      supportSignals: t(`${p}.sinceLastLogin.supportSignals`),
      empty: t(`${p}.sinceLastLogin.empty`),
    },
    executiveSummary: {
      title: t(`${p}.executiveSummary.title`),
      empty: t(`${p}.executiveSummary.empty`),
    },
    tasks: {
      title: t(`${p}.tasks.title`),
      myTasks: t(`${p}.tasks.myTasks`),
      teamTasks: t(`${p}.tasks.teamTasks`),
      automationTasks: t(`${p}.tasks.automationTasks`),
      empty: t(`${p}.tasks.empty`),
    },
    alerts: {
      title: t(`${p}.alerts.title`),
      empty: t(`${p}.alerts.empty`),
    },
    recommendations: {
      title: t(`${p}.recommendations.title`),
      why: t(`${p}.recommendations.why`),
      expectedBenefit: t(`${p}.recommendations.expectedBenefit`),
      empty: t(`${p}.recommendations.empty`),
    },
    timeline: {
      title: t(`${p}.timeline.title`),
      user: t(`${p}.timeline.user`),
      action: t(`${p}.timeline.action`),
      system: t(`${p}.timeline.system`),
      result: t(`${p}.timeline.result`),
      timestamp: t(`${p}.timeline.timestamp`),
      empty: t(`${p}.timeline.empty`),
    },
    businessPacks: {
      title: t(`${p}.businessPacks.title`),
      hosts: t(`${p}.businessPacks.hosts`),
      commerce: t(`${p}.businessPacks.commerce`),
      support: t(`${p}.businessPacks.support`),
      finance: t(`${p}.businessPacks.finance`),
      growthPartners: t(`${p}.businessPacks.growthPartners`),
      other: t(`${p}.businessPacks.other`),
      empty: t(`${p}.businessPacks.empty`),
    },
    links: {
      automationControl: t(`${p}.automationControlLink`),
      approvals: t(`${p}.approvalsLink`),
      commandCenter: t(`${p}.commandCenterLink`),
    },
  };
}

export type OperationsCenterLabels = ReturnType<typeof buildOperationsCenterLabels>;
