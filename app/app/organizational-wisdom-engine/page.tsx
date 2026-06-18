import { OrganizationalWisdomDashboardPanel } from "@/components/app/organizational-wisdom-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalWisdomEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "organizationalWisdom");
  const t = createTranslator(dict);
  const p = "customerApp.organizationalWisdom";
  const p157 = "customerApp.organizationalWisdomEngine.phase157";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalWisdomDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          wisdomMaturityScore: t(`${p}.wisdomMaturityScore`),
          activeReflectionWorkspaces: t(`${p}.activeReflectionWorkspaces`),
          ethicsReviews: t(`${p}.ethicsReviews`),
          cultureThemeSnapshots: t(`${p}.cultureThemeSnapshots`),
          wisdomCenterCapabilities: t(`${p}.wisdomCenterCapabilities`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          wisdomCenter: t(`${p}.wisdomCenter`),
          ethicalIntelligenceEngine: t(`${p}.ethicalIntelligenceEngine`),
          valuesAlignmentEngine: t(`${p}.valuesAlignmentEngine`),
          multiPerspectiveFramework: t(`${p}.multiPerspectiveFramework`),
          ethicsReviewsList: t(`${p}.ethicsReviewsList`),
          decisionEthicsReview: t(`${p}.decisionEthicsReview`),
          cultureInsightEngine: t(`${p}.cultureInsightEngine`),
          cultureInsightNote: t(`${p}.cultureInsightNote`),
          wisdomPractices: t(`${p}.wisdomPractices`),
          wisdomPracticesLibrary: t(`${p}.wisdomPracticesLibrary`),
          wisdomCompanion: t(`${p}.wisdomCompanion`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          companionLimitations: t(`${p}.companionLimitations`),
          selfLoveInWisdom: t(`${p}.selfLoveInWisdom`),
          ethicalGovernanceIntegration: t(`${p}.ethicalGovernanceIntegration`),
          integrationLinks: t(`${p}.integrationLinks`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successMetrics: t(`${p}.successMetrics`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          wisdomEngine: t(`${p}.wisdomEngine`),
          aiEthics: t(`${p}.aiEthics`),
          purposeValues: t(`${p}.purposeValues`),
          decisionIntelligence: t(`${p}.decisionIntelligence`),
          socialImpact: t(`${p}.socialImpact`),
          boardGovernance: t(`${p}.boardGovernance`),
          organizationalMemory: t(`${p}.organizationalMemory`),
          inclusionHumanity: t(`${p}.inclusionHumanity`),
          selfLove: t(`${p}.selfLove`),
          collectiveDecisionCouncil: t(`${p}.collectiveDecisionCouncil`),
          strategicForesight: t(`${p}.strategicForesight`),
          changeManagement: t(`${p}.changeManagement`),
          futureLeaders: t(`${p}.futureLeaders`),
          phase157Title: t(`${p157}.title`),
          phase157Objectives: t(`${p157}.objectives`),
          phase157WisdomCouncilCenter: t(`${p157}.wisdomCouncilCenter`),
          phase157EthicalForesight: t(`${p157}.ethicalForesight`),
          phase157StakeholderAwareness: t(`${p157}.stakeholderAwareness`),
          phase157ExecutiveWisdom: t(`${p157}.executiveWisdom`),
          phase157CouncilReviews: t(`${p157}.councilReviews`),
          phase157ForesightSessions: t(`${p157}.foresightSessions`),
          phase157WisdomCompanion: t(`${p157}.wisdomCompanion`),
          phase157EthicalInnovation: t(`${p157}.ethicalInnovation`),
          phase157FutureConsequences: t(`${p157}.futureConsequences`),
          phase157WisdomMemory: t(`${p157}.wisdomMemory`),
          phase157MemoryEntries: t(`${p157}.memoryEntries`),
          phase157StakeholderSnapshots: t(`${p157}.stakeholderSnapshots`),
          phase157StakeholderNote: t(`${p157}.stakeholderNote`),
          phase157CompanionLimitations: t(`${p157}.companionLimitations`),
          phase157SelfLove: t(`${p157}.selfLove`),
          phase157Security: t(`${p157}.security`),
          phase157Engagement: t(`${p157}.engagement`),
          phase157VisionPhrases: t(`${p157}.visionPhrases`),
          phase157SuccessCriteria: t(`${p157}.successCriteria`),
          phase157IntegrationLinks: t(`${p157}.integrationLinks`),
        }}
      />
    </div>
  );
}
