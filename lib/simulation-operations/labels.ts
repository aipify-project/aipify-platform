import type { Translator } from "@/lib/i18n/translate";

export function buildSimulationOperationsLabels(t: Translator) {
  const p = "customerApp.simulationOperations";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    organizationTwin: t(`${p}.organizationTwin`),
    scenarios: t(`${p}.scenarios`),
    forecasts: t(`${p}.forecasts`),
    experiments: t(`${p}.experiments`),
    comparisons: t(`${p}.comparisons`),
    decisionLab: t(`${p}.decisionLab`),
    reports: t(`${p}.reports`),
    executive: t(`${p}.executive`),
    scenarioCount: t(`${p}.scenarioCount`),
    activeSimulations: t(`${p}.activeSimulations`),
    runCount: t(`${p}.runCount`),
    decisionOptions: t(`${p}.decisionOptions`),
    runSimulation: t(`${p}.runSimulation`),
    createScenario: t(`${p}.createScenario`),
    simulationWorkflow: t(`${p}.simulationWorkflow`),
    riskIntegration: t(`${p}.riskIntegration`),
    learningLoop: t(`${p}.learningLoop`),
    companionAdvisor: t(`${p}.companionAdvisor`),
    executiveSimulation: t(`${p}.executiveSimulation`),
    businessPackIntegration: t(`${p}.businessPackIntegration`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    searchScenarios: t(`${p}.searchScenarios`),
    noItems: t(`${p}.noItems`),
    emptyHint: t(`${p}.emptyHint`),
    auditLog: t(`${p}.auditLog`),
    confidence: t(`${p}.confidence`),
    revenueImpact: t(`${p}.revenueImpact`),
    costImpact: t(`${p}.costImpact`),
    scenariosTitle: t(`${p}.scenariosTitle`),
    scenariosSubtitle: t(`${p}.scenariosSubtitle`),
    decisionLabTitle: t(`${p}.decisionLabTitle`),
    decisionLabSubtitle: t(`${p}.decisionLabSubtitle`),
  };
}

export type SimulationOperationsLabels = ReturnType<typeof buildSimulationOperationsLabels>;
