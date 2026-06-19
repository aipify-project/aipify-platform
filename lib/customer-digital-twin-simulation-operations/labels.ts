import type { Translator } from "@/lib/i18n/translate";
import type { DigitalTwinSimulationLabels, DigitalTwinSimulationTab } from "./types";
import { DIGITAL_TWIN_SIMULATION_TABS } from "./constants";

export function buildDigitalTwinSimulationLabels(t: Translator): DigitalTwinSimulationLabels {
  const p = "digitalTwinSimulationOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      DIGITAL_TWIN_SIMULATION_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<DigitalTwinSimulationTab, string>,
    overview: {
      totalModels: t(`${p}.overview.totalModels`),
      activeScenarios: t(`${p}.overview.activeScenarios`),
      forecasts: t(`${p}.overview.forecasts`),
      impactAnalyses: t(`${p}.overview.impactAnalyses`),
      experiments: t(`${p}.overview.experiments`),
      capacityModels: t(`${p}.overview.capacityModels`),
      decisionPreviews: t(`${p}.overview.decisionPreviews`),
      avgConfidence: t(`${p}.overview.avgConfidence`),
    },
    sections: {
      executiveDashboard: t(`${p}.sections.executiveDashboard`),
      capacityModeling: t(`${p}.sections.capacityModeling`),
      resourceAllocation: t(`${p}.sections.resourceAllocation`),
      decisionPreviews: t(`${p}.sections.decisionPreviews`),
      businessPacks: t(`${p}.sections.businessPacks`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    actions: {
      refreshTwin: t(`${p}.actions.refreshTwin`),
      generateSimulationBriefing: t(`${p}.actions.generateSimulationBriefing`),
      executeSimulation: t(`${p}.actions.executeSimulation`),
      runWhatIf: t(`${p}.actions.runWhatIf`),
      generateDecisionPreview: t(`${p}.actions.generateDecisionPreview`),
    },
    impactDirection: {
      positive: t(`${p}.impactDirection.positive`),
      negative: t(`${p}.impactDirection.negative`),
      neutral: t(`${p}.impactDirection.neutral`),
      mixed: t(`${p}.impactDirection.mixed`),
    },
    impactMagnitude: {
      low: t(`${p}.impactMagnitude.low`),
      moderate: t(`${p}.impactMagnitude.moderate`),
      high: t(`${p}.impactMagnitude.high`),
      critical: t(`${p}.impactMagnitude.critical`),
    },
    whatIfTitle: t(`${p}.whatIfTitle`),
    whatIfSubtitle: t(`${p}.whatIfSubtitle`),
  };
}
