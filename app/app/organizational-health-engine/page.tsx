import { OrganizationalHealthEngineDashboardPanel } from "@/components/app/organizational-health-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalHealthEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "organizationalHealthEngine");
  const t = createTranslator(dict);
  const p = "customerApp.organizationalHealthEngine";
  const b = `${p}.blueprint`;
  const w = `${p}.employeeWellbeing`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalHealthEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          scores: t(`${p}.scores`),
          interventions: t(`${p}.interventions`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          measureHealth: t(`${p}.measureHealth`),
          measuring: t(`${p}.measuring`),
          measureFailed: t(`${p}.measureFailed`),
          generateRecommendations: t(`${p}.generateRecommendations`),
          generating: t(`${p}.generating`),
          generateFailed: t(`${p}.generateFailed`),
          approveIntervention: t(`${p}.approveIntervention`),
          approving: t(`${p}.approving`),
          approveFailed: t(`${p}.approveFailed`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          blueprintObjectives: t(`${b}.objectives`),
          healthDomains: t(`${b}.healthDomains`),
          healthObservations: t(`${b}.healthObservations`),
          workloadAwareness: t(`${b}.workloadAwareness`),
          recognitionConnection: t(`${b}.recognitionConnection`),
          selfLoveConnection: t(`${b}.selfLoveConnection`),
          leadershipInsights: t(`${b}.leadershipInsights`),
          trustConnection: t(`${b}.trustConnection`),
          privacyPrinciples: t(`${b}.privacyPrinciples`),
          dogfooding: t(`${b}.dogfooding`),
          successCriteria: t(`${b}.successCriteria`),
          engagementSummary: t(`${b}.engagementSummary`),
          categoriesMeasured: t(`${b}.categoriesMeasured`),
          healthyCategories: t(`${b}.healthyCategories`),
          attentionRequired: t(`${b}.attentionRequired`),
          overallScore: t(`${b}.overallScore`),
          pendingInterventions: t(`${b}.pendingInterventions`),
          criterionMet: t(`${b}.criterionMet`),
          criterionPending: t(`${b}.criterionPending`),
          employeeWellbeingTitle: t(`${w}.title`),
          employeeWellbeingObjectives: t(`${w}.objectives`),
          employeeExperienceQuestions: t(`${w}.experienceQuestions`),
          wellbeingObservations: t(`${w}.wellbeingObservations`),
          wellbeingRecognitionPractices: t(`${w}.recognitionPractices`),
          companionCheckIns: t(`${w}.companionCheckIns`),
          notAiWellnessBot: t(`${w}.notAiWellnessBot`),
          wellbeingSelfLoveConnection: t(`${w}.selfLoveConnection`),
          wellbeingLeadershipConnection: t(`${w}.leadershipConnection`),
          employeeJourneyConnection: t(`${w}.employeeJourneyConnection`),
          wellbeingTrustConnection: t(`${w}.trustConnection`),
          wellbeingPrivacyPrinciples: t(`${w}.privacyPrinciples`),
          wellbeingDogfooding: t(`${w}.dogfooding`),
          wellbeingEngagementSummary: t(`${w}.engagementSummary`),
          wellbeingSuccessCriteria: t(`${w}.successCriteria`),
          experienceQuestionsDocumented: t(`${w}.experienceQuestionsDocumented`),
          wellbeingObservationsDocumented: t(`${w}.wellbeingObservationsDocumented`),
          companionCheckInsDocumented: t(`${w}.companionCheckInsDocumented`),
        }} />
    </div>
  );
}
