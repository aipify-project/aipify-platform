import { PredictiveInsightsEngineDashboardPanel } from "@/components/app/predictive-insights-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PredictiveInsightsEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.predictiveInsightsEngine";

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
        }} />
    </div>
  );
}
