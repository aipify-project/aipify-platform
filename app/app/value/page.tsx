import { EnterpriseValueRealizationRoiDashboardPanel } from "@/components/app/enterprise-value-realization-roi-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ValueRealizationCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "enterpriseValueRealizationRoiEngine");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseValueRealizationRoiEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    roiTitle: t(`${p}.roiTitle`),
    timeSavingsTitle: t(`${p}.timeSavingsTitle`),
    costSavingsTitle: t(`${p}.costSavingsTitle`),
    revenueImpactTitle: t(`${p}.revenueImpactTitle`),
    workforceImpactTitle: t(`${p}.workforceImpactTitle`),
    strategicImpactTitle: t(`${p}.strategicImpactTitle`),
    timelineTitle: t(`${p}.timelineTitle`),
    benchmarksTitle: t(`${p}.benchmarksTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    analyticsTitle: t(`${p}.analyticsTitle`),
    reportsTitle: t(`${p}.reportsTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricEstimatedValue: t(`${p}.metricEstimatedValue`),
    metricHoursSaved: t(`${p}.metricHoursSaved`),
    metricCostsReduced: t(`${p}.metricCostsReduced`),
    metricRevenueInfluenced: t(`${p}.metricRevenueInfluenced`),
    metricWorkflowsAutomated: t(`${p}.metricWorkflowsAutomated`),
    metricCustomerImpact: t(`${p}.metricCustomerImpact`),
    metricHealth: t(`${p}.metricHealth`),
    metricNetRoi: t(`${p}.metricNetRoi`),
    savingsLabel: t(`${p}.savingsLabel`),
    revenueLabel: t(`${p}.revenueLabel`),
    hoursLabel: t(`${p}.hoursLabel`),
    tasksLabel: t(`${p}.tasksLabel`),
    impactLabel: t(`${p}.impactLabel`),
    noRoi: t(`${p}.noRoi`),
    noTimeSavings: t(`${p}.noTimeSavings`),
    noCostSavings: t(`${p}.noCostSavings`),
    noRevenueImpact: t(`${p}.noRevenueImpact`),
    noWorkforceImpact: t(`${p}.noWorkforceImpact`),
    noStrategicImpact: t(`${p}.noStrategicImpact`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openValueEngine: t(`${p}.openValueEngine`),
    calculateRoi: t(`${p}.calculateRoi`),
    recordSavings: t(`${p}.recordSavings`),
    updateRevenueImpact: t(`${p}.updateRevenueImpact`),
    updateBenchmark: t(`${p}.updateBenchmark`),
    generateReport: t(`${p}.generateReport`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    executiveSummary: t(`${p}.executiveSummary`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseValueRealizationRoiDashboardPanel labels={labels} />
    </div>
  );
}
