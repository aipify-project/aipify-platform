import type { AppNavGroupConfig, AppNavLink } from "@/lib/app/build-nav";
import type { NavSearchEntry } from "@/lib/nav/search-entry";
import type { Translator } from "@/lib/i18n/translate";
import type { DynamicAppNavigation, DynamicNavCategory } from "./types";

function categoryLabel(t: Translator, category: DynamicNavCategory): string {
  const translated = t(category.label_key);
  if (translated !== category.label_key) return translated;
  return category.category_key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildAppNavFromDynamicNavigation(
  navigation: DynamicAppNavigation,
  t: Translator,
): { navGroups: AppNavGroupConfig[]; navConfig: AppNavLink[]; mobileNavIds: string[] } {
  const categories = navigation.categories ?? [];
  const flat = navigation.layout_mode === "flat";

  const navGroups: AppNavGroupConfig[] = categories.map((category) => ({
    id: category.category_key,
    label: categoryLabel(t, category),
    items: (category.items ?? []).map((item) => ({
      id: item.nav_key,
      href: item.href,
      label: item.label,
    })),
  }));

  const navConfig: AppNavLink[] = [];
  const seen = new Set<string>();
  for (const category of categories) {
    for (const item of category.items ?? []) {
      if (seen.has(item.nav_key)) continue;
      seen.add(item.nav_key);
      navConfig.push({ id: item.nav_key, href: item.href, label: item.label });
    }
  }

  const mobileNavIds = (navigation.mobile_nav_keys ?? []).length
    ? (navigation.mobile_nav_keys as string[])
    : navConfig.slice(0, 5).map((item) => item.id);

  if (flat && navGroups.length > 1) {
    return {
      navGroups: [
        {
          id: "dynamic",
          label: t("customerApp.dynamicNavigation.allModules"),
          items: navConfig,
        },
      ],
      navConfig,
      mobileNavIds,
    };
  }

  return { navGroups, navConfig, mobileNavIds };
}

export function buildNavSearchFromDynamicNavigation(
  navigation: DynamicAppNavigation,
): NavSearchEntry[] {
  const entries: NavSearchEntry[] = [];
  const seen = new Set<string>();

  for (const category of navigation.categories ?? []) {
    for (const item of category.items ?? []) {
      if (seen.has(item.nav_key)) continue;
      seen.add(item.nav_key);
      entries.push({
        id: item.nav_key,
        href: item.href,
        label: item.label,
        groupId: category.category_key,
        groupLabel: category.category_key,
        description: item.module_key ?? item.label,
      });
    }
  }

  return entries;
}

export function mergeDynamicWithFallbackNav(
  dynamic: { navGroups: AppNavGroupConfig[]; navConfig: AppNavLink[] },
  fallbackGroups: AppNavGroupConfig[],
  fallbackConfig: AppNavLink[],
): { navGroups: AppNavGroupConfig[]; navConfig: AppNavLink[] } {
  if (dynamic.navConfig.length === 0) {
    return { navGroups: fallbackGroups, navConfig: fallbackConfig };
  }
  return dynamic;
}
