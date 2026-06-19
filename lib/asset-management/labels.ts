import type { Translator } from "@/lib/i18n/translate";

export function buildAssetManagementLabels(t: Translator) {
  const p = "customerApp.assetManagement";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    assets: t(`${p}.assets`),
    equipment: t(`${p}.equipment`),
    vehicles: t(`${p}.vehicles`),
    properties: t(`${p}.properties`),
    itEquipment: t(`${p}.itEquipment`),
    softwareLicenses: t(`${p}.softwareLicenses`),
    assignments: t(`${p}.assignments`),
    maintenance: t(`${p}.maintenance`),
    reports: t(`${p}.reports`),
    active: t(`${p}.active`),
    reserved: t(`${p}.reserved`),
    maintenanceRequired: t(`${p}.maintenanceRequired`),
    restricted: t(`${p}.restricted`),
    retired: t(`${p}.retired`),
    createAsset: t(`${p}.createAsset`),
    assetName: t(`${p}.assetName`),
    category: t(`${p}.category`),
    status: t(`${p}.status`),
    assignedTo: t(`${p}.assignedTo`),
    department: t(`${p}.department`),
    domain: t(`${p}.domain`),
    warranty: t(`${p}.warranty`),
    noAssets: t(`${p}.noAssets`),
    noAssetsHint: t(`${p}.noAssetsHint`),
    scheduleMaintenance: t(`${p}.scheduleMaintenance`),
    reportIssue: t(`${p}.reportIssue`),
    totalValue: t(`${p}.totalValue`),
    maintenanceCosts: t(`${p}.maintenanceCosts`),
    licenseSeats: t(`${p}.licenseSeats`),
    auditLog: t(`${p}.auditLog`),
    calendarLink: t(`${p}.calendarLink`),
    organizationLink: t(`${p}.organizationLink`),
    vehiclesTitle: t(`${p}.vehiclesTitle`),
    backToAssets: t(`${p}.backToAssets`),
    save: t(`${p}.save`),
  };
}

export type AssetManagementLabels = ReturnType<typeof buildAssetManagementLabels>;
