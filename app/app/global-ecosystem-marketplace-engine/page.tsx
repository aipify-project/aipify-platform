import { GlobalEcosystemMarketplaceEngineDashboardPanel } from "@/components/app/global-ecosystem-marketplace-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalEcosystemMarketplaceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.globalEcosystemMarketplaceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GlobalEcosystemMarketplaceEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          marketplaceScore: t(`${p}.marketplaceScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          participationStatus: t(`${p}.participationStatus`),
          listingsCount: t(`${p}.listingsCount`),
          approvedListings: t(`${p}.approvedListings`),
          pendingListings: t(`${p}.pendingListings`),
          optInRequired: t(`${p}.optInRequired`),
          approvalRequired: t(`${p}.approvalRequired`),
          globalSolutionMarketplaceCenter: t(`${p}.globalSolutionMarketplaceCenter`),
          marketplaceCategories: t(`${p}.marketplaceCategories`),
          industrySolutionPacks: t(`${p}.industrySolutionPacks`),
          solutionValidationFramework: t(`${p}.solutionValidationFramework`),
          procurementReadiness: t(`${p}.procurementReadiness`),
          marketplaceCompanion: t(`${p}.marketplaceCompanion`),
          solutionListings: t(`${p}.solutionListings`),
          solutionValidations: t(`${p}.solutionValidations`),
          solutionContributions: t(`${p}.solutionContributions`),
          crossLinks: t(`${p}.crossLinks`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionLimitations: t(`${p}.companionLimitations`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
