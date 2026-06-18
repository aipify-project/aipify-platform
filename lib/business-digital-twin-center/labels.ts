import type { Translator } from "@/lib/i18n/translate";

export function buildBusinessDigitalTwinCenterLabels(t: Translator) {
  const p = "customerApp.businessDigitalTwinCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    sections: {
      organizationModel: t(`${p}.sections.organizationModel`),
      teams: t(`${p}.sections.teams`),
      customers: t(`${p}.sections.customers`),
      vendors: t(`${p}.sections.vendors`),
      projects: t(`${p}.sections.projects`),
      systems: t(`${p}.sections.systems`),
      workflows: t(`${p}.sections.workflows`),
      dependencies: t(`${p}.sections.dependencies`),
      simulations: t(`${p}.sections.simulations`),
    },
    entity: {
      owner: t(`${p}.entity.owner`),
      dependencies: t(`${p}.entity.dependencies`),
      criticality: t(`${p}.entity.criticality`),
    },
    processMapping: {
      title: t(`${p}.processMapping.title`),
      start: t(`${p}.processMapping.start`),
      actions: t(`${p}.processMapping.actions`),
      approvals: t(`${p}.processMapping.approvals`),
      outcomes: t(`${p}.processMapping.outcomes`),
    },
    dependencyIntelligence: {
      title: t(`${p}.dependencyIntelligence.title`),
      suggestedAction: t(`${p}.dependencyIntelligence.suggestedAction`),
    },
    workflowSimulations: {
      title: t(`${p}.workflowSimulations.title`),
      impact: t(`${p}.workflowSimulations.impact`),
    },
    capacityIntelligence: {
      title: t(`${p}.capacityIntelligence.title`),
      workload: t(`${p}.capacityIntelligence.workload`),
      availableResources: t(`${p}.capacityIntelligence.availableResources`),
      bottleneck: t(`${p}.capacityIntelligence.bottleneck`),
      daysToCapacity: t(`${p}.capacityIntelligence.daysToCapacity`),
    },
    operationalImpacts: {
      title: t(`${p}.operationalImpacts.title`),
      impact: t(`${p}.operationalImpacts.impact`),
      risk: t(`${p}.operationalImpacts.risk`),
      affectedTeams: t(`${p}.operationalImpacts.affectedTeams`),
      affectedSystems: t(`${p}.operationalImpacts.affectedSystems`),
    },
    scenarioPlanning: {
      title: t(`${p}.scenarioPlanning.title`),
      best: t(`${p}.scenarioPlanning.best`),
      expected: t(`${p}.scenarioPlanning.expected`),
      worst: t(`${p}.scenarioPlanning.worst`),
      expectedRevenue: t(`${p}.scenarioPlanning.expectedRevenue`),
      expectedSupportLoad: t(`${p}.scenarioPlanning.expectedSupportLoad`),
      expectedStaffing: t(`${p}.scenarioPlanning.expectedStaffing`),
    },
    executiveDashboard: {
      title: t(`${p}.executiveDashboard.title`),
      organizationOverview: t(`${p}.executiveDashboard.organizationOverview`),
      operationalHealth: t(`${p}.executiveDashboard.operationalHealth`),
      dependencies: t(`${p}.executiveDashboard.dependencies`),
      simulations: t(`${p}.executiveDashboard.simulations`),
      strategicRisks: t(`${p}.executiveDashboard.strategicRisks`),
    },
    companionInsights: {
      title: t(`${p}.companionInsights.title`),
      reason: t(`${p}.companionInsights.reason`),
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      resolve: t(`${p}.actions.resolve`),
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
      legacyTwin: t(`${p}.links.legacyTwin`),
      executiveTwin: t(`${p}.links.executiveTwin`),
    },
  };
}

export type BusinessDigitalTwinCenterLabels = ReturnType<typeof buildBusinessDigitalTwinCenterLabels>;

export function getScenarioCaseLabel(
  caseType: string,
  labels: BusinessDigitalTwinCenterLabels["scenarioPlanning"]
): string {
  if (caseType === "best") return labels.best;
  if (caseType === "worst") return labels.worst;
  return labels.expected;
}
