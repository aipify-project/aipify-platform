import { CrossSectorIntelligenceEngineDashboardPanel } from "@/components/app/cross-sector-intelligence-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CrossSectorIntelligenceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.crossSectorIntelligenceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CrossSectorIntelligenceEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          resilienceScore: t(`${p}.resilienceScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          participationStatus: t(`${p}.participationStatus`),
          preparednessLevel: t(`${p}.preparednessLevel`),
          programsCount: t(`${p}.programsCount`),
          networksCount: t(`${p}.networksCount`),
          preparednessReviews: t(`${p}.preparednessReviews`),
          optInRequired: t(`${p}.optInRequired`),
          notPredictionNote: t(`${p}.notPredictionNote`),
          societalResilienceCenter: t(`${p}.societalResilienceCenter`),
          crossSectorIntelligence: t(`${p}.crossSectorIntelligence`),
          preparednessFramework: t(`${p}.preparednessFramework`),
          collectiveResilienceNetworks: t(`${p}.collectiveResilienceNetworks`),
          resilienceCompanion: t(`${p}.resilienceCompanion`),
          ecosystemHealth: t(`${p}.ecosystemHealth`),
          leadershipPreparedness: t(`${p}.leadershipPreparedness`),
          learningPrograms: t(`${p}.learningPrograms`),
          resilienceNetworks: t(`${p}.resilienceNetworks`),
          preparednessReviewsSection: t(`${p}.preparednessReviewsSection`),
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
