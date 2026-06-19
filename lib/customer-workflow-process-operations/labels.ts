import type { Translator } from "@/lib/i18n/translate";
import type { WorkflowProcessLabels, WorkflowProcessTab } from "./types";
import { WORKFLOW_PROCESS_TABS } from "./constants";

export function buildWorkflowProcessLabels(t: Translator): WorkflowProcessLabels {
  const p = "workflowProcessOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      WORKFLOW_PROCESS_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<WorkflowProcessTab, string>,
    overview: {
      totalWorkflows: t(`${p}.overview.totalWorkflows`),
      activeWorkflows: t(`${p}.overview.activeWorkflows`),
      healthyWorkflows: t(`${p}.overview.healthyWorkflows`),
      bottleneckWorkflows: t(`${p}.overview.bottleneckWorkflows`),
      openBottlenecks: t(`${p}.overview.openBottlenecks`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      delayedApprovals: t(`${p}.overview.delayedApprovals`),
      automationCoverage: t(`${p}.overview.automationCoverage`),
      avgCompletionDays: t(`${p}.overview.avgCompletionDays`),
      failureRate: t(`${p}.overview.failureRate`),
    },
    sections: {
      visualDesigner: t(`${p}.sections.visualDesigner`),
      processMapping: t(`${p}.sections.processMapping`),
      bottleneckDetection: t(`${p}.sections.bottleneckDetection`),
      executiveDashboard: t(`${p}.sections.executiveDashboard`),
      workflowAnalytics: t(`${p}.sections.workflowAnalytics`),
      businessPacks: t(`${p}.sections.businessPacks`),
      crossDepartment: t(`${p}.sections.crossDepartment`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    actions: {
      refreshWorkflows: t(`${p}.actions.refreshWorkflows`),
      generateWorkflowReport: t(`${p}.actions.generateWorkflowReport`),
      grantApproval: t(`${p}.actions.grantApproval`),
      denyApproval: t(`${p}.actions.denyApproval`),
    },
    healthStatus: {
      healthy: t(`${p}.healthStatus.healthy`),
      needs_review: t(`${p}.healthStatus.needs_review`),
      bottleneck: t(`${p}.healthStatus.bottleneck`),
    },
    workflowStatus: {
      draft: t(`${p}.workflowStatus.draft`),
      active: t(`${p}.workflowStatus.active`),
      paused: t(`${p}.workflowStatus.paused`),
      needs_review: t(`${p}.workflowStatus.needs_review`),
      archived: t(`${p}.workflowStatus.archived`),
    },
    automationLevel: {
      manual: t(`${p}.automationLevel.manual`),
      assisted: t(`${p}.automationLevel.assisted`),
      semi_automated: t(`${p}.automationLevel.semi_automated`),
      automated: t(`${p}.automationLevel.automated`),
    },
  };
}
