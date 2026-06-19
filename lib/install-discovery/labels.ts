import type { Translator } from "@/lib/i18n/translate";

export function buildInstallDiscoveryLabels(t: Translator) {
  const p = "customerApp.installDiscovery";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    connectedSystems: t(`${p}.connectedSystems`),
    discoveryResults: t(`${p}.discoveryResults`),
    dataSources: t(`${p}.dataSources`),
    importCenter: t(`${p}.importCenter`),
    permissions: t(`${p}.permissions`),
    recommendations: t(`${p}.recommendations`),
    installationStatus: t(`${p}.installationStatus`),
    connectedCount: t(`${p}.connectedCount`),
    discoveryProgress: t(`${p}.discoveryProgress`),
    pendingRecommendations: t(`${p}.pendingRecommendations`),
    pendingPermissions: t(`${p}.pendingPermissions`),
    activeImports: t(`${p}.activeImports`),
    syncIssues: t(`${p}.syncIssues`),
    connectSystem: t(`${p}.connectSystem`),
    disconnectSystem: t(`${p}.disconnectSystem`),
    runDiscovery: t(`${p}.runDiscovery`),
    setDataSource: t(`${p}.setDataSource`),
    startImport: t(`${p}.startImport`),
    analyzeImport: t(`${p}.analyzeImport`),
    completeImport: t(`${p}.completeImport`),
    grantPermission: t(`${p}.grantPermission`),
    revokePermission: t(`${p}.revokePermission`),
    acceptRecommendation: t(`${p}.acceptRecommendation`),
    deferRecommendation: t(`${p}.deferRecommendation`),
    triggerSync: t(`${p}.triggerSync`),
    whereManaged: t(`${p}.whereManaged`),
    inventorySource: t(`${p}.inventorySource`),
    noConnections: t(`${p}.noConnections`),
    noConnectionsHint: t(`${p}.noConnectionsHint`),
    noDiscovery: t(`${p}.noDiscovery`),
    auditLog: t(`${p}.auditLog`),
    missingData: t(`${p}.missingData`),
    syncHealth: t(`${p}.syncHealth`),
    developerSettings: t(`${p}.developerSettings`),
    save: t(`${p}.save`),
  };
}

export type InstallDiscoveryLabels = ReturnType<typeof buildInstallDiscoveryLabels>;
