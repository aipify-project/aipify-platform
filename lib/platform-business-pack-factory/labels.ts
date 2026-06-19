import type { Translator } from "@/lib/i18n/translate";
import type { PlatformBusinessPackFactoryLabels, PlatformBusinessPackFactoryTab } from "./types";
import { BLUEPRINT_STATUSES } from "./constants";

const TAB_KEYS: PlatformBusinessPackFactoryTab[] = [
  "overview",
  "templates",
  "industry_frameworks",
  "pack_builder",
  "dependencies",
  "testing",
  "certification",
  "marketplace",
  "reports",
  "executive",
];

export function buildPlatformBusinessPackFactoryLabels(
  t: Translator
): PlatformBusinessPackFactoryLabels {
  const p = "platform.businessPackFactory";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    legacyLink: t(`${p}.legacyLink`),
    tabs: Object.fromEntries(
      TAB_KEYS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as PlatformBusinessPackFactoryLabels["tabs"],
    overview: {
      industryFrameworks: t(`${p}.overview.industryFrameworks`),
      packBlueprints: t(`${p}.overview.packBlueprints`),
      inDevelopment: t(`${p}.overview.inDevelopment`),
      inReview: t(`${p}.overview.inReview`),
      certified: t(`${p}.overview.certified`),
      marketplaceReady: t(`${p}.overview.marketplaceReady`),
      companionSkills: t(`${p}.overview.companionSkills`),
      knowledgeTemplates: t(`${p}.overview.knowledgeTemplates`),
      catalogListings: t(`${p}.overview.catalogListings`),
    },
    actions: {
      runTest: t(`${p}.actions.runTest`),
      advanceReview: t(`${p}.actions.advanceReview`),
      publishPack: t(`${p}.actions.publishPack`),
      openBuilder: t(`${p}.actions.openBuilder`),
      openSkills: t(`${p}.actions.openSkills`),
      openTesting: t(`${p}.actions.openTesting`),
    },
    blueprintStatuses: Object.fromEntries(
      BLUEPRINT_STATUSES.map((key) => [key, t(`${p}.blueprintStatuses.${key}`)])
    ) as PlatformBusinessPackFactoryLabels["blueprintStatuses"],
    builderPage: {
      title: t(`${p}.builderPage.title`),
      subtitle: t(`${p}.builderPage.subtitle`),
    },
    skillsPage: {
      title: t(`${p}.skillsPage.title`),
      subtitle: t(`${p}.skillsPage.subtitle`),
    },
    testingPage: {
      title: t(`${p}.testingPage.title`),
      subtitle: t(`${p}.testingPage.subtitle`),
    },
  };
}
