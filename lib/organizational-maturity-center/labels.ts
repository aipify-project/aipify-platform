import type { Translator } from "@/lib/i18n/translate";
import type { MaturityLevelLabel } from "./types";

export function buildOrganizationalMaturityCenterLabels(t: Translator) {
  const p = "customerApp.organizationalMaturityCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    explanation: t(`${p}.explanation`),
    level: t(`${p}.level`),
    sections: {
      maturityOverview: t(`${p}.sections.maturityOverview`),
      departmentMaturity: t(`${p}.sections.departmentMaturity`),
      processMaturity: t(`${p}.sections.processMaturity`),
      technologyMaturity: t(`${p}.sections.technologyMaturity`),
      knowledgeMaturity: t(`${p}.sections.knowledgeMaturity`),
      governanceMaturity: t(`${p}.sections.governanceMaturity`),
      customerExperienceMaturity: t(`${p}.sections.customerExperienceMaturity`),
      improvementRoadmap: t(`${p}.sections.improvementRoadmap`),
    },
    maturityLevels: {
      emerging: t(`${p}.maturityLevels.emerging`),
      developing: t(`${p}.maturityLevels.developing`),
      structured: t(`${p}.maturityLevels.structured`),
      optimized: t(`${p}.maturityLevels.optimized`),
      world_class: t(`${p}.maturityLevels.worldClass`),
    },
    maturityScoring: { title: t(`${p}.maturityScoring.title`), score: t(`${p}.maturityScoring.score`) },
    benchmarking: { title: t(`${p}.benchmarking.title`), comparison: t(`${p}.benchmarking.comparison`) },
    departmentAnalysis: {
      title: t(`${p}.departmentAnalysis.title`),
      department: t(`${p}.departmentAnalysis.department`),
      dimension: t(`${p}.departmentAnalysis.dimension`),
    },
    improvementRoadmaps: {
      title: t(`${p}.improvementRoadmaps.title`),
      currentState: t(`${p}.improvementRoadmaps.currentState`),
      targetState: t(`${p}.improvementRoadmaps.targetState`),
      requiredImprovements: t(`${p}.improvementRoadmaps.requiredImprovements`),
      expectedBenefits: t(`${p}.improvementRoadmaps.expectedBenefits`),
    },
    selfEvolution: { title: t(`${p}.selfEvolution.title`), learningNote: t(`${p}.selfEvolution.learningNote`) },
    growthPlanning: {
      title: t(`${p}.growthPlanning.title`),
      requiredActions: t(`${p}.growthPlanning.requiredActions`),
      horizons: {
        "90_day": t(`${p}.growthPlanning.horizons.ninetyDay`),
        "6_month": t(`${p}.growthPlanning.horizons.sixMonth`),
        "12_month": t(`${p}.growthPlanning.horizons.twelveMonth`),
      },
    },
    businessPackMaturity: { title: t(`${p}.businessPackMaturity.title`) },
    executiveDashboard: {
      title: t(`${p}.executiveDashboard.title`),
      currentMaturityScore: t(`${p}.executiveDashboard.currentMaturityScore`),
      growthTrend: t(`${p}.executiveDashboard.growthTrend`),
      highestPerformingAreas: t(`${p}.executiveDashboard.highestPerformingAreas`),
      lowestPerformingAreas: t(`${p}.executiveDashboard.lowestPerformingAreas`),
      recommendedPriorities: t(`${p}.executiveDashboard.recommendedPriorities`),
      trends: {
        improving: t(`${p}.executiveDashboard.trends.improving`),
        stable: t(`${p}.executiveDashboard.trends.stable`),
        declining: t(`${p}.executiveDashboard.trends.declining`),
      },
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      approve: t(`${p}.actions.approve`),
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
      legacyEngine: t(`${p}.links.legacyEngine`),
      executiveMaturity: t(`${p}.links.executiveMaturity`),
    },
  };
}

export type OrganizationalMaturityCenterLabels = ReturnType<typeof buildOrganizationalMaturityCenterLabels>;

export function getMaturityLevelLabel(
  levelLabel: MaturityLevelLabel,
  labels: OrganizationalMaturityCenterLabels["maturityLevels"],
): string {
  if (levelLabel === "world_class") return labels.world_class;
  return labels[levelLabel] ?? labels.developing;
}

export function getGrowthHorizonLabel(
  horizonKey: string,
  labels: OrganizationalMaturityCenterLabels["growthPlanning"]["horizons"],
): string {
  if (horizonKey === "90_day") return labels["90_day"];
  if (horizonKey === "6_month") return labels["6_month"];
  if (horizonKey === "12_month") return labels["12_month"];
  return horizonKey;
}
