import { PredictiveInsightsEngineDashboardPanel } from "@/components/app/predictive-insights-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PredictiveInsightsEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.predictiveInsightsEngine";
  const b = `${p}.blueprint.phase74`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PredictiveInsightsEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          activeInsights: t(`${p}.activeInsights`),
          highRiskInsights: t(`${p}.highRiskInsights`),
          criticalInsights: t(`${p}.criticalInsights`),
          dismissedInsights: t(`${p}.dismissedInsights`),
          predictionTypes: t(`${p}.predictionTypes`),
          insightsSection: t(`${p}.insightsSection`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          confidence: t(`${p}.confidence`),
          risk: t(`${p}.risk`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          generateInsights: t(`${p}.generateInsights`),
          generating: t(`${p}.generating`),
          generateFailed: t(`${p}.generateFailed`),
          dismissInsight: t(`${p}.dismissInsight`),
          actionFailed: t(`${p}.actionFailed`),
          blueprintObjectives: t(`${b}.objectives`),
          operationalPatternRecognition: t(`${b}.operationalPatternRecognition`),
          resourceAwareness: t(`${b}.resourceAwareness`),
          bottleneckForecasting: t(`${b}.bottleneckForecasting`),
          scenarioObservations: t(`${b}.scenarioObservations`),
          executiveInsights: t(`${b}.executiveInsights`),
          companionGuidance: t(`${b}.companionGuidance`),
          selfLoveConnection: t(`${b}.selfLoveConnection`),
          trustConnection: t(`${b}.trustConnection`),
          limitationPrinciples: t(`${b}.limitationPrinciples`),
          dogfooding: t(`${b}.dogfooding`),
          engagementSummary: t(`${b}.engagementSummary`),
          patternSignals: t(`${b}.patternSignals`),
          bottleneckForecasts: t(`${b}.bottleneckForecasts`),
          successCriteria: t(`${b}.successCriteria`),
          criterionMet: t(`${b}.criterionMet`),
          criterionPending: t(`${b}.criterionPending`),
          visionPhrases: t(`${b}.visionPhrases`),
          forbidden: t(`${b}.forbidden`),
          required: t(`${b}.required`),
        }} />
    </div>
  );
}
