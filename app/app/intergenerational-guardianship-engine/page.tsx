import { IntergenerationalGuardianshipEngineDashboardPanel } from "@/components/app/intergenerational-guardianship-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntergenerationalGuardianshipEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "intergenerationalGuardianshipEngine");
  const t = createTranslator(dict);
  const p = "customerApp.intergenerationalGuardianshipEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <IntergenerationalGuardianshipEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          guardianshipScore: t(`${p}.guardianshipScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          guardianshipMode: t(`${p}.guardianshipMode`),
          executiveReviewsCount: t(`${p}.executiveReviewsCount`),
          continuityReflectionsCount: t(`${p}.continuityReflectionsCount`),
          legacyEntriesCount: t(`${p}.legacyEntriesCount`),
          enableRequired: t(`${p}.enableRequired`),
          guardianshipCenter: t(`${p}.guardianshipCenter`),
          humanContinuityEngine: t(`${p}.humanContinuityEngine`),
          intergenerationalResponsibilityFramework: t(`${p}.intergenerationalResponsibilityFramework`),
          executiveGuardianshipReviews: t(`${p}.executiveGuardianshipReviews`),
          guardianshipCompanion: t(`${p}.guardianshipCompanion`),
          valuesPreservationEngine: t(`${p}.valuesPreservationEngine`),
          legacyResilienceEngine: t(`${p}.legacyResilienceEngine`),
          executiveReviewEntries: t(`${p}.executiveReviewEntries`),
          continuityReflectionEntries: t(`${p}.continuityReflectionEntries`),
          legacyEntryEntries: t(`${p}.legacyEntryEntries`),
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
