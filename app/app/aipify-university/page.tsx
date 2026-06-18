import { AipifyUniversityDashboardPanel } from "@/components/app/aipify-university";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyUniversityPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyUniversity");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyUniversity";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyUniversityDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          learningScore: t(`${p}.learningScore`),
          wellbeingAware: t(`${p}.wellbeingAware`),
          activePathways: t(`${p}.activePathways`),
          participationRate: t(`${p}.participationRate`),
          completionRate: t(`${p}.completionRate`),
          microLearningEvents: t(`${p}.microLearningEvents`),
          pathways: t(`${p}.pathways`),
          microLearning: t(`${p}.microLearning`),
          companionCoaching: t(`${p}.companionCoaching`),
          onboardingAcceleration: t(`${p}.onboardingAcceleration`),
          knowledgeRetention: t(`${p}.knowledgeRetention`),
          executiveCenter: t(`${p}.executiveCenter`),
          learningAnalytics: t(`${p}.learningAnalytics`),
          certifications: t(`${p}.certifications`),
          selfLoveInLearning: t(`${p}.selfLoveInLearning`),
          securityTraining: t(`${p}.securityTraining`),
          kcIntegration: t(`${p}.kcIntegration`),
          integrationLinks: t(`${p}.integrationLinks`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          learningTraining: t(`${p}.learningTraining`),
          learningEngine: t(`${p}.learningEngine`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          selfLove: t(`${p}.selfLove`),
          minutes: t(`${p}.minutes`),
          noItems: t(`${p}.noItems`),
          aggregateScore: t(`${p}.aggregateScore`),
        }}
      />
    </div>
  );
}
