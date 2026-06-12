import { StrategicIntelligenceFoundationEngineDashboardPanel } from "@/components/app/strategic-intelligence-foundation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategicIntelligenceFoundationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.strategicIntelligenceFoundationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <StrategicIntelligenceFoundationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          newInsights: t(`${p}.newInsights`),
          highImpact: t(`${p}.highImpact`),
          completed: t(`${p}.completed`),
          runScan: t(`${p}.runScan`),
          scanning: t(`${p}.scanning`),
          strategicObjectives: t(`${p}.strategicObjectives`),
          insightCategories: t(`${p}.insightCategories`),
          activeInsights: t(`${p}.activeInsights`),
          priorities: t(`${p}.priorities`),
          noItems: t(`${p}.noItems`),
          dismiss: t(`${p}.dismiss`),
          dismissing: t(`${p}.dismissing`),
          companionExamples: t(`${p}.companionExamples`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          trustConnection: t(`${p}.trustConnection`),
          dataSources: t(`${p}.dataSources`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          visionPhrases: t(`${p}.visionPhrases`),
          phase79Title: t(`${p}.blueprint.phase79.phase79Title`),
          blueprintObjectives: t(`${p}.blueprint.phase79.blueprintObjectives`),
          intelligenceSources: t(`${p}.blueprint.phase79.intelligenceSources`),
          strategicObservations: t(`${p}.blueprint.phase79.strategicObservations`),
          patternRecognition: t(`${p}.blueprint.phase79.patternRecognition`),
          opportunityIdentification: t(`${p}.blueprint.phase79.opportunityIdentification`),
          leadershipBriefings: t(`${p}.blueprint.phase79.leadershipBriefings`),
          companionGuidance: t(`${p}.blueprint.phase79.companionGuidance`),
          limitationPrinciples: t(`${p}.blueprint.phase79.limitationPrinciples`),
          engagementSummary: t(`${p}.blueprint.phase79.engagementSummary`),
          totalInsights: t(`${p}.blueprint.phase79.totalInsights`),
          highImpactInsights: t(`${p}.blueprint.phase79.highImpactInsights`),
          activeCategories: t(`${p}.blueprint.phase79.activeCategories`),
          blueprintSuccessCriteria: t(`${p}.blueprint.phase79.blueprintSuccessCriteria`),
          blueprintSelfLoveConnection: t(`${p}.blueprint.phase79.blueprintSelfLoveConnection`),
          blueprintTrustConnection: t(`${p}.blueprint.phase79.blueprintTrustConnection`),
          blueprintVisionPhrases: t(`${p}.blueprint.phase79.blueprintVisionPhrases`),
          forbidden: t(`${p}.blueprint.phase79.forbidden`),
          required: t(`${p}.blueprint.phase79.required`),
          phase85Title: t(`${p}.blueprint.phase85.phase85Title`),
          adaptiveObjectives: t(`${p}.blueprint.phase85.adaptiveObjectives`),
          adaptiveStrategicQuestions: t(`${p}.blueprint.phase85.adaptiveStrategicQuestions`),
          continuousStrategicReview: t(`${p}.blueprint.phase85.continuousStrategicReview`),
          strategicFlexibility: t(`${p}.blueprint.phase85.strategicFlexibility`),
          learningOrganizationConnection: t(`${p}.blueprint.phase85.learningOrganizationConnection`),
          leadershipInsights: t(`${p}.blueprint.phase85.leadershipInsights`),
          adaptiveCompanionGuidance: t(`${p}.blueprint.phase85.adaptiveCompanionGuidance`),
          adaptiveLimitationPrinciples: t(`${p}.blueprint.phase85.adaptiveLimitationPrinciples`),
          adaptiveEngagementSummary: t(`${p}.blueprint.phase85.adaptiveEngagementSummary`),
          adaptiveQuestions: t(`${p}.blueprint.phase85.adaptiveQuestions`),
          reviewDimensions: t(`${p}.blueprint.phase85.reviewDimensions`),
          flexibilityModes: t(`${p}.blueprint.phase85.flexibilityModes`),
          learningConnections: t(`${p}.blueprint.phase85.learningConnections`),
          adaptiveSuccessCriteria: t(`${p}.blueprint.phase85.adaptiveSuccessCriteria`),
          adaptiveSelfLoveConnection: t(`${p}.blueprint.phase85.adaptiveSelfLoveConnection`),
          adaptiveTrustConnection: t(`${p}.blueprint.phase85.adaptiveTrustConnection`),
          adaptiveVisionPhrases: t(`${p}.blueprint.phase85.adaptiveVisionPhrases`),
        }}
      />
    </div>
  );
}
