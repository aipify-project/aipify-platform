/** Phase 501 — Module Registry Engine */

export const MODULE_REGISTRY_CATEGORIES = [
  "core",
  "operations",
  "knowledge",
  "companion",
  "governance",
  "finance",
  "support",
  "commerce",
  "hosts",
  "warehouse",
  "growth_partner",
  "customer_success",
  "revenue",
  "reports",
  "settings",
] as const;

export type ModuleRegistryCategory = (typeof MODULE_REGISTRY_CATEGORIES)[number];

export const MODULE_PERMISSION_KINDS = [
  "view",
  "create",
  "edit",
  "delete",
  "manage",
  "report",
  "approve",
  "custom",
] as const;

export type ModulePermissionKind = (typeof MODULE_PERMISSION_KINDS)[number];

export const BUSINESS_PACK_MODULE_KEYS = [
  "support_pack",
  "commerce_pack",
  "warehouse_pack",
  "hosts_pack",
] as const;

export type BusinessPackModuleKey = (typeof BUSINESS_PACK_MODULE_KEYS)[number];

export const MODULE_REGISTRY_PRINCIPLE =
  "PLATFORM sells modules · APP buys modules · APP grants access · EMPLOYEES use modules";

export const MODULE_REGISTRY_SINGLE_APP_RULE =
  "One APP. Many modules. No separate module portals — employees log into the same APP.";

export type RegistryModule = {
  moduleId: string;
  moduleKey: string;
  moduleName: string;
  moduleSlug: string;
  moduleCategory: string;
  description: string;
  requiredPlan?: string;
  requiredBusinessPack?: string;
  navigationLocation: string;
  routeHref?: string;
  defaultVisibility: string;
  status: string;
  sortOrder: number;
  permissionCount?: number;
};

export type NavigationModule = {
  moduleKey: string;
  moduleName: string;
  moduleSlug: string;
  navigationLocation: string;
  routeHref?: string;
  moduleCategory: string;
  licensed?: boolean;
  menuVisible?: boolean;
  activationSource?: string;
  requiredBusinessPack?: string;
  status?: string;
};

export type RoleModuleGrant = {
  moduleKey: string;
  roleKey: string;
  canView: boolean;
  canUse: boolean;
  canManage: boolean;
};

export type SuperAdminModuleRegistryCenter = {
  found: boolean;
  error?: string;
  principle?: string;
  privacyNote?: string;
  modules: RegistryModule[];
  categories: string[];
  businessPacks: string[];
  recentAudit: Array<{ id: string; actionType: string; moduleKey?: string; summary: string; createdAt: string }>;
  stats: { totalModules: number; activeModules: number; coreModules: number; packModules: number };
};

export type PlatformModuleRegistryOverview = {
  found: boolean;
  error?: string;
  privacyNote?: string;
  catalog: { total: number; byCategory: Record<string, number> };
  adoption: { organizationsWithModules: number; activeActivations: number; businessPackActivations: number };
  businessPacks: Array<{ packKey: string; modules: number }>;
};

export type CustomerModuleRegistryCenter = {
  found: boolean;
  error?: string;
  organizationId?: string;
  appLicenseActive?: boolean;
  principle?: string;
  privacyNote?: string;
  navigationModules: NavigationModule[];
  roleGrants: RoleModuleGrant[];
  supportedRoles: string[];
  permissionTypes: string[];
};
