import type { CommandBarNavSource } from "@/lib/command-bar/types";
import { ACTION_NAV, PLATFORM_ADMIN_NAV } from "@/lib/platform/nav-config";
import { SUPER_ADMIN_SECTIONS } from "@/lib/super-admin/nav-config";
import type { AppNavSearchEntry } from "@/lib/app/nav-search";

export function customerNavSourcesFromSearchIndex(
  entries: AppNavSearchEntry[]
): CommandBarNavSource[] {
  return entries.map((entry) => ({
    id: entry.id,
    label: entry.label,
    href: entry.href,
    description: entry.description,
    keywords: [entry.groupLabel, entry.id],
  }));
}

export function customerNavSourcesFromFlatNav(
  items: Array<{ id: string; label: string; href: string }>
): CommandBarNavSource[] {
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    keywords: [item.id],
  }));
}

export function platformNavSources(t: (key: string) => string): CommandBarNavSource[] {
  const nav = PLATFORM_ADMIN_NAV.map((item) => ({
    id: item.id,
    label: t(item.labelKey),
    href: item.href,
    keywords: [item.id],
  }));

  const actions = ACTION_NAV.map((item) => ({
    id: `action-nav-${item.id}`,
    label: t(item.labelKey),
    href: item.href,
    keywords: ["actions", item.id],
  }));

  return [...nav, ...actions];
}

export function superAdminNavSources(t: (key: string) => string): CommandBarNavSource[] {
  const sources: CommandBarNavSource[] = [
    {
      id: "super-home",
      label: t("superAdmin.shell.title"),
      href: "/super",
      keywords: ["super admin", "control center"],
    },
  ];

  for (const section of SUPER_ADMIN_SECTIONS) {
    for (const module of section.modules) {
      sources.push({
        id: module.id,
        label: t(module.labelKey),
        description: t(module.descriptionKey),
        href: module.href,
        keywords: [section.id, module.id],
      });
    }
  }

  return sources;
}
