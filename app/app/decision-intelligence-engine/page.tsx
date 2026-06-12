import { DecisionIntelligenceDashboardPanel } from "@/components/app/decision-intelligence-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DecisionIntelligenceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.decisionIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <DecisionIntelligenceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          decisionQualityScore: t(`${p}.decisionQualityScore`),
          activeWorkspaces: t(`${p}.activeWorkspaces`),
          journalEntries: t(`${p}.journalEntries`),
          assumptionReviews: t(`${p}.assumptionReviews`),
          intelligenceCapabilities: t(`${p}.intelligenceCapabilities`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          decisionIntelligenceCenter: t(`${p}.decisionIntelligenceCenter`),
          activeDecisionWorkspaces: t(`${p}.activeDecisionWorkspaces`),
          decisionWorkspaceFields: t(`${p}.decisionWorkspaceFields`),
          decisionJournals: t(`${p}.decisionJournals`),
          decisionJournalCaptures: t(`${p}.decisionJournalCaptures`),
          assumptionReviewsList: t(`${p}.assumptionReviewsList`),
          assumptionIntelligence: t(`${p}.assumptionIntelligence`),
          tradeoffAnalysis: t(`${p}.tradeoffAnalysis`),
          stakeholderImpact: t(`${p}.stakeholderImpact`),
          outcomeLearnings: t(`${p}.outcomeLearnings`),
          outcomeLearningQuestions: t(`${p}.outcomeLearningQuestions`),
          executiveReflection: t(`${p}.executiveReflection`),
          executiveAdvisoryCompanion: t(`${p}.executiveAdvisoryCompanion`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          companionLimitations: t(`${p}.companionLimitations`),
          selfLoveInDecisions: t(`${p}.selfLoveInDecisions`),
          decisionKnowledgeLibrary: t(`${p}.decisionKnowledgeLibrary`),
          integrationLinks: t(`${p}.integrationLinks`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successMetrics: t(`${p}.successMetrics`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          personalDse: t(`${p}.personalDse`),
          organizationalDecisionSupport: t(`${p}.organizationalDecisionSupport`),
          executiveIntelligence: t(`${p}.executiveIntelligence`),
          strategicForesight: t(`${p}.strategicForesight`),
          digitalTwin: t(`${p}.digitalTwin`),
          wisdomEngine: t(`${p}.wisdomEngine`),
          simulationLab: t(`${p}.simulationLab`),
          selfLove: t(`${p}.selfLove`),
        }}
      />
    </div>
  );
}
