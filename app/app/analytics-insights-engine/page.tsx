import { AnalyticsInsightsEngineDashboardPanel } from "@/components/app/analytics-insights-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AnalyticsInsightsEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.analyticsInsightsEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AnalyticsInsightsEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          analyticsEngine: t(`${p}.analyticsEngine`),
          operationsDashboard: t(`${p}.operationsDashboard`),
          supportAi: t(`${p}.supportAi`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          qualityGuardian: t(`${p}.qualityGuardian`),
          refreshMetrics: t(`${p}.refreshMetrics`),
          generateInsights: t(`${p}.generateInsights`),
          exportWeekly: t(`${p}.exportWeekly`),
          exportMonthly: t(`${p}.exportMonthly`),
          organizationHealth: t(`${p}.organizationHealth`),
          activeInsights: t(`${p}.activeInsights`),
          metricsTracked: t(`${p}.metricsTracked`),
          userRole: t(`${p}.userRole`),
          kpiOverview: t(`${p}.kpiOverview`),
          improvementOpportunities: t(`${p}.improvementOpportunities`),
          insights: t(`${p}.insights`),
          confidence: t(`${p}.confidence`),
          reports: t(`${p}.reports`),
          principles: t(`${p}.principles`),
          unknown: t(`${p}.unknown`),
        }}
      />
    </div>
  );
}
