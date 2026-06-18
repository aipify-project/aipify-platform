import { AiEthicsResponsibleUseEngineDashboardPanel } from "@/components/app/ai-ethics-responsible-use-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AiEthicsResponsibleUseEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aiEthicsResponsibleUseEngine");
  const t = createTranslator(dict);
  const p = "customerApp.aiEthicsResponsibleUseEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AiEthicsResponsibleUseEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          explainabilityRequirements: t(`${p}.explainabilityRequirements`),
          prohibitedExamples: t(`${p}.prohibitedExamples`),
          approvedUseCases: t(`${p}.approvedUseCases`),
          proposedUseCases: t(`${p}.proposedUseCases`),
          restrictedUseCases: t(`${p}.restrictedUseCases`),
          reviewSchedules: t(`${p}.reviewSchedules`),
          oversightTrends: t(`${p}.oversightTrends`),
          integrationNotes: t(`${p}.integrationNotes`),
          approve: t(`${p}.approve`),
          restrict: t(`${p}.restrict`),
          actionFailed: t(`${p}.actionFailed`),
          criticalNote: t(`${p}.criticalNote`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintPhase54: t(`${p}.blueprintPhase54`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionPrinciples: t(`${p}.companionPrinciples`),
          autonomyPrinciples: t(`${p}.autonomyPrinciples`),
          emotionalSafety: t(`${p}.emotionalSafety`),
          dataEthics: t(`${p}.dataEthics`),
          organizationalGovernance: t(`${p}.organizationalGovernance`),
          companionEvolutionReviews: t(`${p}.companionEvolutionReviews`),
          trustConnection: t(`${p}.trustConnection`),
          governanceSummary: t(`${p}.governanceSummary`),
          governanceHealth: t(`${p}.governanceHealth`),
          highRiskActive: t(`${p}.highRiskActive`),
          successCriteria: t(`${p}.successCriteria`),
          trustActions: t(`${p}.trustActions`),
          humanOversight: t(`${p}.humanOversight`),
          companionIdentity: t(`${p}.companionIdentity`),
          selfLove: t(`${p}.selfLove`),
          councilBlueprintTitle: t(`${p}.blueprint.phase65.councilBlueprintTitle`),
          blueprintPhase65: t(`${p}.blueprint.phase65.title`),
          councilEngagementSummary: t(`${p}.blueprint.phase65.councilEngagementSummary`),
          councilObjectives: t(`${p}.blueprint.phase65.councilObjectives`),
          councilResponsibilities: t(`${p}.blueprint.phase65.councilResponsibilities`),
          guidingQuestions: t(`${p}.blueprint.phase65.guidingQuestions`),
          representationPrinciples: t(`${p}.blueprint.phase65.representationPrinciples`),
          companionPhilosophyReviews: t(`${p}.blueprint.phase65.companionPhilosophyReviews`),
          communityFeedback: t(`${p}.blueprint.phase65.communityFeedback`),
          councilSelfLoveConnection: t(`${p}.blueprint.phase65.selfLoveConnection`),
          councilTrustConnection: t(`${p}.blueprint.phase65.trustConnection`),
          councilDogfooding: t(`${p}.blueprint.phase65.dogfooding`),
          councilSuccessCriteria: t(`${p}.blueprint.phase65.successCriteria`),
          overdueReviews: t(`${p}.blueprint.phase65.overdueReviews`),
          recentAuditEvents: t(`${p}.blueprint.phase65.recentAuditEvents`),
          trustGovernanceBlueprintTitle: t(`${p}.trustEthicsGovernance.blueprintTitle`),
          blueprintPhase98: t(`${p}.trustEthicsGovernance.phase98Title`),
          trustGovernanceEngagementSummary: t(`${p}.trustEthicsGovernance.engagementSummary`),
          trustGovernanceObjectives: t(`${p}.trustEthicsGovernance.objectives`),
          ethicalQuestions: t(`${p}.trustEthicsGovernance.ethicalQuestions`),
          governancePrinciples: t(`${p}.trustEthicsGovernance.governancePrinciples`),
          humanInTheLoop: t(`${p}.trustEthicsGovernance.humanInTheLoop`),
          companionTransparency: t(`${p}.trustEthicsGovernance.companionTransparency`),
          ethicalReviewPractices: t(`${p}.trustEthicsGovernance.ethicalReviewPractices`),
          trustGovernanceCompanionGuidance: t(`${p}.trustEthicsGovernance.companionGuidance`),
          trustGovernanceSelfLoveConnection: t(`${p}.trustEthicsGovernance.selfLoveConnection`),
          leadershipConnection: t(`${p}.trustEthicsGovernance.leadershipConnection`),
          trustGovernanceTrustConnection: t(`${p}.trustEthicsGovernance.trustConnection`),
          privacyPrinciples: t(`${p}.trustEthicsGovernance.privacyPrinciples`),
          trustGovernanceDogfooding: t(`${p}.trustEthicsGovernance.dogfooding`),
          trustGovernanceSuccessCriteria: t(`${p}.trustEthicsGovernance.successCriteria`),
        }} />
    </div>
  );
}
