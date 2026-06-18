import { MultiGenerationalFuturesEngineDashboardPanel } from "@/components/app/multi-generational-futures-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MultiGenerationalFuturesEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "multiGenerationalFuturesEngine");
  const t = createTranslator(dict);
  const p = "customerApp.multiGenerationalFuturesEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <MultiGenerationalFuturesEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          multiGenerationalFuturesScore: t(`${p}.multiGenerationalFuturesScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          stewardshipMode: t(`${p}.stewardshipMode`),
          readinessLevel: t(`${p}.readinessLevel`),
          executiveReviews: t(`${p}.executiveReviews`),
          activeReflections: t(`${p}.activeReflections`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          eraOpenerNote: t(`${p}.eraOpenerNote`),
          eraOpenerDescription: t(`${p}.eraOpenerDescription`),
          multiGenerationalFuturesCenter: t(`${p}.multiGenerationalFuturesCenter`),
          futureGenerationsEngine: t(`${p}.futureGenerationsEngine`),
          longHorizonResponsibilityFramework: t(`${p}.longHorizonResponsibilityFramework`),
          executiveFuturesReviews: t(`${p}.executiveFuturesReviews`),
          futuresCompanion: t(`${p}.futuresCompanion`),
          intergenerationalStewardshipEngine: t(`${p}.intergenerationalStewardshipEngine`),
          legacyContinuityEngine: t(`${p}.legacyContinuityEngine`),
          longHorizonReflections: t(`${p}.longHorizonReflections`),
          executiveReviewEntries: t(`${p}.executiveReviewEntries`),
          legacyEntries: t(`${p}.legacyEntries`),
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
