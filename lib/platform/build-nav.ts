import { PLATFORM_NAV_GROUPS } from "./nav-groups";
import { PLATFORM_ADMIN_NAV, type PlatformNavItem } from "./nav-config";
import type { Translator } from "@/lib/i18n/translate";

export type PlatformNavLink = {
  id: string;
  href: string;
  label: string;
};

export type PlatformNavGroupConfig = {
  id: string;
  label: string;
  items: PlatformNavLink[];
};

const navById = new Map<string, PlatformNavItem>(
  PLATFORM_ADMIN_NAV.map((item) => [item.id, item])
);

export function buildPlatformNavConfig(t: Translator): PlatformNavLink[] {
  const seen = new Set<string>();

  return PLATFORM_ADMIN_NAV.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).map((item) => ({
    id: item.id,
    href: item.href,
    label: t(item.labelKey),
  }));
}

export function buildPlatformNavGroupConfig(t: Translator): PlatformNavGroupConfig[] {
  return PLATFORM_NAV_GROUPS.map((group) => ({
    id: group.id,
    label: t(group.labelKey),
    items: group.items.map((item) => {
      const match = navById.get(item.id);
      return {
        id: item.id,
        href: match?.href ?? "/platform",
        label: t(item.labelKey),
      };
    }),
  }));
}
