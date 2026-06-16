import { APP_PORTAL_NAV_GROUPS, type AppPortalNavGroupId } from "../app-portal/nav-config";

export type AppNavGroupId = AppPortalNavGroupId;

export type AppNavGroupItem = {
  id: string;
  labelKey: string;
  href?: string;
};

export type AppNavGroup = {
  id: AppNavGroupId;
  labelKey: string;
  items: AppNavGroupItem[];
  defaultExpanded?: boolean;
};

/** Phase 260 — APP portal navigation structure. */
export const APP_NAV_GROUPS: AppNavGroup[] = APP_PORTAL_NAV_GROUPS.map((group) => ({
  id: group.id,
  labelKey: group.labelKey,
  defaultExpanded: group.defaultExpanded,
  items: group.items.map((item) => ({
    id: item.id,
    labelKey: item.labelKey,
    href: item.href,
  })),
}));

export const APP_NAV_GROUP_STORAGE_KEY = "aipify.app.navGroups.expanded.v2";
export const APP_NAV_OPEN_GROUP_STORAGE_KEY = "aipify.app.navGroups.open.v2";
export const APP_NAV_LAST_ITEM_STORAGE_KEY = "aipify.app.nav.lastItem.v2";
export const APP_NAV_INITIALIZED_STORAGE_KEY = "aipify.app.nav.initialized.v2";
export const APP_NAV_COMPACT_STORAGE_KEY = "aipify.app.nav.compact.v2";

export const APP_COLLAPSIBLE_GROUPS: AppNavGroupId[] = [
  "home",
  "organization",
  "businessPacks",
  "operations",
  "billing",
  "support",
  "account",
  "appPlatform",
];
