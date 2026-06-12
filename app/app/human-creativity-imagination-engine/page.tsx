import { HumanCreativityImaginationEngineDashboardPanel } from "@/components/app/human-creativity-imagination-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HumanCreativityImaginationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.humanCreativityImaginationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <HumanCreativityImaginationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          humanCreativityImaginationScore: t(`${p}.humanCreativityImaginationScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          discoveryMode: t(`${p}.discoveryMode`),
          meaningReadinessLevel: t(`${p}.meaningReadinessLevel`),
          executiveReviews: t(`${p}.executiveReviews`),
          activeReflections: t(`${p}.activeReflections`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          eraOpenerSummary: t(`${p}.eraOpenerSummary`),
          eraOpenerNote: t(`${p}.eraOpenerNote`),
          centerCapabilities: t(`${p}.centerCapabilities`),
          reflectionEngine: t(`${p}.reflectionEngine`),
          responsibleFramework: t(`${p}.responsibleFramework`),
          executiveReviewsMeta: t(`${p}.executiveReviewsMeta`),
          companionCapabilities: t(`${p}.companionCapabilities`),
          supportingEngine: t(`${p}.supportingEngine`),
          oversightEngine: t(`${p}.oversightEngine`),
          reflectionScaffolds: t(`${p}.reflectionScaffolds`),
          executiveReviewEntries: t(`${p}.executiveReviewEntries`),
          scaffoldNotes: t(`${p}.scaffoldNotes`),
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
