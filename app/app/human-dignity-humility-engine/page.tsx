import { HumanDignityHumilityEngineDashboardPanel } from "@/components/app/human-dignity-humility-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HumanDignityHumilityEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.humanDignityHumilityEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <HumanDignityHumilityEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          scoreLabel: t(`${p}.scoreLabel`),
          distinctionNote: t(`${p}.distinctionNote`),
          modeLabel: t(`${p}.modeLabel`),
          readinessLabel: t(`${p}.readinessLabel`),
          executiveReviews: t(`${p}.executiveReviews`),
          activeReflections: t(`${p}.activeReflections`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          eraOpenerSummary: t(`${p}.eraOpenerSummary`),
          eraOpenerNote: t(`${p}.eraOpenerNote`),
          centerLabel: t(`${p}.centerLabel`),
          engineLabel: t(`${p}.engineLabel`),
          frameworkLabel: t(`${p}.frameworkLabel`),
          reviewsLabel: t(`${p}.reviewsLabel`),
          companionLabel: t(`${p}.companionLabel`),
          subEngineLabel: t(`${p}.subEngineLabel`),
          supportingEngineLabel: t(`${p}.supportingEngineLabel`),
          reflectionsLabel: t(`${p}.reflectionsLabel`),
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
