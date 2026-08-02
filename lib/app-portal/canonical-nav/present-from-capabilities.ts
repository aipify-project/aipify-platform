import type { AppNavGroupConfig, AppNavLink } from "@/lib/app/build-nav";
import {
  getVisibleCapabilityIds,
  type AppMenuCapabilityBundle,
} from "@/lib/core/app-menu-capability";
import { APP_PORTAL_NAV_GROUPS, type AppPortalNavId } from "@/lib/app-portal/nav-config";
import { resolveAppRouteHref } from "@/lib/app-production-experience/route-readiness";
import type { Translator } from "@/lib/i18n/translate";

const DEFAULT_MOBILE_IDS: AppPortalNavId[] = [
  "appDashboard",
  "commandBrief",
  "aipifyCompanion",
  "teamMembers",
  "supportRequests",
];

/**
 * APP presentation mapper — Core capability ids → localized portal nav.
 * Never invents items. Unknown / non-visible ids are dropped.
 * Mega-nav (lib/app/nav-config.ts) is not consulted.
 */
export function presentAppNavFromCapabilities(
  bundle: AppMenuCapabilityBundle,
  t: Translator
): {
  navGroups: AppNavGroupConfig[];
  navConfig: AppNavLink[];
  mobileNavIds: string[];
} {
  const allowed = getVisibleCapabilityIds(bundle);
  const navConfig: AppNavLink[] = [];
  const seen = new Set<string>();

  const navGroups = APP_PORTAL_NAV_GROUPS.map((group) => ({
    id: group.id,
    label: t(group.labelKey),
    items: group.items
      .filter((item) => allowed.has(item.id))
      .map((item) => {
        if (seen.has(item.id)) return null;
        seen.add(item.id);
        const link: AppNavLink = {
          id: item.id,
          href: resolveAppRouteHref(item.id, item.href),
          label: t(item.labelKey),
        };
        navConfig.push(link);
        return link;
      })
      .filter((item): item is AppNavLink => item !== null),
  })).filter((group) => group.items.length > 0);

  const mobileNavIds = DEFAULT_MOBILE_IDS.filter((id) => allowed.has(id));

  return { navGroups, navConfig, mobileNavIds };
}

/**
 * Intersect any external/dynamic nav candidates with Core allowlist.
 * Dynamic items not in Core visible set are discarded (fail closed).
 */
export function intersectNavWithCapabilities(
  candidates: AppNavGroupConfig[],
  bundle: AppMenuCapabilityBundle
): AppNavGroupConfig[] {
  const allowed = getVisibleCapabilityIds(bundle);
  return candidates
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => allowed.has(item.id)),
    }))
    .filter((group) => group.items.length > 0);
}
