import {
  APP_PORTAL_NAV_GROUPS,
  type AppPortalNavId,
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

/**
 * Canonical menu contract derived from APP_PORTAL_NAV_GROUPS + readiness registry.
 * Mega-nav (lib/app/nav-config.ts) must not grow — this is the customer menu source.
 */
export function buildCanonicalNavContracts(): CanonicalNavItemContract[] {
  const contracts: CanonicalNavItemContract[] = [];
  const seen = new Set<AppPortalNavId>();

  for (const group of APP_PORTAL_NAV_GROUPS) {
    for (const item of group.items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      const readiness = toCanonicalNavReadiness(item.id);
      const requiredPermissionKeys = APP_NAV_PERMISSION_KEYS[item.id];
      contracts.push({
        id: item.id,
        localeKey: item.labelKey,
        route: item.href,
        group: group.id,
        requiredRole:
          item.id === "organizationSettings" || item.id === "businessPackSettings"
            ? "owner_admin"
            : "any",
        requiredFeatureKey: item.featureKey,
        requiredPermissionKeys: requiredPermissionKeys?.length
          ? [...requiredPermissionKeys]
          : undefined,
        requiredEntitlement:
          item.id === "installedBusinessPacks" ? "business_packs" : undefined,
        readiness,
        visibilityPolicy: defaultVisibilityPolicy(item.id, readiness, item.featureKey),
      });
    }
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
  const registryIds = APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));
  const registrySet = new Set(registryIds);
  if (registrySet.size !== registryIds.length) {
    throw new Error("APP_PORTAL_NAV_GROUPS contains duplicate item ids");
  }
}
