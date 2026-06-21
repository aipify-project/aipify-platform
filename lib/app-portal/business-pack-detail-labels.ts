import type { Translator } from "@/lib/i18n/translate";

const P = "customerApp.portalStructure.businessPackDetail";
const R = "customerApp.portalStructure.businessPackResolver";

export function buildBusinessPackDetailLabels(t: Translator) {
  return {
    breadcrumbBusinessPacks: t(`${P}.breadcrumbBusinessPacks`),
    breadcrumbDetail: t(`${P}.breadcrumbDetail`),
    backToAvailable: t(`${P}.backToAvailable`),
    backToRecommendations: t(`${P}.backToRecommendations`),
    whatItHelpsWith: t(`${P}.whatItHelpsWith`),
    coreCapabilities: t(`${P}.coreCapabilities`),
    recommendedFor: t(`${P}.recommendedFor`),
    planAndAccess: t(`${P}.planAndAccess`),
    relatedPacks: t(`${P}.relatedPacks`),
    comingLaterTitle: t(`${P}.comingLaterTitle`),
    comingLaterBody: t(`${P}.comingLaterBody`),
    contactAipify: t(`${P}.contactAipify`),
    unavailableTitle: t(`${P}.unavailableTitle`),
    unavailableBody: t(`${P}.unavailableBody`),
    viewAvailable: t(`${P}.viewAvailable`),
    viewRecommendations: t(`${P}.viewRecommendations`),
    install: t("customerApp.appStore.install"),
    upgrade: t("customerApp.appStore.upgrade"),
    contactSales: t("customerApp.appStore.contactSales"),
    openWorkspace: t("customerApp.appStore.openWorkspace"),
    exploreAvailable: t(`${P}.exploreAvailable`),
    capabilityNote: t(`${P}.capabilityNote`),
    packs: {
      aipifyHosts: t(`${R}.packs.aipifyHosts`),
      governance: t(`${R}.packs.governance`),
      commerceIntelligence: t(`${R}.packs.commerceIntelligence`),
      supportOperations: t(`${R}.packs.supportOperations`),
      executiveIntelligence: t(`${R}.packs.executiveIntelligence`),
      essentials: t(`${R}.packs.essentials`),
      growth: t(`${R}.packs.growth`),
    },
    capabilities: {
      analytics: {
        name: t(`${R}.capabilities.analytics`),
        subtitle: t(`${R}.capabilityDetail.analytics.subtitle`),
        helpsWith: t(`${R}.capabilityDetail.analytics.helpsWith`),
        capabilities: t(`${R}.capabilityDetail.analytics.capabilities`),
        recommendedFor: t(`${R}.capabilityDetail.analytics.recommendedFor`),
        planAccess: t(`${R}.capabilityDetail.analytics.planAccess`),
      },
      workflows: {
        name: t(`${R}.capabilities.workflows`),
        subtitle: t(`${R}.capabilityDetail.workflows.subtitle`),
        helpsWith: t(`${R}.capabilityDetail.workflows.helpsWith`),
        capabilities: t(`${R}.capabilityDetail.workflows.capabilities`),
        recommendedFor: t(`${R}.capabilityDetail.workflows.recommendedFor`),
        planAccess: t(`${R}.capabilityDetail.workflows.planAccess`),
      },
    },
  };
}

export type BusinessPackDetailLabels = ReturnType<typeof buildBusinessPackDetailLabels>;

export function getResolvedPackDisplayName(
  nameKey: string,
  labels: BusinessPackDetailLabels,
  t: Translator
): string {
  const translated = t(nameKey);
  if (translated !== nameKey) return translated;
  return nameKey.split(".").pop()?.replace(/([A-Z])/g, " $1").trim() ?? nameKey;
}
