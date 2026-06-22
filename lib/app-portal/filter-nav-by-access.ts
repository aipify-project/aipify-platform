import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppNavGroupConfig } from "@/lib/app/build-nav";
import { APP_PORTAL_NAV_GROUPS } from "@/lib/app-portal/nav-config";
import { APP_NAV_PERMISSION_KEYS } from "@/lib/app-portal/nav-route-access";
import { parseAppPortalFeatureAccess } from "@/lib/app-portal/parse";

const FEATURE_BY_NAV_ID = new Map(
  APP_PORTAL_NAV_GROUPS.flatMap((group) =>
    group.items
      .filter((item) => item.featureKey)
      .map((item) => [item.id, item.featureKey!] as const)
  )
);

async function loadFeatureAccess(
  supabase: SupabaseClient,
  featureKeys: string[]
): Promise<Map<string, boolean>> {
  const unique = [...new Set(featureKeys)];
  const results = await Promise.all(
    unique.map(async (feature) => {
      const { data, error } = await supabase.rpc("get_app_portal_feature_access", {
        p_feature: feature,
      });
      if (error) return [feature, true] as const;
      const parsed = parseAppPortalFeatureAccess(data);
      return [feature, parsed.enabled] as const;
    })
  );
  return new Map(results);
}

async function loadPermissionAccess(
  supabase: SupabaseClient,
  permissionKeys: string[]
): Promise<Map<string, boolean>> {
  const unique = [...new Set(permissionKeys)];
  const results = await Promise.all(
    unique.map(async (permissionKey) => {
      const { data, error } = await supabase.rpc("has_organization_permission", {
        p_permission_key: permissionKey,
      });
      if (error) return [permissionKey, false] as const;
      return [permissionKey, data === true] as const;
    })
  );
  return new Map(results);
}

function isNavItemVisible(
  navId: string,
  featureAccess: Map<string, boolean>,
  permissionAccess: Map<string, boolean>
): boolean {
  const featureKey = FEATURE_BY_NAV_ID.get(navId as never);
  if (featureKey && featureAccess.get(featureKey) === false) {
    return false;
  }

  const permissionKeys = APP_NAV_PERMISSION_KEYS[navId as keyof typeof APP_NAV_PERMISSION_KEYS];
  if (permissionKeys?.length) {
    const allowed = permissionKeys.some((key) => permissionAccess.get(key) === true);
    if (!allowed) return false;
  }

  return true;
}

export async function filterNavGroupsByAccess(
  supabase: SupabaseClient,
  groups: AppNavGroupConfig[]
): Promise<AppNavGroupConfig[]> {
  const gatedNavIds = new Set<string>([
    ...FEATURE_BY_NAV_ID.keys(),
    ...Object.keys(APP_NAV_PERMISSION_KEYS),
  ]);

  const featureKeys = [...new Set([...FEATURE_BY_NAV_ID.values()])];
  const permissionKeys = [
    ...new Set(Object.values(APP_NAV_PERMISSION_KEYS).flatMap((keys) => keys ?? [])),
  ];

  const [featureAccess, permissionAccess] = await Promise.all([
    featureKeys.length ? loadFeatureAccess(supabase, featureKeys) : Promise.resolve(new Map()),
    permissionKeys.length ? loadPermissionAccess(supabase, permissionKeys) : Promise.resolve(new Map()),
  ]);

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!gatedNavIds.has(item.id)) return true;
        return isNavItemVisible(item.id, featureAccess, permissionAccess);
      }),
    }))
    .filter((group) => group.items.length > 0);
}

export function filterFlatNavByAccess(
  navConfig: AppNavGroupConfig["items"],
  groups: AppNavGroupConfig[]
): AppNavGroupConfig["items"] {
  const visibleIds = new Set(groups.flatMap((group) => group.items.map((item) => item.id)));
  return navConfig.filter((item) => visibleIds.has(item.id));
}
