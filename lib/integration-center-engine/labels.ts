import type { Translator } from "@/lib/i18n/translate";

export function buildIntegrationCenterLabels(t: Translator) {
  const p = "customerApp.integrationCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    actionCapabilities: t(`${p}.actionCapabilities`),
    externalActionGovernance: t(`${p}.externalActionGovernance`),
    dataSyncEngine: t(`${p}.dataSyncEngine`),
    marketplaceFoundation: t(`${p}.marketplaceFoundation`),
    businessPackIntegration: t(`${p}.businessPackIntegration`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    integrationReport: t(`${p}.integrationReport`),
    mobileAccess: t(`${p}.mobileAccess`),
    healthStatus: {
      healthy: t(`${p}.healthStatus.healthy`),
      needs_attention: t(`${p}.healthStatus.needsAttention`),
      connection_failed: t(`${p}.healthStatus.connectionFailed`),
    },
    sections: {
      overview: t(`${p}.sections.overview`),
      connectedApps: t(`${p}.sections.connectedApps`),
      availableApps: t(`${p}.sections.availableApps`),
      apiKeys: t(`${p}.sections.apiKeys`),
      permissions: t(`${p}.sections.permissions`),
      logs: t(`${p}.sections.logs`),
      health: t(`${p}.sections.health`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      connectedApps: t(`${p}.stats.connectedApps`),
      availableApps: t(`${p}.stats.availableApps`),
      activeApiKeys: t(`${p}.stats.activeApiKeys`),
      capabilities: t(`${p}.stats.capabilities`),
      marketplaceCategories: t(`${p}.stats.marketplaceCategories`),
    },
    executive: {
      connectedApps: t(`${p}.executive.connectedApps`),
      healthyConnections: t(`${p}.executive.healthyConnections`),
      needsAttention: t(`${p}.executive.needsAttention`),
      failedConnections: t(`${p}.executive.failedConnections`),
      permissionRisks: t(`${p}.executive.permissionRisks`),
      recentSyncs: t(`${p}.executive.recentSyncs`),
    },
  };
}
