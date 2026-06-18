import { CivilizationalLearningEngineDashboardPanel } from "@/components/app/civilizational-learning-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CivilizationalLearningEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "civilizationalLearningEngine");
  const t = createTranslator(dict);
  const p = "customerApp.civilizationalLearningEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CivilizationalLearningEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          eraCrossLinksBanner: t(`${p}.eraCrossLinksBanner`),
          eraCrossLinksNote: t(`${p}.eraCrossLinksNote`),
          collectiveAdaptationCenter: t(`${p}.collectiveAdaptationCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          crossOrgOptIn: t(`${p}.crossOrgOptIn`),
          crossOrgOptOut: t(`${p}.crossOrgOptOut`),
          currentReadinessLevel: t(`${p}.currentReadinessLevel`),
          maturityNotRanking: t(`${p}.maturityNotRanking`),
          learningPrograms: t(`${p}.learningPrograms`),
          adaptationReviews: t(`${p}.adaptationReviews`),
          lessonsLearned: t(`${p}.lessonsLearned`),
          collectiveAdaptationCenterCapabilities: t(`${p}.collectiveAdaptationCenterCapabilities`),
          collectiveLearningEngine: t(`${p}.collectiveLearningEngine`),
          adaptationFramework: t(`${p}.adaptationFramework`),
          executiveLearningReviews: t(`${p}.executiveLearningReviews`),
          adaptationCompanion: t(`${p}.adaptationCompanion`),
          collectiveResilience: t(`${p}.collectiveResilience`),
          humilityInnovation: t(`${p}.humilityInnovation`),
          adaptationMemoryEngine: t(`${p}.adaptationMemoryEngine`),
          learningProgramsSection: t(`${p}.learningProgramsSection`),
          adaptationReviewsSection: t(`${p}.adaptationReviewsSection`),
          lessonsLearnedSection: t(`${p}.lessonsLearnedSection`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
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
