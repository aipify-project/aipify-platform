import type { Translator } from "@/lib/i18n/translate";

const P = "customerApp.commercialPackages.modules";

export function buildModulesAdminPanelLabels(t: Translator) {
  return {
    title: t(`${P}.title`),
    subtitle: t(`${P}.subtitle`),
    productsIntro: t(`${P}.productsIntro`),
    manageSubscription: t(`${P}.manageSubscription`),
    loading: t(`${P}.loading`),
    back: t(`${P}.back`),
    viewBilling: t(`${P}.viewBilling`),
    empty: t(`${P}.empty`),
    enable: t(`${P}.enable`),
    disable: t(`${P}.disable`),
    statusActive: t(`${P}.statusActive`),
    statusAvailable: t(`${P}.statusAvailable`),
    statusTrial: t(`${P}.statusTrial`),
    openManage: t(`${P}.openManage`),
    upgradeRequired: t(`${P}.upgradeRequired`),
    plannedSection: t(`${P}.plannedSection`),
    plannedHint: t(`${P}.plannedHint`),
    plannedCta: t(`${P}.plannedCta`),
    plannedProducts: {
      designStudio: {
        name: t(`${P}.plannedProducts.designStudio.name`),
        description: t(`${P}.plannedProducts.designStudio.description`),
      },
      aiTranslator: {
        name: t(`${P}.plannedProducts.aiTranslator.name`),
        description: t(`${P}.plannedProducts.aiTranslator.description`),
      },
    },
    sections: {
      installed: t(`${P}.sections.installed`),
      available: t(`${P}.sections.available`),
      trials: t(`${P}.sections.trials`),
      recommendations: t(`${P}.sections.recommendations`),
      packages: t(`${P}.sections.packages`),
      flags: t(`${P}.sections.flags`),
    },
    retry: t(`${P}.retry`),
    unnamedModule: t(`${P}.unnamedModule`),
    loadError: t(`${P}.loadError`),
  };
}
