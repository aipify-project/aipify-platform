import type { Translator } from "@/lib/i18n/translate";
import type { FutureReadinessLabels, FutureReadinessTab } from "./types";
import { FUTURE_READINESS_TABS } from "./constants";

export function buildFutureReadinessLabels(t: Translator): FutureReadinessLabels {
  const p = "futureReadinessOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    planningTitle: t(`${p}.planningTitle`),
    roadmapsTitle: t(`${p}.roadmapsTitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      FUTURE_READINESS_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<FutureReadinessTab, string>,
    overview: {
      futureReadinessScore: t(`${p}.overview.futureReadinessScore`),
      activeInitiatives: t(`${p}.overview.activeInitiatives`),
      delayedInitiatives: t(`${p}.overview.delayedInitiatives`),
      activeScenarios: t(`${p}.overview.activeScenarios`),
      trackedOpportunities: t(`${p}.overview.trackedOpportunities`),
      escalatedThreats: t(`${p}.overview.escalatedThreats`),
      activeRoadmaps: t(`${p}.overview.activeRoadmaps`),
    },
    actions: {
      refreshReadiness: t(`${p}.actions.refreshReadiness`),
      createInitiative: t(`${p}.actions.createInitiative`),
      updateRoadmap: t(`${p}.actions.updateRoadmap`),
      addOpportunity: t(`${p}.actions.addOpportunity`),
      identifyThreat: t(`${p}.actions.identifyThreat`),
      generateScenario: t(`${p}.actions.generateScenario`),
      completeStrategicReview: t(`${p}.actions.completeStrategicReview`),
      openPlanning: t(`${p}.actions.openPlanning`),
      openRoadmaps: t(`${p}.actions.openRoadmaps`),
      openFederation: t(`${p}.actions.openFederation`),
    },
    sections: {
      strategicHorizons: t(`${p}.sections.strategicHorizons`),
      strategicAdvisor: t(`${p}.sections.strategicAdvisor`),
      benchmarking: t(`${p}.sections.benchmarking`),
      threatObservatory: t(`${p}.sections.threatObservatory`),
      innovationManagement: t(`${p}.sections.innovationManagement`),
      transformationEngine: t(`${p}.sections.transformationEngine`),
      businessPackIntegration: t(`${p}.sections.businessPackIntegration`),
      executivePlanning: t(`${p}.sections.executivePlanning`),
      audit: t(`${p}.sections.audit`),
    },
    readinessLabels: {
      future_ready: t(`${p}.readinessLabels.future_ready`),
      prepared: t(`${p}.readinessLabels.prepared`),
      gaps_identified: t(`${p}.readinessLabels.gaps_identified`),
      strategic_risk: t(`${p}.readinessLabels.strategic_risk`),
    },
    threatLevels: {
      low: t(`${p}.threatLevels.low`),
      moderate: t(`${p}.threatLevels.moderate`),
      elevated: t(`${p}.threatLevels.elevated`),
      high: t(`${p}.threatLevels.high`),
      critical: t(`${p}.threatLevels.critical`),
    },
  };
}
