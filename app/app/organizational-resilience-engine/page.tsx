import { OrganizationalResilienceEngineDashboardPanel } from "@/components/app/organizational-resilience-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalResilienceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalResilienceEngine";
  const b = `${p}.blueprint.phase81`;
  const r = `${p}.blueprint.phase91`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalResilienceEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          mission: t(`${p}.mission`),
          dimensions: t(`${p}.dimensions`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          plans: t(`${p}.plans`),
          simulations: t(`${p}.simulations`),
          vulnerabilities: t(`${p}.vulnerabilities`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          reviewFrequency: t(`${p}.reviewFrequency`),
          submitReview: t(`${p}.submitReview`),
          approvePlan: t(`${p}.approvePlan`),
          recordSimulation: t(`${p}.recordSimulation`),
          resolve: t(`${p}.resolve`),
          updating: t(`${p}.updating`),
          approving: t(`${p}.approving`),
          recording: t(`${p}.recording`),
          resolving: t(`${p}.resolving`),
          updateFailed: t(`${p}.updateFailed`),
          approveFailed: t(`${p}.approveFailed`),
          simulationFailed: t(`${p}.simulationFailed`),
          resolveFailed: t(`${p}.resolveFailed`),
          phase81Title: t(`${b}.phase81Title`),
          blueprintObjectives: t(`${b}.blueprintObjectives`),
          riskCategories: t(`${b}.riskCategories`),
          riskQuestions: t(`${b}.riskQuestions`),
          companionGuidance: t(`${b}.companionGuidance`),
          riskPreparedness: t(`${b}.riskPreparedness`),
          riskOpportunityBalance: t(`${b}.riskOpportunityBalance`),
          leadershipInsights: t(`${b}.leadershipInsights`),
          selfLoveConnection: t(`${b}.selfLoveConnection`),
          trustConnection: t(`${b}.trustConnection`),
          limitationPrinciples: t(`${b}.limitationPrinciples`),
          engagementSummary: t(`${b}.engagementSummary`),
          activePlans: t(`${b}.activePlans`),
          openVulnerabilities: t(`${b}.openVulnerabilities`),
          completedSimulations: t(`${b}.completedSimulations`),
          successCriteria: t(`${b}.successCriteria`),
          criterionMet: t(`${b}.criterionMet`),
          criterionPending: t(`${b}.criterionPending`),
          visionPhrases: t(`${b}.visionPhrases`),
          forbidden: t(`${b}.forbidden`),
          required: t(`${b}.required`),
          phase91Title: t(`${r}.phase91Title`),
          recoveryObjectives: t(`${r}.recoveryObjectives`),
          resilienceDomains: t(`${r}.resilienceDomains`),
          resilienceQuestions: t(`${r}.resilienceQuestions`),
          recoveryCompanionGuidance: t(`${r}.recoveryCompanionGuidance`),
          recoveryReflection: t(`${r}.recoveryReflection`),
          learningThroughAdversity: t(`${r}.learningThroughAdversity`),
          recoveryLeadershipInsights: t(`${r}.recoveryLeadershipInsights`),
          recoverySelfLoveConnection: t(`${r}.recoverySelfLoveConnection`),
          recoveryTrustConnection: t(`${r}.recoveryTrustConnection`),
          recoveryLimitationPrinciples: t(`${r}.recoveryLimitationPrinciples`),
          recoveryEngagementSummary: t(`${r}.recoveryEngagementSummary`),
          completedReviews: t(`${r}.completedReviews`),
          recoverySuccessCriteria: t(`${r}.recoverySuccessCriteria`),
          recoveryVisionPhrases: t(`${r}.recoveryVisionPhrases`),
        }} />
    </div>
  );
}
