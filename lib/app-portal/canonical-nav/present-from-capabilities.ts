import type { AppNavGroupConfig, AppNavLink } from "@/lib/app/build-nav";
import {
  getVisibleCapabilityIds,
  type AppMenuCapabilityBundle,
} from "@/lib/core/app-menu-capability";
import {
  KOMPIS_BEDRIFT_FLAT_NAV,
  KOMPIS_WEB_FLAT_NAV,
  type AppPortalNavId,
  type AppPortalNavItem,
} from "@/lib/app-portal/nav-config";
import type { AppProductContextId } from "@/lib/app-portal/product-context/constants";
import { resolveAppRouteHref } from "@/lib/app-production-experience/route-readiness";
import type { Translator } from "@/lib/i18n/translate";

const DEFAULT_MOBILE_IDS: AppPortalNavId[] = [
  "kompisWebDashboard",
  "kompisBedriftDashboard",
  "accountInvoices",
  "accountSubscription",
  "kompisWebSettings",
  "kompisBedriftSettings",
];

function linksForItems(
  items: AppPortalNavItem[],
  allowed: Set<string>,
  t: Translator
): AppNavLink[] {
  const links: AppNavLink[] = [];
  const seen = new Set<string>();
  let commerceHeadingPlaced = false;
  for (const item of items) {
    if (!allowed.has(item.id) || seen.has(item.id)) continue;
    seen.add(item.id);
    const showCommerceHeading = item.menuBand === "commerce" && !commerceHeadingPlaced;
    if (showCommerceHeading) commerceHeadingPlaced = true;
    links.push({
      id: item.id,
      href: resolveAppRouteHref(item.id, item.href),
      label: t(item.labelKey),
      sectionLabel: showCommerceHeading
        ? t("customerApp.portalStructure.navGroups.productsAndSubscription")
        : undefined,
    });
  }
  return links;
}

export type PresentAppNavOptions = {
  /** When set, return only that product's flat menu (job 60). */
  activeProduct?: AppProductContextId | null;
};

/**
 * APP presentation mapper — Core capability ids → localized portal nav.
 * Job 60: one flat product menu at a time (no nested Account group).
 */
export function presentAppNavFromCapabilities(
  bundle: AppMenuCapabilityBundle,
  t: Translator,
  options: PresentAppNavOptions = {}
): {
  navGroups: AppNavGroupConfig[];
  navConfig: AppNavLink[];
  mobileNavIds: string[];
  productNav: Record<AppProductContextId, AppNavLink[]>;
  activeProduct: AppProductContextId | null;
} {
  const allowed = getVisibleCapabilityIds(bundle);

  const productNav: Record<AppProductContextId, AppNavLink[]> = {
    kompisWeb: linksForItems(KOMPIS_WEB_FLAT_NAV, allowed, t),
    kompisBedrift: linksForItems(KOMPIS_BEDRIFT_FLAT_NAV, allowed, t),
  };

  // Prefer explicit product; otherwise first non-empty product — never mix both in one menu.
  const activeProduct: AppProductContextId | null =
    options.activeProduct ??
    (productNav.kompisWeb.length > 0
      ? "kompisWeb"
      : productNav.kompisBedrift.length > 0
        ? "kompisBedrift"
        : null);

  const flatItems =
    activeProduct === "kompisWeb"
      ? productNav.kompisWeb
      : activeProduct === "kompisBedrift"
        ? productNav.kompisBedrift
        : [];

  // Single synthetic group for search/index — FlatSidebar renders the flat list only.
  const navGroups: AppNavGroupConfig[] =
    activeProduct && flatItems.length > 0
      ? [
          {
            id: activeProduct,
            label: t(
              activeProduct === "kompisWeb"
                ? "customerApp.portalStructure.navGroups.kompisWeb"
                : "customerApp.portalStructure.navGroups.kompisBedrift"
            ),
            items: flatItems,
          },
        ]
      : [];

  const navConfig = flatItems;
  const mobileNavIds = DEFAULT_MOBILE_IDS.filter((id) => allowed.has(id)).filter((id) =>
    flatItems.some((item) => item.id === id)
  );

  return { navGroups, navConfig, mobileNavIds, productNav, activeProduct };
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
