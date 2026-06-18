import type {
  CustomerModuleRegistryCenter,
  NavigationModule,
  PlatformModuleRegistryOverview,
  RegistryModule,
  RoleModuleGrant,
  SuperAdminModuleRegistryCenter,
} from "./types";

function rec(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function bool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseRegistryModule(raw: unknown): RegistryModule {
  const d = rec(raw);
  return {
    moduleId: str(d.module_id),
    moduleKey: str(d.module_key),
    moduleName: str(d.module_name),
    moduleSlug: str(d.module_slug),
    moduleCategory: str(d.module_category),
    description: str(d.description),
    requiredPlan: str(d.required_plan) || undefined,
    requiredBusinessPack: str(d.required_business_pack) || undefined,
    navigationLocation: str(d.navigation_location, "main"),
    routeHref: str(d.route_href) || undefined,
    defaultVisibility: str(d.default_visibility, "licensed"),
    status: str(d.status, "active"),
    sortOrder: num(d.sort_order),
    permissionCount: num(d.permission_count),
  };
}

function parseNavModule(raw: unknown): NavigationModule {
  const d = rec(raw);
  return {
    moduleKey: str(d.module_key),
    moduleName: str(d.module_name),
    moduleSlug: str(d.module_slug),
    navigationLocation: str(d.navigation_location),
    routeHref: str(d.route_href) || undefined,
    moduleCategory: str(d.module_category),
    licensed: d.licensed === undefined ? undefined : bool(d.licensed),
    menuVisible: d.menu_visible === undefined ? undefined : bool(d.menu_visible),
    activationSource: str(d.activation_source) || undefined,
    requiredBusinessPack: str(d.required_business_pack) || undefined,
    status: str(d.status) || undefined,
  };
}

function parseGrant(raw: unknown): RoleModuleGrant {
  const d = rec(raw);
  return {
    moduleKey: str(d.module_key),
    roleKey: str(d.role_key),
    canView: bool(d.can_view),
    canUse: bool(d.can_use),
    canManage: bool(d.can_manage),
  };
}

export function parseSuperAdminModuleRegistryCenter(raw: unknown): SuperAdminModuleRegistryCenter {
  const d = rec(raw);
  if (!d.found) return { found: false, error: str(d.error) || undefined, modules: [], categories: [], businessPacks: [], recentAudit: [], stats: { totalModules: 0, activeModules: 0, coreModules: 0, packModules: 0 } };
  const stats = rec(d.stats);
  return {
    found: true,
    principle: str(d.principle) || undefined,
    privacyNote: str(d.privacy_note) || undefined,
    modules: Array.isArray(d.modules) ? d.modules.map(parseRegistryModule) : [],
    categories: Array.isArray(d.categories) ? d.categories.map((c) => str(c)) : [],
    businessPacks: Array.isArray(d.business_packs) ? d.business_packs.map((p) => str(p)) : [],
    recentAudit: Array.isArray(d.recent_audit)
      ? d.recent_audit.map((a) => {
          const r = rec(a);
          return { id: str(r.id), actionType: str(r.action_type), moduleKey: str(r.module_key) || undefined, summary: str(r.summary), createdAt: str(r.created_at) };
        })
      : [],
    stats: {
      totalModules: num(stats.total_modules),
      activeModules: num(stats.active_modules),
      coreModules: num(stats.core_modules),
      packModules: num(stats.pack_modules),
    },
  };
}

export function parsePlatformModuleRegistryOverview(raw: unknown): PlatformModuleRegistryOverview {
  const d = rec(raw);
  if (!d.found) return { found: false, error: str(d.error) || undefined, catalog: { total: 0, byCategory: {} }, adoption: { organizationsWithModules: 0, activeActivations: 0, businessPackActivations: 0 }, businessPacks: [] };
  const catalog = rec(d.catalog);
  const adoption = rec(d.adoption);
  return {
    found: true,
    privacyNote: str(d.privacy_note) || undefined,
    catalog: { total: num(catalog.total), byCategory: rec(catalog.by_category) as Record<string, number> },
    adoption: {
      organizationsWithModules: num(adoption.organizations_with_modules),
      activeActivations: num(adoption.active_activations),
      businessPackActivations: num(adoption.business_pack_activations),
    },
    businessPacks: Array.isArray(d.business_packs)
      ? d.business_packs.map((p) => {
          const r = rec(p);
          return { packKey: str(r.pack_key), modules: num(r.modules) };
        })
      : [],
  };
}

export function parseCustomerModuleRegistryCenter(raw: unknown): CustomerModuleRegistryCenter {
  const d = rec(raw);
  if (!d.found) return { found: false, error: str(d.error) || undefined, navigationModules: [], roleGrants: [], supportedRoles: [], permissionTypes: [] };
  return {
    found: true,
    error: str(d.error) || undefined,
    organizationId: str(d.organization_id) || undefined,
    appLicenseActive: d.app_license_active === undefined ? undefined : bool(d.app_license_active),
    principle: str(d.principle) || undefined,
    privacyNote: str(d.privacy_note) || undefined,
    navigationModules: Array.isArray(d.navigation_modules) ? d.navigation_modules.map(parseNavModule) : [],
    roleGrants: Array.isArray(d.role_grants) ? d.role_grants.map(parseGrant) : [],
    supportedRoles: Array.isArray(d.supported_roles) ? d.supported_roles.map((r) => str(r)) : [],
    permissionTypes: Array.isArray(d.permission_types) ? d.permission_types.map((p) => str(p)) : [],
  };
}

export function parseCustomerAppNavigationModules(raw: unknown): { found: boolean; modules: NavigationModule[] } {
  const d = rec(raw);
  return {
    found: bool(d.found),
    modules: Array.isArray(d.modules) ? d.modules.map(parseNavModule) : [],
  };
}
