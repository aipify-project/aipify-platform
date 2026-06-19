import type { Translator } from "@/lib/i18n/translate";
import type { OrganizationOperationsLabels, OrganizationOperationsTab } from "./types";
import { ENTITY_TYPES, HEALTH_STATUSES, WORKSPACE_TYPES } from "./constants";

const TAB_KEYS: OrganizationOperationsTab[] = [
  "overview",
  "structure",
  "domains",
  "departments",
  "locations",
  "business_units",
  "brands",
  "entities",
  "workspaces",
  "health",
  "executive",
  "reports",
  "companion",
];

export function buildOrganizationOperationsLabels(t: Translator): OrganizationOperationsLabels {
  const p = "organizationOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    structure: t(`${p}.structure`),
    domains: t(`${p}.domains`),
    departments: t(`${p}.departments`),
    locations: t(`${p}.locations`),
    businessUnits: t(`${p}.businessUnits`),
    brands: t(`${p}.brands`),
    entities: t(`${p}.entities`),
    workspaces: t(`${p}.workspaces`),
    health: t(`${p}.health`),
    executive: t(`${p}.executive`),
    reports: t(`${p}.reports`),
    companionInsights: t(`${p}.companionInsights`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    search: t(`${p}.search`),
    createEntity: t(`${p}.createEntity`),
    createBrand: t(`${p}.createBrand`),
    createWorkspace: t(`${p}.createWorkspace`),
    createBusinessUnit: t(`${p}.createBusinessUnit`),
    refreshHealth: t(`${p}.refreshHealth`),
    workspacesLink: t(`${p}.workspacesLink`),
    employeesLink: t(`${p}.employeesLink`),
    domainsLink: t(`${p}.domainsLink`),
    tabs: Object.fromEntries(
      TAB_KEYS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as OrganizationOperationsLabels["tabs"],
    healthStatuses: Object.fromEntries(
      HEALTH_STATUSES.map((key) => [key, t(`${p}.healthStatuses.${key}`)])
    ) as OrganizationOperationsLabels["healthStatuses"],
    entityTypes: Object.fromEntries(
      ENTITY_TYPES.map((key) => [key, t(`${p}.entityTypes.${key}`)])
    ) as OrganizationOperationsLabels["entityTypes"],
    workspaceTypes: Object.fromEntries(
      WORKSPACE_TYPES.map((key) => [key, t(`${p}.workspaceTypes.${key}`)])
    ) as OrganizationOperationsLabels["workspaceTypes"],
  };
}
