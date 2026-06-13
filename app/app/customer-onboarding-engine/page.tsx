import { CustomerOnboardingEngineDashboardPanel } from "@/components/app/customer-onboarding-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerOnboardingEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.customerOnboardingEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CustomerOnboardingEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          customerOnboarding: t(`${p}.customerOnboarding`),
          operationsDashboard: t(`${p}.operationsDashboard`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          integrationEngine: t(`${p}.integrationEngine`),
          installEngine: t(`${p}.installEngine`),
          aipifyInstall: t(`${p}.aipifyInstall`),
          firstDayExperience: t(`${p}.firstDayExperience`),
          customerSuccess: t(`${p}.customerSuccess`),
          selfLove: t(`${p}.selfLove`),
          currentStep: t(`${p}.currentStep`),
          completion: t(`${p}.completion`),
          checklistProgress: t(`${p}.checklistProgress`),
          stepProgress: t(`${p}.stepProgress`),
          onboardingSteps: t(`${p}.onboardingSteps`),
          advanceStep: t(`${p}.advanceStep`),
          checklist: t(`${p}.checklist`),
          markComplete: t(`${p}.markComplete`),
          completeOnboarding: t(`${p}.completeOnboarding`),
          recommendations: t(`${p}.recommendations`),
          knowledgeArticle: t(`${p}.knowledgeArticle`),
          principles: t(`${p}.principles`),
          engagementSummary: t(`${p}.engagementSummary`),
          daysSinceStart: t(`${p}.daysSinceStart`),
          checklistRemaining: t(`${p}.checklistRemaining`),
          onboardingCompleted: t(`${p}.onboardingCompleted`),
          yes: t(`${p}.yes`),
          no: t(`${p}.no`),
          onboardingJourney: t(`${p}.onboardingJourney`),
          earlySuccessMoments: t(`${p}.earlySuccessMoments`),
          customerSuccessObjectives: t(`${p}.customerSuccessObjectives`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnection: t(`${p}.trustConnection`),
          successCriteria: t(`${p}.successCriteria`),
          integrationLinks: t(`${p}.integrationLinks`),
          visionPhrases: t(`${p}.visionPhrases`),
        }}
      />
    </div>
  );
}
