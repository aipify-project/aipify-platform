import type { Translator } from "@/lib/i18n/translate";
import type { DeveloperPortalLabels, DeveloperPortalTab } from "./types";
import { DEVELOPER_TABS } from "./constants";

export function buildDeveloperPortalLabels(t: Translator): DeveloperPortalLabels {
  const p = "platform.developerEcosystem";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      DEVELOPER_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<DeveloperPortalTab, string>,
    overview: {
      verifiedPublishers: t(`${p}.overview.verifiedPublishers`),
      catalogExtensions: t(`${p}.overview.catalogExtensions`),
      certifiedExtensions: t(`${p}.overview.certifiedExtensions`),
      sdkModules: t(`${p}.overview.sdkModules`),
      totalInstalls: t(`${p}.overview.totalInstalls`),
    },
    actions: {
      certifyExtension: t(`${p}.actions.certifyExtension`),
      approvePublisher: t(`${p}.actions.approvePublisher`),
      refreshAnalytics: t(`${p}.actions.refreshAnalytics`),
    },
  };
}
