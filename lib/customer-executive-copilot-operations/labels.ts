import type { Translator } from "@/lib/i18n/translate";
import type { ExecutiveCopilotLabels, ExecutiveCopilotTab } from "./types";
import { EXECUTIVE_COPILOT_TABS } from "./constants";

export function buildExecutiveCopilotLabels(t: Translator): ExecutiveCopilotLabels {
  const p = "executiveCopilotOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    decisionsTitle: t(`${p}.decisionsTitle`),
    boardReportsTitle: t(`${p}.boardReportsTitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      EXECUTIVE_COPILOT_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<ExecutiveCopilotTab, string>,
    overview: {
      organizationHealth: t(`${p}.overview.organizationHealth`),
      strategicHealth: t(`${p}.overview.strategicHealth`),
      revenueHealth: t(`${p}.overview.revenueHealth`),
      pendingDecisions: t(`${p}.overview.pendingDecisions`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      briefingsReady: t(`${p}.overview.briefingsReady`),
      reportsReady: t(`${p}.overview.reportsReady`),
      activeRecommendations: t(`${p}.overview.activeRecommendations`),
      executionInProgress: t(`${p}.overview.executionInProgress`),
      scenariosReady: t(`${p}.overview.scenariosReady`),
    },
    actions: {
      refreshExecutive: t(`${p}.actions.refreshExecutive`),
      generateBriefing: t(`${p}.actions.generateBriefing`),
      createDecisionPackage: t(`${p}.actions.createDecisionPackage`),
      approveItem: t(`${p}.actions.approveItem`),
      denyItem: t(`${p}.actions.denyItem`),
      generateBoardReport: t(`${p}.actions.generateBoardReport`),
      runScenario: t(`${p}.actions.runScenario`),
      openDecisions: t(`${p}.actions.openDecisions`),
      openBoardReports: t(`${p}.actions.openBoardReports`),
      openFutureReadiness: t(`${p}.actions.openFutureReadiness`),
    },
    sections: {
      naturalLanguageCommands: t(`${p}.sections.naturalLanguageCommands`),
      executiveMonitoring: t(`${p}.sections.executiveMonitoring`),
      scenarioLab: t(`${p}.sections.scenarioLab`),
      decisionPackages: t(`${p}.sections.decisionPackages`),
      businessPackIntegration: t(`${p}.sections.businessPackIntegration`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    confidenceLevels: {
      high: t(`${p}.confidenceLevels.high`),
      moderate: t(`${p}.confidenceLevels.moderate`),
      limited: t(`${p}.confidenceLevels.limited`),
    },
    healthStatus: {
      healthy: t(`${p}.healthStatus.healthy`),
      watch: t(`${p}.healthStatus.watch`),
      at_risk: t(`${p}.healthStatus.at_risk`),
      critical: t(`${p}.healthStatus.critical`),
    },
  };
}
