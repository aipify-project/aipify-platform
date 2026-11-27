import type { AppNavGroupConfig, AppNavLink } from "@/lib/app/build-nav";
import type { AppMenuCapabilityBundle } from "@/lib/core/app-menu-capability/types";
import { getVisibleCapabilityIds } from "@/lib/core/app-menu-capability/resolve";
import {
  ADMINISTRATION_NAV,
  KOMPIS_BEDRIFT_FLAT_NAV,
  KOMPIS_BEDRIFT_MODULE_NAV,
  KOMPIS_WEB_FLAT_NAV,
  KOMPIS_WEB_MODULE_NAV,
  SALES_PARTNER_MODULE_NAV,
  SHARED_WORKSPACE_NAV,
  type AppPortalNavId,
  type AppPortalNavItem,
} from "@/lib/app-portal/nav-config";
import type { AppProductContextId } from "@/lib/app-portal/product-context/constants";
import { resolveAppRouteHref } from "@/lib/app-production-experience/route-readiness";
import type { Translator } from "@/lib/i18n/translate";

const DEFAULT_MOBILE_IDS: AppPortalNavId[] = [
  "appDashboard",
  "workspaceDashboard",
  "kompisWebDashboard",
  "kompisBedriftDashboard",
  "salesPartnerOverview",
  "accountSubscription",
  "supportTickets",
];

function linksForItems(
  items: AppPortalNavItem[],
  allowed: Set<string>,
  t: Translator,
  options?: { forceAllowIds?: Set<string> }
): AppNavLink[] {
  const links: AppNavLink[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const force = options?.forceAllowIds?.has(item.id) === true;
    if ((!force && !allowed.has(item.id)) || seen.has(item.id)) continue;
    seen.add(item.id);
    links.push({
      id: item.id,
      href: resolveAppRouteHref(item.id, item.href),
      label: t(item.labelKey),
    });
  }
  return links;
}

export type PresentAppNavOptions = {
  /**
   * Legacy Job 60 — when set with `mode: "flat_product"`, return only that
   * product's flat menu. Unified mode ignores this for group composition.
   */
  activeProduct?: AppProductContextId | null;
  /** Server-verified CSP partner access — never trust the client. */
  salesPartnerAuthorized?: boolean;
  /**
   * `unified` (default) — shared + Mine Produkter modules + administration.
   * `flat_product` — Job 60 single-product flat list (tests / deep product tools).
   */
  mode?: "unified" | "flat_product";
};

function presentFlatProduct(
  bundle: AppMenuCapabilityBundle,
  t: Translator,
  options: PresentAppNavOptions
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
  return {
    navGroups,
    navConfig: flatItems,
    mobileNavIds: DEFAULT_MOBILE_IDS.filter((id) => allowed.has(id)).filter((id) =>
      flatItems.some((item) => item.id === id)
    ),
    productNav,
    activeProduct,
  };
}

/**
 * APP presentation mapper — Core capability ids → localized portal nav.
 * Default: unified shared workspace + entitlement-based Mine Produkter groups.
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
  if (options.mode === "flat_product") {
    return presentFlatProduct(bundle, t, options);
  }

  const allowed = getVisibleCapabilityIds(bundle);
  // Partner force-allow is only for explicit test/options override when Core ids are not yet visible.
  const partnerForce =
    options.salesPartnerAuthorized === true
      ? new Set(SALES_PARTNER_MODULE_NAV.map((i) => i.id))
      : undefined;

  const productNav: Record<AppProductContextId, AppNavLink[]> = {
    kompisWeb: linksForItems(KOMPIS_WEB_MODULE_NAV, allowed, t),
    kompisBedrift: linksForItems(KOMPIS_BEDRIFT_MODULE_NAV, allowed, t),
  };

  const activeProduct: AppProductContextId | null =
    options.activeProduct ??
    (productNav.kompisWeb.length > 0
      ? "kompisWeb"
      : productNav.kompisBedrift.length > 0
        ? "kompisBedrift"
        : null);

  const shared = linksForItems(SHARED_WORKSPACE_NAV, allowed, t);
  const administration = linksForItems(ADMINISTRATION_NAV, allowed, t);
  const salesPartner = linksForItems(SALES_PARTNER_MODULE_NAV, allowed, t, {
    forceAllowIds: partnerForce,
  });

  const navGroups: AppNavGroupConfig[] = [];
  if (shared.length > 0) {
    navGroups.push({
      id: "shared",
      label: t("customerApp.portalStructure.navGroups.shared"),
      items: shared,
    });
  }
  if (productNav.kompisWeb.length > 0) {
    navGroups.push({
      id: "kompisWeb",
      label: t("customerApp.portalStructure.navGroups.kompisWeb"),
      items: productNav.kompisWeb,
    });
  }
  if (productNav.kompisBedrift.length > 0) {
    navGroups.push({
      id: "kompisBedrift",
      label: t("customerApp.portalStructure.navGroups.kompisBedrift"),
      items: productNav.kompisBedrift,
    });
  }
  if (salesPartner.length > 0) {
    navGroups.push({
      id: "salesPartner",
      label: t("customerApp.portalStructure.navGroups.salesPartner"),
      items: salesPartner,
    });
  }
  if (administration.length > 0) {
    navGroups.push({
      id: "administration",
      label: t("customerApp.portalStructure.navGroups.administration"),
      items: administration,
    });
  }

  const navConfig = navGroups.flatMap((g) => g.items);
  const mobileNavIds = DEFAULT_MOBILE_IDS.filter((id) =>
    navConfig.some((item) => item.id === id)
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
