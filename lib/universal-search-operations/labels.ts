import type { Translator } from "@/lib/i18n/translate";

export function buildUniversalSearchLabels(t: Translator) {
  const p = "customerApp.universalSearch";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    search: t(`${p}.search`),
    discovery: t(`${p}.discovery`),
    savedSearches: t(`${p}.savedSearches`),
    filters: t(`${p}.filters`),
    analytics: t(`${p}.analytics`),
    reports: t(`${p}.reports`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    indexedItems: t(`${p}.indexedItems`),
    searches7d: t(`${p}.searches7d`),
    savedSearchCount: t(`${p}.savedSearchCount`),
    discoveryTriggers: t(`${p}.discoveryTriggers`),
    noResults: t(`${p}.noResults`),
    emptyHint: t(`${p}.emptyHint`),
    saveSearch: t(`${p}.saveSearch`),
    saveSearchName: t(`${p}.saveSearchName`),
    runSearch: t(`${p}.runSearch`),
    rebuildIndex: t(`${p}.rebuildIndex`),
    permissionNote: t(`${p}.permissionNote`),
    naturalLanguage: t(`${p}.naturalLanguage`),
    companionIntegration: t(`${p}.companionIntegration`),
    smartRecommendations: t(`${p}.smartRecommendations`),
    categories: t(`${p}.categories`),
    searchModes: t(`${p}.searchModes`),
    auditLog: t(`${p}.auditLog`),
    discoveryTitle: t(`${p}.discoveryTitle`),
    keyboardShortcut: t(`${p}.keyboardShortcut`),
    openResult: t(`${p}.openResult`),
    entityType: t(`${p}.entityType`),
    status: t(`${p}.status`),
    lastUpdated: t(`${p}.lastUpdated`),
    searchHealth: t(`${p}.searchHealth`),
    topSearches: t(`${p}.topSearches`),
    save: t(`${p}.save`),
  };
}

export type UniversalSearchLabels = ReturnType<typeof buildUniversalSearchLabels>;
