import { OrganizationalWisdomDashboardPanel } from "@/components/app/organizational-wisdom-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalWisdomEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalWisdom";

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
        }}
      />
    </div>
  );
}
