import {
  APP_PORTAL_NAV,
  APP_PORTAL_NAV_GROUPS,
  APP_SETTINGS_SURFACE_ITEMS,
  type AppPortalNavGroupId,
  type AppPortalNavId,
  type AppPortalNavItem,
} from "@/lib/app-portal/nav-config";
import { APP_NAV_PERMISSION_KEYS } from "@/lib/app-portal/nav-route-access";
import { toCanonicalNavReadiness } from "@/lib/app-production-experience/route-readiness";
import type { CanonicalNavItemContract, NavReadiness, NavVisibilityPolicy } from "./types";

function defaultVisibilityPolicy(
  id: AppPortalNavId,
  readiness: NavReadiness,
  featureKey?: string
): NavVisibilityPolicy {
  if (readiness === "foundation" || readiness === "disabled") return "hidden";
  if (id === "availableBusinessPacks" || id === "softwareCatalog") return "always_when_authorized";
  if (featureKey === "business_packs" && id === "installedBusinessPacks") return "entitled_nav";
  if (featureKey) return "entitled_nav";
  return "always_when_authorized";
}

function pushContract(
  contracts: CanonicalNavItemContract[],
  seen: Set<AppPortalNavId>,
  item: AppPortalNavItem,
  group: AppPortalNavGroupId
) {
  if (seen.has(item.id)) return;
  seen.add(item.id);
  const readiness = toCanonicalNavReadiness(item.id);
  const requiredPermissionKeys = APP_NAV_PERMISSION_KEYS[item.id];
  contracts.push({
    id: item.id,
    localeKey: item.labelKey,
    route: item.href,
    group,
    requiredRole:
      item.id === "organizationSettings" ||
      item.id === "businessPackSettings" ||
      item.id === "kompisBedriftSettings" ||
      item.id === "kompisWebSettings"
        ? "owner_admin"
        : "any",
    requiredFeatureKey: item.featureKey,
    requiredPermissionKeys: requiredPermissionKeys?.length
      ? [...requiredPermissionKeys]
      : undefined,
    requiredEntitlement:
      item.moduleKey ?? (item.id === "installedBusinessPacks" ? "business_packs" : undefined),
    readiness,
    visibilityPolicy: defaultVisibilityPolicy(item.id, readiness, item.featureKey),
  });
}

/**
 * Canonical menu contract from flat product menus + settings surfaces.
 * Shared Faktura/Abonnement ids appear in both product lists but contract once.
 */
export function buildCanonicalNavContracts(): CanonicalNavItemContract[] {
  const contracts: CanonicalNavItemContract[] = [];
  const seen = new Set<AppPortalNavId>();

  for (const group of APP_PORTAL_NAV_GROUPS) {
    for (const item of group.items) {
      pushContract(contracts, seen, item, group.id);
    }
  }
  for (const item of APP_SETTINGS_SURFACE_ITEMS) {
    pushContract(contracts, seen, item, "account");
  }

  return contracts;
}

export function getCanonicalNavContract(id: AppPortalNavId): CanonicalNavItemContract | null {
  return buildCanonicalNavContracts().find((item) => item.id === id) ?? null;
}

export function assertCanonicalNavIntegrity(contracts = buildCanonicalNavContracts()): void {
  const ids = new Set<string>();
  for (const item of contracts) {
    if (ids.has(item.id)) {
      throw new Error(`Duplicate canonical nav id: ${item.id}`);
    }
    ids.add(item.id);
  }
  // Shared invoice/subscription ids may appear in both product order lists — unique registry is APP_PORTAL_NAV.
  const registryIds = APP_PORTAL_NAV.map((item) => item.id);
  if (new Set(registryIds).size !== registryIds.length) {
    throw new Error("APP_PORTAL_NAV contains duplicate item ids");
  }
}
