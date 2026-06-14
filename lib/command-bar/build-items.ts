import { filterCommandsByRole } from "./permissions";
import { filterCommandItems, rankCommandItems } from "./filter";
import type {
  CommandBarItem,
  CommandBarRecentEntry,
  CommandBarRecommendation,
  CommandBarRoleContext,
  CommandBarSearchResult,
} from "./types";

export function recentToCommandItems(recent: CommandBarRecentEntry[]): CommandBarItem[] {
  return recent.map((entry) => ({
    id: `recent:${entry.id}`,
    label: entry.label,
    href: entry.href,
    section: "recent" as const,
  }));
}

export function recommendationsToCommandItems(
  recommendations: CommandBarRecommendation[]
): CommandBarItem[] {
  return recommendations.map((item) => ({
    id: `rec:${item.id}`,
    label: item.label,
    description: item.description,
    href: item.href,
    section: "recommendation" as const,
  }));
}

export function searchResultsToCommandItems(results: CommandBarSearchResult[]): CommandBarItem[] {
  return results.map((result) => ({
    id: `search:${result.id}`,
    label: result.label,
    description: result.description ?? result.category,
    href: result.href,
    section: "search" as const,
    keywords: [result.category],
  }));
}

export function buildVisibleCommandItems(input: {
  registry: CommandBarItem[];
  recent: CommandBarRecentEntry[];
  recommendations: CommandBarRecommendation[];
  searchResults: CommandBarSearchResult[];
  query: string;
  roleContext: CommandBarRoleContext;
}): CommandBarItem[] {
  const { query, roleContext } = input;
  const q = query.trim();

  const allowedRegistry = filterCommandsByRole(input.registry, roleContext);
  const allowedRecent = filterCommandsByRole(recentToCommandItems(input.recent), roleContext);
  const allowedRecs = filterCommandsByRole(
    recommendationsToCommandItems(input.recommendations),
    roleContext
  );
  const allowedSearch = filterCommandsByRole(
    searchResultsToCommandItems(input.searchResults),
    roleContext
  );

  if (!q) {
    const actionItems = rankCommandItems(
      allowedRegistry.filter((item) => item.section === "action").slice(0, 4),
      ""
    );
    const navigationItems = allowedRegistry
      .filter((item) => item.section === "navigation")
      .slice(0, 10);
    return [...allowedRecs, ...allowedRecent, ...actionItems, ...navigationItems];
  }

  const localMatches = rankCommandItems(filterCommandItems(allowedRegistry, q), q);
  const recentMatches = rankCommandItems(filterCommandItems(allowedRecent, q), q);
  const searchMatches = rankCommandItems(filterCommandItems(allowedSearch, q), q);

  const seen = new Set<string>();
  const merged: CommandBarItem[] = [];

  for (const item of [...searchMatches, ...localMatches, ...recentMatches]) {
    const key = item.href ?? item.id;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  return merged.slice(0, 20);
}
