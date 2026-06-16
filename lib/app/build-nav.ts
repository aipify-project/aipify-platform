import { APP_PORTAL_NAV, APP_PORTAL_NAV_GROUPS } from "../app-portal/nav-config";
import { APP_NAV_GROUPS, type AppNavGroupItem } from "./nav-groups";
import { resolveAppHref } from "./route-aliases";
import type { Translator } from "@/lib/i18n/translate";

export type AppNavLink = {
  id: string;
  href: string;
  label: string;
};

export type AppNavGroupConfig = {
  id: string;
  label: string;
  items: AppNavLink[];
};

function resolveNavHref(item: AppNavGroupItem): string {
  if (item.href) return resolveAppHref(item.href);
  const match = APP_PORTAL_NAV.find((entry) => entry.id === item.id);
  return match ? resolveAppHref(match.href) : resolveAppHref("/app");
}

export function buildAppNavConfig(t: Translator): AppNavLink[] {
  const seen = new Set<string>();

  return APP_PORTAL_NAV.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).map((item) => ({
    id: item.id,
    href: resolveAppHref(item.href),
    label: t(item.labelKey),
  }));
}

export function buildAppNavGroupConfig(t: Translator): AppNavGroupConfig[] {
  return APP_NAV_GROUPS.map((group) => ({
    id: group.id,
    label: t(group.labelKey),
    items: group.items.map((item) => ({
      id: item.id,
      href: resolveNavHref(item),
      label: t(item.labelKey),
    })),
  }));
}

export function filterAppNavLinks(links: AppNavLink[], query: string): AppNavLink[] {
  const q = query.trim().toLowerCase();
  if (!q) return links;
  return links.filter(
    (item) =>
      item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
  );
}
