import type { Translator } from "@/lib/i18n/translate";

export function buildDynamicNavigationLabels(t: Translator) {
  const p = "customerApp.dynamicNavigation";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    visibilityRule: t(`${p}.visibilityRule`),
    suspendedNotice: t(`${p}.suspendedNotice`),
    pinModule: t(`${p}.pinModule`),
    hideModule: t(`${p}.hideModule`),
    showModule: t(`${p}.showModule`),
    setLanding: t(`${p}.setLanding`),
    saved: t(`${p}.saved`),
    accessDenied: t(`${p}.accessDenied`),
    recentModules: t(`${p}.recentModules`),
    pinnedModules: t(`${p}.pinnedModules`),
    favorites: t(`${p}.favorites`),
    allModules: t(`${p}.allModules`),
    back: t(`${p}.back`),
    layoutFlat: t(`${p}.layoutFlat`),
    layoutGrouped: t(`${p}.layoutGrouped`),
  };
}

export type DynamicNavigationLabels = ReturnType<typeof buildDynamicNavigationLabels>;
