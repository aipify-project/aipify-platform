/**
 * Platform Selgere hub — single sidebar entry + horizontal tabs over existing routes.
 * No parallel seller system; preserves direct URLs and auth on each page.
 */

import { SELLERS_ADMIN_NAV } from "./sellers-admin-nav";

export type SellersHubTabId = (typeof SELLERS_ADMIN_NAV)[number]["id"];

export type SellersHubTab = {
  id: SellersHubTabId;
  href: string;
  titleKey: string;
};

const TITLE_KEYS: Record<SellersHubTabId, string> = {
  overview: "platform.sellers.overview.title",
  partners: "platform.sellers.partners.title",
  products: "platform.sellers.products.title",
  commissionRates: "platform.sellers.commissionRates.title",
  attribution: "platform.sellers.attribution.title",
  academy: "platform.sellers.academy.title",
  materials: "platform.sellers.materials.title",
  leadsSales: "platform.sellers.leadsSales.title",
  commissions: "platform.sellers.commissions.title",
  settlements: "platform.sellers.settlements.title",
  messages: "platform.sellers.messages.title",
  audit: "platform.sellers.audit.title",
  settings: "platform.sellers.settings.title",
};

export const SELLERS_HUB_TABS: readonly SellersHubTab[] = SELLERS_ADMIN_NAV.map((item) => ({
  id: item.id,
  href: item.href,
  titleKey: TITLE_KEYS[item.id],
}));

export function isSellersHubPath(pathname: string): boolean {
  return pathname === "/platform/sellers" || pathname.startsWith("/platform/sellers/");
}

export function getSellersSidebarNavId(pathname: string): "sellersOverview" | null {
  return isSellersHubPath(pathname) ? "sellersOverview" : null;
}

export function getSellersHubActiveTabId(pathname: string): SellersHubTabId {
  if (pathname === "/platform/sellers" || pathname === "/platform/sellers/") return "overview";
  for (const tab of SELLERS_HUB_TABS) {
    if (tab.id === "overview") continue;
    if (pathname === tab.href || pathname.startsWith(`${tab.href}/`)) return tab.id;
  }
  return "overview";
}

/** Hub tabs on list surfaces — partner detail profiles stay free of the route row. */
export function shouldShowSellersHubTabs(pathname: string): boolean {
  if (!isSellersHubPath(pathname)) return false;
  if (
    pathname.startsWith("/platform/sellers/partners/") &&
    pathname !== "/platform/sellers/partners"
  ) {
    return false;
  }
  return true;
}
