import { SocialCohesionEngineDashboardPanel } from "@/components/app/social-cohesion-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SocialCohesionEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "socialCohesionEngine");
  const t = createTranslator(dict);
  const p = "customerApp.socialCohesionEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SocialCohesionEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          socialCohesionScore: t(`${p}.socialCohesionScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          trustDevelopmentMode: t(`${p}.trustDevelopmentMode`),
          trustReviewsCount: t(`${p}.trustReviewsCount`),
          relationshipHealthCount: t(`${p}.relationshipHealthCount`),
          repairRecordsCount: t(`${p}.repairRecordsCount`),
          enableRequired: t(`${p}.enableRequired`),
          socialCohesionCenter: t(`${p}.socialCohesionCenter`),
          trustDevelopmentEngine: t(`${p}.trustDevelopmentEngine`),
          relationshipHealthFramework: t(`${p}.relationshipHealthFramework`),
          executiveTrustReviews: t(`${p}.executiveTrustReviews`),
          trustCompanion: t(`${p}.trustCompanion`),
          socialCohesionEngine: t(`${p}.socialCohesionEngine`),
          repairRestorationFramework: t(`${p}.repairRestorationFramework`),
          trustMemoryEngine: t(`${p}.trustMemoryEngine`),
          trustReviewEntries: t(`${p}.trustReviewEntries`),
          relationshipHealthEntries: t(`${p}.relationshipHealthEntries`),
          repairRecordEntries: t(`${p}.repairRecordEntries`),
          trustMemoryEntries: t(`${p}.trustMemoryEntries`),
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
