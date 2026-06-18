import type { Translator } from "@/lib/i18n/translate";

export function buildOrganizationalHealthIntelligenceCenterLabels(t: Translator) {
  const p = "customerApp.organizationalHealthIntelligenceCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    organizationScore: t(`${p}.organizationScore`),
    sections: {
      healthOverview: t(`${p}.sections.healthOverview`),
      riskSignals: t(`${p}.sections.riskSignals`),
      performanceTrends: t(`${p}.sections.performanceTrends`),
      teamHealth: t(`${p}.sections.teamHealth`),
      customerHealth: t(`${p}.sections.customerHealth`),
      operationalHealth: t(`${p}.sections.operationalHealth`),
      financialHealth: t(`${p}.sections.financialHealth`),
    },
    healthScores: {
      title: t(`${p}.healthScores.title`),
      contributingFactors: t(`${p}.healthScores.contributingFactors`),
      categories: {
        operations: t(`${p}.healthScores.categories.operations`),
        customers: t(`${p}.healthScores.categories.customers`),
        revenue: t(`${p}.healthScores.categories.revenue`),
        support: t(`${p}.healthScores.categories.support`),
        employees: t(`${p}.healthScores.categories.employees`),
        projects: t(`${p}.healthScores.categories.projects`),
        security: t(`${p}.healthScores.categories.security`),
        compliance: t(`${p}.healthScores.categories.compliance`),
      },
    },
    healthLevel: {
      healthy: t(`${p}.healthLevel.healthy`),
      stable: t(`${p}.healthLevel.stable`),
      requiresAttention: t(`${p}.healthLevel.requiresAttention`),
      critical: t(`${p}.healthLevel.critical`),
    },
    earlyWarning: {
      title: t(`${p}.earlyWarning.title`),
      empty: t(`${p}.earlyWarning.empty`),
    },
    trends: {
      window: t(`${p}.trends.window`),
      direction: t(`${p}.trends.direction`),
      improvement: t(`${p}.trends.improvement`),
      stability: t(`${p}.trends.stability`),
      decline: t(`${p}.trends.decline`),
      windows: {
        "7d": t(`${p}.trends.windows.7d`),
        "30d": t(`${p}.trends.windows.30d`),
        "90d": t(`${p}.trends.windows.90d`),
        "12m": t(`${p}.trends.windows.12m`),
      },
    },
    projectHealth: {
      title: t(`${p}.projectHealth.title`),
      projectStatus: t(`${p}.projectHealth.projectStatus`),
      timelineHealth: t(`${p}.projectHealth.timelineHealth`),
      dependencyHealth: t(`${p}.projectHealth.dependencyHealth`),
      resourceHealth: t(`${p}.projectHealth.resourceHealth`),
      empty: t(`${p}.projectHealth.empty`),
    },
    executiveWarnings: {
      title: t(`${p}.executiveWarnings.title`),
      critical: t(`${p}.executiveWarnings.critical`),
      emerging: t(`${p}.executiveWarnings.emerging`),
      opportunity: t(`${p}.executiveWarnings.opportunity`),
      impact: t(`${p}.executiveWarnings.impact`),
      empty: t(`${p}.executiveWarnings.empty`),
    },
    interventions: {
      title: t(`${p}.interventions.title`),
      reason: t(`${p}.interventions.reason`),
      empty: t(`${p}.interventions.empty`),
    },
    predictiveRisks: {
      title: t(`${p}.predictiveRisks.title`),
      probability: t(`${p}.predictiveRisks.probability`),
      impact: t(`${p}.predictiveRisks.impact`),
      urgency: t(`${p}.predictiveRisks.urgency`),
      contributingFactors: t(`${p}.predictiveRisks.contributingFactors`),
      empty: t(`${p}.predictiveRisks.empty`),
    },
    detailLabel: t(`${p}.detailLabel`),
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
      legacyEngine: t(`${p}.links.legacyEngine`),
      executiveHealth: t(`${p}.links.executiveHealth`),
    },
  };
}

export type OrganizationalHealthIntelligenceCenterLabels = ReturnType<
  typeof buildOrganizationalHealthIntelligenceCenterLabels
>;

export function getHealthLevelLabel(
  level: string,
  labels: OrganizationalHealthIntelligenceCenterLabels["healthLevel"]
): string {
  if (level === "healthy") return labels.healthy;
  if (level === "stable") return labels.stable;
  if (level === "requires_attention") return labels.requiresAttention;
  if (level === "critical") return labels.critical;
  return labels.stable;
}

export function getCategoryLabel(
  key: string,
  labels: OrganizationalHealthIntelligenceCenterLabels["healthScores"]["categories"]
): string {
  return labels[key as keyof typeof labels] ?? key;
}
