import type { Translator } from "@/lib/i18n/translate";
import type { ExecutionOutcomeLabels, ExecutionOutcomeTab } from "./types";
import { EXECUTION_OUTCOME_TABS } from "./constants";

export function buildExecutionOutcomeLabels(t: Translator): ExecutionOutcomeLabels {
  const p = "executionOutcomeOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      EXECUTION_OUTCOME_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<ExecutionOutcomeTab, string>,
    overview: {
      totalInitiatives: t(`${p}.overview.totalInitiatives`),
      activeActions: t(`${p}.overview.activeActions`),
      blockedActions: t(`${p}.overview.blockedActions`),
      overdueActions: t(`${p}.overview.overdueActions`),
      openBlockers: t(`${p}.overview.openBlockers`),
      atRiskInitiatives: t(`${p}.overview.atRiskInitiatives`),
      completionRate: t(`${p}.overview.completionRate`),
      executionVelocity: t(`${p}.overview.executionVelocity`),
    },
    sections: {
      executiveDashboard: t(`${p}.sections.executiveDashboard`),
      executionScorecard: t(`${p}.sections.executionScorecard`),
      blockerDetection: t(`${p}.sections.blockerDetection`),
      meetingToExecution: t(`${p}.sections.meetingToExecution`),
      businessPacks: t(`${p}.sections.businessPacks`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    actions: {
      refreshExecution: t(`${p}.actions.refreshExecution`),
      generateExecutionBriefing: t(`${p}.actions.generateExecutionBriefing`),
      completeAction: t(`${p}.actions.completeAction`),
      assignAction: t(`${p}.actions.assignAction`),
    },
    healthStatus: {
      healthy: t(`${p}.healthStatus.healthy`),
      delayed: t(`${p}.healthStatus.delayed`),
      at_risk: t(`${p}.healthStatus.at_risk`),
    },
    actionStatus: {
      pending: t(`${p}.actionStatus.pending`),
      in_progress: t(`${p}.actionStatus.in_progress`),
      blocked: t(`${p}.actionStatus.blocked`),
      completed: t(`${p}.actionStatus.completed`),
      overdue: t(`${p}.actionStatus.overdue`),
      archived: t(`${p}.actionStatus.archived`),
    },
    priority: {
      low: t(`${p}.priority.low`),
      moderate: t(`${p}.priority.moderate`),
      high: t(`${p}.priority.high`),
      critical: t(`${p}.priority.critical`),
    },
  };
}
