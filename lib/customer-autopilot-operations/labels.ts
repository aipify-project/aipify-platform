import type { Translator } from "@/lib/i18n/translate";
import type { AutopilotLabels, AutopilotTab } from "./types";
import { AUTOPILOT_TABS } from "./constants";

export function buildAutopilotLabels(t: Translator): AutopilotLabels {
  const p = "autopilotOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    workflowsTitle: t(`${p}.workflowsTitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      AUTOPILOT_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<AutopilotTab, string>,
    overview: {
      autopilotProfile: t(`${p}.overview.autopilotProfile`),
      activePolicies: t(`${p}.overview.activePolicies`),
      automationRulesActive: t(`${p}.overview.automationRulesActive`),
      preparedActionsReady: t(`${p}.overview.preparedActionsReady`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      executionInProgress: t(`${p}.overview.executionInProgress`),
      activeWorkflows: t(`${p}.overview.activeWorkflows`),
      watchtowerAlerts: t(`${p}.overview.watchtowerAlerts`),
      policyCompliancePct: t(`${p}.overview.policyCompliancePct`),
      timeSavedHours: t(`${p}.overview.timeSavedHours`),
    },
    actions: {
      refreshAutopilot: t(`${p}.actions.refreshAutopilot`),
      createPolicy: t(`${p}.actions.createPolicy`),
      activateWorkflow: t(`${p}.actions.activateWorkflow`),
      generatePreparedAction: t(`${p}.actions.generatePreparedAction`),
      approveQueueItem: t(`${p}.actions.approveQueueItem`),
      denyQueueItem: t(`${p}.actions.denyQueueItem`),
      openWorkflows: t(`${p}.actions.openWorkflows`),
      openApprovals: t(`${p}.actions.openApprovals`),
      openProactive: t(`${p}.actions.openProactive`),
    },
    sections: {
      watchtower: t(`${p}.sections.watchtower`),
      boundaries: t(`${p}.sections.boundaries`),
      confidenceEngine: t(`${p}.sections.confidenceEngine`),
      smartScheduling: t(`${p}.sections.smartScheduling`),
      businessPackIntegration: t(`${p}.sections.businessPackIntegration`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    profiles: {
      conservative: t(`${p}.profiles.conservative`),
      balanced: t(`${p}.profiles.balanced`),
      advanced: t(`${p}.profiles.advanced`),
      enterprise: t(`${p}.profiles.enterprise`),
      custom: t(`${p}.profiles.custom`),
    },
    policyCategories: {
      allowed: t(`${p}.policyCategories.allowed`),
      approval_required: t(`${p}.policyCategories.approval_required`),
      restricted: t(`${p}.policyCategories.restricted`),
      prohibited: t(`${p}.policyCategories.prohibited`),
    },
    confidenceLevels: {
      high: t(`${p}.confidenceLevels.high`),
      moderate: t(`${p}.confidenceLevels.moderate`),
      limited: t(`${p}.confidenceLevels.limited`),
    },
  };
}
