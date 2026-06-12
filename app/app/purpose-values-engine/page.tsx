import { PurposeValuesEngineDashboardPanel } from "@/components/app/purpose-values-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PurposeValuesEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.purposeValuesEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PurposeValuesEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          activeValues: t(`${p}.activeValues`),
          pendingReflections: t(`${p}.pendingReflections`),
          recentSignals: t(`${p}.recentSignals`),
          hasPurposeStatement: t(`${p}.hasPurposeStatement`),
          yes: t(`${p}.yes`),
          no: t(`${p}.no`),
          purposeSettings: t(`${p}.purposeSettings`),
          purposeStatement: t(`${p}.purposeStatement`),
          reflectionEnabled: t(`${p}.reflectionEnabled`),
          celebrateWins: t(`${p}.celebrateWins`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          statedValues: t(`${p}.statedValues`),
          reflections: t(`${p}.reflections`),
          acknowledge: t(`${p}.acknowledge`),
          dismiss: t(`${p}.dismiss`),
          actionFailed: t(`${p}.actionFailed`),
          alignmentSignals: t(`${p}.alignmentSignals`),
          alignmentScore: t(`${p}.alignmentScore`),
          decisionSupport: t(`${p}.decisionSupport`),
          cultureSupport: t(`${p}.cultureSupport`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          blueprintObjectives: t(`${p}.blueprint.objectives`),
          purposeDiscovery: t(`${p}.blueprint.purposeDiscovery`),
          valuesExploration: t(`${p}.blueprint.valuesExploration`),
          valuesInAction: t(`${p}.blueprint.valuesInAction`),
          decisionAlignment: t(`${p}.blueprint.decisionAlignment`),
          organizationalStorytelling: t(`${p}.blueprint.organizationalStorytelling`),
          selfLoveConnection: t(`${p}.blueprint.selfLoveConnection`),
          leadershipInsights: t(`${p}.blueprint.leadershipInsights`),
          trustConnection: t(`${p}.blueprint.trustConnection`),
          dogfooding: t(`${p}.blueprint.dogfooding`),
          engagementSummary: t(`${p}.blueprint.engagementSummary`),
          activeStatedValues: t(`${p}.blueprint.activeStatedValues`),
          recentAlignmentSignals: t(`${p}.blueprint.recentAlignmentSignals`),
          pendingReflectionsCount: t(`${p}.blueprint.pendingReflectionsCount`),
          successCriteria: t(`${p}.blueprint.successCriteria`),
          criterionMet: t(`${p}.blueprint.criterionMet`),
          criterionPending: t(`${p}.blueprint.criterionPending`),
          visionPhrases: t(`${p}.blueprint.visionPhrases`),
          culturalAlignmentObjectives: t(`${p}.culturalAlignment.objectives`),
          culturalAlignmentPurposeQuestions: t(`${p}.culturalAlignment.purposeQuestions`),
          culturalAlignmentValuesReflection: t(`${p}.culturalAlignment.valuesReflection`),
          culturalAlignmentObservations: t(`${p}.culturalAlignment.observations`),
          culturalAlignmentOnboarding: t(`${p}.culturalAlignment.onboarding`),
          culturalAlignmentCompanionGuidance: t(`${p}.culturalAlignment.companionGuidance`),
          culturalAlignmentRecognition: t(`${p}.culturalAlignment.recognition`),
          culturalAlignmentLeadership: t(`${p}.culturalAlignment.leadership`),
          culturalAlignmentPrivacy: t(`${p}.culturalAlignment.privacy`),
          culturalAlignmentEngagement: t(`${p}.culturalAlignment.engagementSummary`),
          culturalAlignmentPurposeQuestionsCount: t(`${p}.culturalAlignment.purposeQuestionsCount`),
          culturalAlignmentValuesReflectionCount: t(`${p}.culturalAlignment.valuesReflectionCount`),
          culturalAlignmentObservationsCount: t(`${p}.culturalAlignment.observationsCount`),
          culturalAlignmentSuccessCriteria: t(`${p}.culturalAlignment.successCriteria`),
          culturalAlignmentVisionPhrases: t(`${p}.culturalAlignment.visionPhrases`),
          phase138Objectives: t(`${p}.phase138.objectives`),
          phase138AlignmentCenter: t(`${p}.phase138.alignmentCenter`),
          phase138ValuesFramework: t(`${p}.phase138.valuesFramework`),
          phase138AlignmentReview: t(`${p}.phase138.alignmentReview`),
          phase138PurposeCompanion: t(`${p}.phase138.purposeCompanion`),
          phase138CultureHealth: t(`${p}.phase138.cultureHealth`),
          phase138ExecutiveReviews: t(`${p}.phase138.executiveReviews`),
          phase138CompanionLimitations: t(`${p}.phase138.companionLimitations`),
          phase138SelfLoveConnection: t(`${p}.phase138.selfLoveConnection`),
          phase138Engagement: t(`${p}.phase138.engagementSummary`),
          phase138AlignmentReviews: t(`${p}.phase138.alignmentReviews`),
          phase138ValuesMemory: t(`${p}.phase138.valuesMemory`),
          phase138CultureSnapshots: t(`${p}.phase138.cultureSnapshots`),
          phase138SuccessCriteria: t(`${p}.phase138.successCriteria`),
          phase138VisionPhrases: t(`${p}.phase138.visionPhrases`),
        }}
      />
    </div>
  );
}
