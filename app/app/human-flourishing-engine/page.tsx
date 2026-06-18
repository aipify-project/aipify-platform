import { HumanFlourishingEngineDashboardPanel } from "@/components/app/human-flourishing-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HumanFlourishingEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "humanFlourishingEngine");
  const t = createTranslator(dict);
  const p = "customerApp.humanFlourishingEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <HumanFlourishingEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          humanFlourishingScore: t(`${p}.humanFlourishingScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          developmentMode: t(`${p}.developmentMode`),
          readinessLevel: t(`${p}.readinessLevel`),
          executiveReviews: t(`${p}.executiveReviews`),
          activeLearning: t(`${p}.activeLearning`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          eraCapstoneSummary: t(`${p}.eraCapstoneSummary`),
          eraCapstoneNote: t(`${p}.eraCapstoneNote`),
          humanFlourishingCenter: t(`${p}.humanFlourishingCenter`),
          humanPotentialEngine: t(`${p}.humanPotentialEngine`),
          flourishingFramework: t(`${p}.flourishingFramework`),
          executiveFlourishingReviews: t(`${p}.executiveFlourishingReviews`),
          flourishingCompanion: t(`${p}.flourishingCompanion`),
          belongingEngine: t(`${p}.belongingEngine`),
          strengthsDevelopmentEngine: t(`${p}.strengthsDevelopmentEngine`),
          lifelongLearningFramework: t(`${p}.lifelongLearningFramework`),
          learningRecords: t(`${p}.learningRecords`),
          executiveReviewEntries: t(`${p}.executiveReviewEntries`),
          belongingReflections: t(`${p}.belongingReflections`),
          strengthsNotes: t(`${p}.strengthsNotes`),
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
