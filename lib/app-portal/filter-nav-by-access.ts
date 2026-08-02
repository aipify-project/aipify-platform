import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppNavGroupConfig } from "@/lib/app/build-nav";
import {
  resolveCanonicalNavVisibility,
  type NavResolverContext,
} from "@/lib/app-portal/canonical-nav";
import { APP_PORTAL_NAV_GROUPS, type AppPortalNavId } from "@/lib/app-portal/nav-config";
import { APP_NAV_PERMISSION_KEYS } from "@/lib/app-portal/nav-route-access";
import { resolvePortalFeatureEnabled } from "@/lib/app-portal/feature-entitlements";
import { parseAppPortalFeatureAccess } from "@/lib/app-portal/parse";
import {
  isAppRouteNavVisible,
  resolveAppRouteHref,
} from "@/lib/app-production-experience/route-readiness";
import { getOrganizationBusinessPackActivationGates } from "@/lib/business-pack-activation-gate";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

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
  const { data: contextData } = await supabase.rpc("get_app_organization_context");
  const context = parseAppOrganizationContext(contextData);
  const fallbackPlanKey =
    context.state === "ready" ? context.plan_name?.toLowerCase() ?? null : null;

  const results = await Promise.all(
    unique.map(async (feature) => {
      const { data, error } = await supabase.rpc("get_app_portal_feature_access", {
        p_feature: feature,
      });
      if (error) {
        return [feature, resolvePortalFeatureEnabled(feature, fallbackPlanKey)] as const;
      }
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

async function buildResolverContext(supabase: SupabaseClient): Promise<NavResolverContext> {
  const featureKeys = [...new Set([...FEATURE_BY_NAV_ID.values()])];
  const permissionKeys = [
    ...new Set(Object.values(APP_NAV_PERMISSION_KEYS).flatMap((keys) => keys ?? [])),
  ];

  const [featureEnabled, permissionGranted, contextData, activationGates] = await Promise.all([
    featureKeys.length ? loadFeatureAccess(supabase, featureKeys) : Promise.resolve(new Map()),
    permissionKeys.length
      ? loadPermissionAccess(supabase, permissionKeys)
      : Promise.resolve(new Map()),
    supabase.rpc("get_app_organization_context"),
    getOrganizationBusinessPackActivationGates(supabase).catch(() => ({ found: false as const })),
  ]);

  const context = parseAppOrganizationContext(contextData.data);
  const activePackKeys = new Set<string>();
  const pendingPackKeys = new Set<string>();
  if (activationGates.found && activationGates.items) {
    for (const item of activationGates.items) {
      if (item.activation_status === "active") activePackKeys.add(item.pack_key);
      if (
        item.activation_status === "pending_activation" ||
        item.activation_status === "validating"
      ) {
        pendingPackKeys.add(item.pack_key);
      }
    }
  }

  return {
    organizationRole: context.organization_role ?? context.user_role,
    featureEnabled,
    permissionGranted,
    activePackKeys,
    pendingPackKeys,
    activeModuleKeys: new Set(),
  };
}

/**
 * Filter grouped nav using canonical readiness + role + feature/permission entitlement.
 * Page-local visibility logic is forbidden — this is the server gate.
 */
export async function filterNavGroupsByAccess(
  supabase: SupabaseClient,
  groups: AppNavGroupConfig[]
): Promise<AppNavGroupConfig[]> {
  const ctx = await buildResolverContext(supabase);
  const resolution = resolveCanonicalNavVisibility(ctx);
  const visible = new Set(resolution.visibleNavIds);

  return groups
    .map((group) => ({
      ...group,
      items: group.items
        .filter((item) => {
          if (!isAppRouteNavVisible(item.id as AppPortalNavId)) return false;
          return visible.has(item.id as AppPortalNavId);
        })
        .map((item) => ({
          ...item,
          href: resolveAppRouteHref(item.id as AppPortalNavId, item.href),
        })),
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
