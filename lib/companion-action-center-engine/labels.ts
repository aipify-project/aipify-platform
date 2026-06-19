import type { Translator } from "@/lib/i18n/translate";

export function buildCompanionActionCenterLabels(t: Translator) {
  const p = "customerApp.companionActionCenter";
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
    actionRegistry: t(`${p}.actionRegistry`),
    approvalMatrix: t(`${p}.approvalMatrix`),
    actionTemplates: t(`${p}.actionTemplates`),
    realWorldActions: t(`${p}.realWorldActions`),
    actionSafety: t(`${p}.actionSafety`),
    confirmationSystem: t(`${p}.confirmationSystem`),
    executionFlow: t(`${p}.executionFlow`),
    businessPackIntegration: t(`${p}.businessPackIntegration`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    actionAdvisor: t(`${p}.actionAdvisor`),
    mobileAccess: t(`${p}.mobileAccess`),
    riskLevel: {
      low: t(`${p}.riskLevel.low`),
      medium: t(`${p}.riskLevel.medium`),
      high: t(`${p}.riskLevel.high`),
      critical: t(`${p}.riskLevel.critical`),
    },
    sections: {
      overview: t(`${p}.sections.overview`),
      pending: t(`${p}.sections.pending`),
      approved: t(`${p}.sections.approved`),
      completedActions: t(`${p}.sections.completedActions`),
      approvals: t(`${p}.sections.approvals`),
      permissions: t(`${p}.sections.permissions`),
      history: t(`${p}.sections.history`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      registryActions: t(`${p}.stats.registryActions`),
      pending: t(`${p}.stats.pending`),
      approved: t(`${p}.stats.approved`),
      completed: t(`${p}.stats.completed`),
      templates: t(`${p}.stats.templates`),
      safetyRules: t(`${p}.stats.safetyRules`),
    },
    executive: {
      pendingApprovals: t(`${p}.executive.pendingApprovals`),
      highRiskActions: t(`${p}.executive.highRiskActions`),
      completedActions: t(`${p}.executive.completedActions`),
      failedActions: t(`${p}.executive.failedActions`),
      actionVolume: t(`${p}.executive.actionVolume`),
    },
  };
}
