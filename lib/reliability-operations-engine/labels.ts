import type { Translator } from "@/lib/i18n/translate";

export function buildReliabilityOperationsLabels(t: Translator) {
  const p = "platform.reliabilityOperations";
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
    sections: {
      overview: t(`${p}.sections.overview`),
      services: t(`${p}.sections.services`),
      incidents: t(`${p}.sections.incidents`),
      healthSignals: t(`${p}.sections.healthSignals`),
      selfHealing: t(`${p}.sections.selfHealing`),
      dependencies: t(`${p}.sections.dependencies`),
      serviceLevels: t(`${p}.sections.serviceLevels`),
      maintenance: t(`${p}.sections.maintenance`),
      statusCommunication: t(`${p}.sections.statusCommunication`),
      reports: t(`${p}.sections.reports`),
    },
    status: {
      operational: t(`${p}.status.operational`),
      degraded: t(`${p}.status.degraded`),
      disruption: t(`${p}.status.disruption`),
      recovery: t(`${p}.status.recovery`),
      restricted: t(`${p}.status.restricted`),
      verified_restored: t(`${p}.status.verifiedRestored`),
      planned_maintenance: t(`${p}.status.plannedMaintenance`),
    },
  };
}

export function buildSystemHealthLabels(t: Translator) {
  const p = "customerApp.systemHealth";
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
    overallHealth: t(`${p}.overallHealth`),
    auditRecent: t(`${p}.auditRecent`),
    sections: {
      overview: t(`${p}.sections.overview`),
      connectedApps: t(`${p}.sections.connectedApps`),
      businessPacks: t(`${p}.sections.businessPacks`),
      workflows: t(`${p}.sections.workflows`),
      domains: t(`${p}.sections.domains`),
      notifications: t(`${p}.sections.notifications`),
      recentIncidents: t(`${p}.sections.recentIncidents`),
      maintenance: t(`${p}.sections.maintenance`),
      support: t(`${p}.sections.support`),
    },
    status: {
      connected: t(`${p}.status.connected`),
      degraded: t(`${p}.status.degraded`),
      disconnected: t(`${p}.status.disconnected`),
      operational: t(`${p}.status.operational`),
      valid: t(`${p}.status.valid`),
      expiring: t(`${p}.status.expiring`),
      healthy: t(`${p}.status.healthy`),
      scheduled: t(`${p}.status.scheduled`),
      available: t(`${p}.status.available`),
    },
  };
}

export function reliabilityStatusLabel(
  labels: ReturnType<typeof buildReliabilityOperationsLabels>["status"],
  status: unknown
): string {
  const key = String(status ?? "operational").toLowerCase().replace(/-/g, "_") as keyof typeof labels;
  return labels[key] ?? String(status ?? "");
}

export function systemHealthStatusLabel(
  labels: ReturnType<typeof buildSystemHealthLabels>["status"],
  status: unknown
): string {
  const key = String(status ?? "operational").toLowerCase().replace(/-/g, "_") as keyof typeof labels;
  return labels[key] ?? String(status ?? "");
}
