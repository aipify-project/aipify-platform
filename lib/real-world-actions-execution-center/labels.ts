import type { Translator } from "@/lib/i18n/translate";
import type { RiskLevel } from "./types";

export function buildRealWorldActionsExecutionCenterLabels(t: Translator) {
  const p = "customerApp.realWorldActionsExecutionCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    executionWorkflow: t(`${p}.executionWorkflow`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    owner: t(`${p}.owner`),
    cost: t(`${p}.cost`),
    result: t(`${p}.result`),
    stage: t(`${p}.stage`),
    provider: t(`${p}.provider`),
    category: t(`${p}.category`),
    approvalRequired: t(`${p}.approvalRequired`),
    user: t(`${p}.user`),
    date: t(`${p}.date`),
    sections: {
      availableActions: t(`${p}.sections.availableActions`),
      pendingActions: t(`${p}.sections.pendingActions`),
      approvedActions: t(`${p}.sections.approvedActions`),
      completedActions: t(`${p}.sections.completedActions`),
      failedActions: t(`${p}.sections.failedActions`),
      actionHistory: t(`${p}.sections.actionHistory`),
    },
    executiveDashboard: { title: t(`${p}.executiveDashboard.title`) },
    actionRegistry: { title: t(`${p}.actionRegistry.title`) },
    approvalEngine: { title: t(`${p}.approvalEngine.title`) },
    actionProviders: { title: t(`${p}.actionProviders.title`) },
    actionHistory: { title: t(`${p}.actionHistory.title`) },
    companionRequests: {
      title: t(`${p}.companionRequests.title`),
      explanation: t(`${p}.companionRequests.explanation`),
      risk: t(`${p}.companionRequests.risk`),
    },
    enterpriseControls: {
      title: t(`${p}.enterpriseControls.title`),
      enabled: t(`${p}.enterpriseControls.enabled`),
      disabled: t(`${p}.enterpriseControls.disabled`),
      multiLevel: t(`${p}.enterpriseControls.multiLevel`),
    },
    risk: {
      low: t(`${p}.risk.low`),
      medium: t(`${p}.risk.medium`),
      high: t(`${p}.risk.high`),
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      approve: t(`${p}.actions.approve`),
      reject: t(`${p}.actions.reject`),
      escalate: t(`${p}.actions.escalate`),
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
      legacyInbox: t(`${p}.links.legacyInbox`),
      legacySettings: t(`${p}.links.legacySettings`),
      approvals: t(`${p}.links.approvals`),
      actionCenter: t(`${p}.links.actionCenter`),
    },
  };
}

export type RealWorldActionsExecutionCenterLabels = ReturnType<typeof buildRealWorldActionsExecutionCenterLabels>;

export function getRiskLevelLabel(risk: RiskLevel, labels: RealWorldActionsExecutionCenterLabels["risk"]): string {
  if (risk === "low") return labels.low;
  if (risk === "high") return labels.high;
  return labels.medium;
}
