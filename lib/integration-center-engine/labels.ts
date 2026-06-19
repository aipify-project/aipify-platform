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
    businessPackIntegration: t(`${p}.businessPackIntegration`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    integrationAdvisor: t(`${p}.integrationAdvisor`),
    mobileAccess: t(`${p}.mobileAccess`),
    marketplaceFoundation: t(`${p}.marketplaceFoundation`),
    healthStatus: {
      healthy: t(`${p}.healthStatus.healthy`),
      attention: t(`${p}.healthStatus.attention`),
      failed: t(`${p}.healthStatus.failed`),
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
      openHealthIssues: t(`${p}.stats.openHealthIssues`),
    },
    executive: {
      connectedApps: t(`${p}.executive.connectedApps`),
      healthyConnections: t(`${p}.executive.healthyConnections`),
      failedConnections: t(`${p}.executive.failedConnections`),
      attentionRequired: t(`${p}.executive.attentionRequired`),
      permissionRisks: t(`${p}.executive.permissionRisks`),
    },
  };
}
