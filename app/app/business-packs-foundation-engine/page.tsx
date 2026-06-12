import { BusinessPacksFoundationEngineDashboardPanel } from "@/components/app/business-packs-foundation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPacksFoundationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.businessPacksFoundationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <BusinessPacksFoundationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          activePacks: t(`${p}.activePacks`),
          availablePacks: t(`${p}.availablePacks`),
          recommendedPacks: t(`${p}.recommendedPacks`),
          futurePacks: t(`${p}.futurePacks`),
          activate: t(`${p}.activate`),
          activating: t(`${p}.activating`),
          activateFailed: t(`${p}.activateFailed`),
          comingSoon: t(`${p}.comingSoon`),
          productizationPacks: t(`${p}.productizationPacks`),
          productizationPacksNote: t(`${p}.productizationPacksNote`),
          modularAddons: t(`${p}.modularAddons`),
          packagingPrinciples: t(`${p}.packagingPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnection: t(`${p}.trustConnection`),
          websitePresentation: t(`${p}.websitePresentation`),
          visionPhrases: t(`${p}.visionPhrases`),
          commercialPackagesDistinction: t(`${p}.commercialPackagesDistinction`),
          targetAudience: t(`${p}.targetAudience`),
          mappedCatalogPack: t(`${p}.mappedCatalogPack`),
          activateCatalogPack: t(`${p}.activateCatalogPack`),
          industryPackExamples: t(`${p}.industryPackExamples`),
          industryPackExamplesNote: t(`${p}.industryPackExamplesNote`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          installFlow: t(`${p}.installFlow`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          blueprintSuccessCriteria: t(`${p}.blueprintSuccessCriteria`),
          blueprintVision: t(`${p}.blueprintVision`),
        }}
      />
    </div>
  );
}
