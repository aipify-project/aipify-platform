import type { SupabaseClient } from "@supabase/supabase-js";
import { APP_PORTAL_NAV_GROUPS } from "@/lib/app-portal/nav-config";
import { APP_NAV_PERMISSION_KEYS } from "@/lib/app-portal/nav-route-access";
import { resolvePortalFeatureEnabled } from "@/lib/app-portal/feature-entitlements";
import { parseAppPortalFeatureAccess } from "@/lib/app-portal/parse";
import { getOrganizationBusinessPackActivationGates } from "@/lib/business-pack-activation-gate";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import {
  buildFailClosedAppMenuCapabilityBundle,
  resolveAppMenuCapabilityBundle,
} from "./resolve";
import type { AppMenuCapabilityBundle } from "./types";

const FEATURE_KEYS = [
  ...new Set(
    APP_PORTAL_NAV_GROUPS.flatMap((group) =>
      group.items.map((item) => item.featureKey).filter((key): key is string => Boolean(key))
    )
  ),
];

const PERMISSION_KEYS = [
  ...new Set(Object.values(APP_NAV_PERMISSION_KEYS).flatMap((keys) => keys ?? [])),
];

async function loadFeatureAccess(
  supabase: SupabaseClient,
  planKey: string | null
): Promise<Map<string, boolean>> {
  const results = await Promise.all(
    FEATURE_KEYS.map(async (feature) => {
      const { data, error } = await supabase.rpc("get_app_portal_feature_access", {
        p_feature: feature,
      });
      if (error) {
        return [feature, resolvePortalFeatureEnabled(feature, planKey)] as const;
      }
      return [feature, parseAppPortalFeatureAccess(data).enabled] as const;
    })
  );
  return new Map(results);
}

async function loadPermissionAccess(supabase: SupabaseClient): Promise<Map<string, boolean>> {
  const results = await Promise.all(
    PERMISSION_KEYS.map(async (permissionKey) => {
      const { data, error } = await supabase.rpc("has_organization_permission", {
        p_permission_key: permissionKey,
      });
      if (error) return [permissionKey, false] as const;
      return [permissionKey, data === true] as const;
    })
  );
  return new Map(results);
}

/**
 * Server-side Core loader for the Customer APP menu capability bundle.
 * Organization and user come from trusted session RPCs — never from client body.
 */
export async function loadAppMenuCapabilityBundle(
  supabase: SupabaseClient
): Promise<AppMenuCapabilityBundle> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return buildFailClosedAppMenuCapabilityBundle({
      organizationId: null,
      userId: null,
      role: null,
    });
  }

  try {
    const { data: contextData } = await supabase.rpc("get_app_organization_context");
    const context = parseAppOrganizationContext(contextData);
    const planKey =
      context.state === "ready" ? context.plan_name?.toLowerCase() ?? null : null;

    const [featureEnabled, permissionGranted, activationGates] = await Promise.all([
      loadFeatureAccess(supabase, planKey),
      loadPermissionAccess(supabase),
      getOrganizationBusinessPackActivationGates(supabase).catch(() => ({
        found: false as const,
        items: [] as const,
      })),
    ]);

    const activePackKeys = new Set<string>();
    const pendingPackKeys = new Set<string>();
    const revokedPackKeys = new Set<string>();
    if (activationGates.found && activationGates.items) {
      for (const item of activationGates.items) {
        if (item.activation_status === "active") activePackKeys.add(item.pack_key);
        if (
          item.activation_status === "pending_activation" ||
          item.activation_status === "validating"
        ) {
          pendingPackKeys.add(item.pack_key);
        }
        if (
          item.activation_status === "suspended" ||
          item.activation_status === "removed" ||
          item.activation_status === "activation_failed"
        ) {
          revokedPackKeys.add(item.pack_key);
        }
      }
    }

    return resolveAppMenuCapabilityBundle({
      organizationId: context.organization_id ?? context.company_id,
      userId: user.id,
      role: context.organization_role ?? context.user_role,
      featureEnabled,
      permissionGranted,
      activePackKeys,
      pendingPackKeys,
      revokedPackKeys,
      activeModuleKeys: new Set(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 160) : "capability_load_failed";
    console.error("[app-menu-capability]", message);
    return buildFailClosedAppMenuCapabilityBundle({
      organizationId: null,
      userId: user.id,
      role: null,
    });
  }
}
