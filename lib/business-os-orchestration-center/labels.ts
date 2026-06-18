import type { Translator } from "@/lib/i18n/translate";
import type { AutomationRunStatus } from "./types";

export function buildBusinessOsOrchestrationCenterLabels(t: Translator) {
  const p = "customerApp.businessOsOrchestrationCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    owner: t(`${p}.owner`),
    deadline: t(`${p}.deadline`),
    priority: t(`${p}.priority`),
    currentStep: t(`${p}.currentStep`),
    steps: t(`${p}.steps`),
    lastRun: t(`${p}.lastRun`),
    successRate: t(`${p}.successRate`),
    blocker: t(`${p}.blocker`),
    sections: {
      activeWorkflows: t(`${p}.sections.activeWorkflows`),
      pendingApprovals: t(`${p}.sections.pendingApprovals`),
      runningAutomations: t(`${p}.sections.runningAutomations`),
      crossSystemTasks: t(`${p}.sections.crossSystemTasks`),
      businessPackOrchestration: t(`${p}.sections.businessPackOrchestration`),
      workflowTemplates: t(`${p}.sections.workflowTemplates`),
      orchestrationAnalytics: t(`${p}.sections.orchestrationAnalytics`),
    },
    executiveDashboard: { title: t(`${p}.executiveDashboard.title`) },
    workflowOrchestration: { title: t(`${p}.workflowOrchestration.title`) },
    approvalOrchestration: { title: t(`${p}.approvalOrchestration.title`) },
    automationRegistry: {
      title: t(`${p}.automationRegistry.title`),
      running: t(`${p}.automationRegistry.running`),
      requiresAttention: t(`${p}.automationRegistry.requiresAttention`),
      failed: t(`${p}.automationRegistry.failed`),
      waiting: t(`${p}.automationRegistry.waiting`),
    },
    crossSystemActions: { title: t(`${p}.crossSystemActions.title`) },
    businessPackOrchestration: { title: t(`${p}.businessPackOrchestration.title`), workflows: t(`${p}.businessPackOrchestration.workflows`) },
    dependencyManagement: { title: t(`${p}.dependencyManagement.title`) },
    workflowTemplates: { title: t(`${p}.workflowTemplates.title`) },
    companionAdvisor: { title: t(`${p}.companionAdvisor.title`), reason: t(`${p}.companionAdvisor.reason`) },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      approve: t(`${p}.actions.approve`),
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
      legacyFlows: t(`${p}.links.legacyFlows`),
      legacyRules: t(`${p}.links.legacyRules`),
      legacyEvents: t(`${p}.links.legacyEvents`),
      legacySettings: t(`${p}.links.legacySettings`),
    },
  };
}

export type BusinessOsOrchestrationCenterLabels = ReturnType<typeof buildBusinessOsOrchestrationCenterLabels>;

export function getAutomationRunStatusLabel(status: AutomationRunStatus, labels: BusinessOsOrchestrationCenterLabels["automationRegistry"]): string {
  if (status === "requires_attention") return labels.requiresAttention;
  if (status === "failed") return labels.failed;
  if (status === "waiting") return labels.waiting;
  return labels.running;
}
