import { HumanIdentityMeaningEngineDashboardPanel } from "@/components/app/human-identity-meaning-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HumanIdentityMeaningEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "humanIdentityMeaningEngine");
  const t = createTranslator(dict);
  const p = "customerApp.humanIdentityMeaningEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <HumanIdentityMeaningEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          humanIdentityMeaningScore: t(`${p}.humanIdentityMeaningScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          discoveryMode: t(`${p}.discoveryMode`),
          meaningReadinessLevel: t(`${p}.meaningReadinessLevel`),
          executiveReviews: t(`${p}.executiveReviews`),
          activeReflections: t(`${p}.activeReflections`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          eraOpenerSummary: t(`${p}.eraOpenerSummary`),
          eraOpenerNote: t(`${p}.eraOpenerNote`),
          meaningIdentityCenter: t(`${p}.meaningIdentityCenter`),
          humanIdentityEngine: t(`${p}.humanIdentityEngine`),
          meaningPreservationFramework: t(`${p}.meaningPreservationFramework`),
          executiveHumanityReviews: t(`${p}.executiveHumanityReviews`),
          meaningCompanion: t(`${p}.meaningCompanion`),
          belongingEngine: t(`${p}.belongingEngine`),
          agencyPreservationEngine: t(`${p}.agencyPreservationEngine`),
          meaningReflections: t(`${p}.meaningReflections`),
          executiveReviewEntries: t(`${p}.executiveReviewEntries`),
          agencyNotes: t(`${p}.agencyNotes`),
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
