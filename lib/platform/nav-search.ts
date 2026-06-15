import { PLATFORM_NAV_GROUPS, type PlatformNavGroupId } from "./nav-groups";
import type { PlatformNavGroupConfig, PlatformNavLink } from "./build-nav";
import type { NavSearchEntry } from "@/lib/nav/search-entry";
import type { Translator } from "@/lib/i18n/translate";

export type PlatformNavSearchEntry = NavSearchEntry & {
  groupId: PlatformNavGroupId;
};

const SEARCH_KEYWORDS: Record<string, string[]> = {
  overview: ["home", "dashboard", "overview"],
  executive: ["executive", "briefing", "mission control"],
  platformAcademyStudio: ["academy", "growth partner", "training", "certification"],
  skills: ["skills", "marketplace", "capabilities"],
  companionMarketplace: ["companion", "marketplace", "digital employee"],
  skillGovernancePipeline: ["governance", "pipeline", "rollout", "skills"],
  paymentProviders: ["payment", "stripe", "providers", "billing"],
  revenueOperations: ["revenue", "activation", "billing orchestration"],
  trust: ["trust", "security", "audit"],
  customers: ["customers", "tenants", "lifecycle"],
};

export function getPlatformGroupIdForNavItem(navId: string): PlatformNavGroupId | null {
  for (const group of PLATFORM_NAV_GROUPS) {
    if (group.items.some((item) => item.id === navId)) {
      return group.id;
    }
  }
  return null;
}

function descriptionForItem(t: Translator, itemId: string, fallbackLabel: string): string {
  const key = `platform.navGroups.searchDescriptions.${itemId}`;
  const translated = t(key);
  if (translated !== key) return translated;
  return fallbackLabel;
}

export function buildPlatformNavSearchIndex(
  groups: PlatformNavGroupConfig[],
  allItems: PlatformNavLink[],
  t: Translator
): PlatformNavSearchEntry[] {
  const seen = new Set<string>();
  const entries: PlatformNavSearchEntry[] = [];

  for (const group of groups) {
    for (const item of group.items) {
      seen.add(item.id);
      entries.push({
        ...item,
        groupId: group.id as PlatformNavGroupId,
        groupLabel: group.label,
        description: descriptionForItem(t, item.id, item.label),
      });
    }
  }

  for (const item of allItems) {
    if (seen.has(item.id)) continue;
    entries.push({
      ...item,
      groupId: "system",
      groupLabel: t("platform.navGroups.system"),
      description: item.label,
    });
  }

  return entries;
}

export function filterPlatformNavSearchEntries(
  entries: NavSearchEntry[],
  query: string
): NavSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;

  return entries.filter((item) => {
    const keywords = SEARCH_KEYWORDS[item.id] ?? [];
    return (
      item.label.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.groupLabel.toLowerCase().includes(q) ||
      keywords.some((keyword) => keyword.includes(q) || q.includes(keyword))
    );
  });
}
