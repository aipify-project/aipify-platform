import type { Translator } from "@/lib/i18n/translate";
import type { ResilienceLabels, ResilienceTab } from "./types";
import { RESILIENCE_TABS } from "./constants";

export function buildResilienceLabels(t: Translator): ResilienceLabels {
  const p = "resilienceOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    incidentsTitle: t(`${p}.incidentsTitle`),
    emergencyTitle: t(`${p}.emergencyTitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      RESILIENCE_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<ResilienceTab, string>,
    overview: {
      resilienceScore: t(`${p}.overview.resilienceScore`),
      openIncidents: t(`${p}.overview.openIncidents`),
      criticalIncidents: t(`${p}.overview.criticalIncidents`),
      recoveryInProgress: t(`${p}.overview.recoveryInProgress`),
      criticalDependencies: t(`${p}.overview.criticalDependencies`),
      preparednessLevel: t(`${p}.overview.preparednessLevel`),
      continuityPlansActive: t(`${p}.overview.continuityPlansActive`),
    },
    actions: {
      refreshResilience: t(`${p}.actions.refreshResilience`),
      createIncident: t(`${p}.actions.createIncident`),
      updateRecovery: t(`${p}.actions.updateRecovery`),
      completeRecovery: t(`${p}.actions.completeRecovery`),
      activateContinuity: t(`${p}.actions.activateContinuity`),
      runPreparednessTest: t(`${p}.actions.runPreparednessTest`),
      updateIncident: t(`${p}.actions.updateIncident`),
      openIncidents: t(`${p}.actions.openIncidents`),
      openEmergency: t(`${p}.actions.openEmergency`),
      openKnowledgeGraph: t(`${p}.actions.openKnowledgeGraph`),
    },
    sections: {
      crisisAdvisor: t(`${p}.sections.crisisAdvisor`),
      dependencyObservatory: t(`${p}.sections.dependencyObservatory`),
      preparednessEngine: t(`${p}.sections.preparednessEngine`),
      scenarioTesting: t(`${p}.sections.scenarioTesting`),
      crisisCommunication: t(`${p}.sections.crisisCommunication`),
      businessPackIntegration: t(`${p}.sections.businessPackIntegration`),
      resilienceScore: t(`${p}.sections.resilienceScore`),
      audit: t(`${p}.sections.audit`),
    },
    resilienceLabels: {
      strong: t(`${p}.resilienceLabels.strong`),
      stable: t(`${p}.resilienceLabels.stable`),
      vulnerable: t(`${p}.resilienceLabels.vulnerable`),
      critical: t(`${p}.resilienceLabels.critical`),
    },
    severityLevels: {
      minor: t(`${p}.severityLevels.minor`),
      moderate: t(`${p}.severityLevels.moderate`),
      major: t(`${p}.severityLevels.major`),
      critical: t(`${p}.severityLevels.critical`),
    },
  };
}
