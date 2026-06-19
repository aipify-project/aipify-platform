import type { Translator } from "@/lib/i18n/translate";

export function buildBusinessPackRuntimePlatformLabels(t: Translator) {
  const p = "platform.businessPackRuntime";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.emptyState`),
    refresh: t(`${p}.refresh`),
    back: t(`${p}.back`),
    records: t(`${p}.records`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    auditRecent: t(`${p}.auditRecent`),
    reports: t(`${p}.reports`),
    viewInstances: t(`${p}.viewInstances`),
    sections: {
      overview: t(`${p}.sections.overview`),
      installedPacks: t(`${p}.sections.installedPacks`),
      deployments: t(`${p}.sections.deployments`),
      versions: t(`${p}.sections.versions`),
      health: t(`${p}.sections.health`),
      permissions: t(`${p}.sections.permissions`),
      domains: t(`${p}.sections.domains`),
      rollbacks: t(`${p}.sections.rollbacks`),
      incidents: t(`${p}.sections.incidents`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      instances: t(`${p}.stats.instances`),
      healthChecks: t(`${p}.stats.healthChecks`),
      versions: t(`${p}.stats.versions`),
      strategies: t(`${p}.stats.strategies`),
      sandboxes: t(`${p}.stats.sandboxes`),
    },
    executive: {
      runtimeInstances: t(`${p}.executive.runtimeInstances`),
      healthyInstances: t(`${p}.executive.healthyInstances`),
      deployingInstances: t(`${p}.executive.deployingInstances`),
      openIncidents: t(`${p}.executive.openIncidents`),
      verifiedDomains: t(`${p}.executive.verifiedDomains`),
      rollbackSnapshots: t(`${p}.executive.rollbackSnapshots`),
      suspendedProviders: t(`${p}.executive.suspendedProviders`),
    },
  };
}

export function buildBusinessPackRuntimeCustomerLabels(t: Translator) {
  const p = "customerApp.businessPackRuntime";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.emptyState`),
    refresh: t(`${p}.refresh`),
    back: t(`${p}.back`),
    records: t(`${p}.records`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    auditRecent: t(`${p}.auditRecent`),
    viewBilling: t(`${p}.viewBilling`),
    sections: {
      overview: t(`${p}.sections.overview`),
      installed: t(`${p}.sections.installed`),
      health: t(`${p}.sections.health`),
      permissions: t(`${p}.sections.permissions`),
      updates: t(`${p}.sections.updates`),
      billing: t(`${p}.sections.billing`),
    },
    executive: {
      installedPacks: t(`${p}.executive.installedPacks`),
      healthyPacks: t(`${p}.executive.healthyPacks`),
      activePipelines: t(`${p}.executive.activePipelines`),
      pendingUpdates: t(`${p}.executive.pendingUpdates`),
      gracePeriods: t(`${p}.executive.gracePeriods`),
    },
  };
}
