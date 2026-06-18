import { DigitalWorkforceValueEngineDashboardPanel } from "@/components/app/digital-workforce-value-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DigitalWorkforceValuePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.digitalWorkforceValueEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    departmentsTitle: t(`${p}.departmentsTitle`),
    scorecardsTitle: t(`${p}.scorecardsTitle`),
    roiTitle: t(`${p}.roiTitle`),
    economicsTitle: t(`${p}.economicsTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricWorkforceSize: t(`${p}.metricWorkforceSize`),
    metricEstimatedSavings: t(`${p}.metricEstimatedSavings`),
    metricProductivityGains: t(`${p}.metricProductivityGains`),
    metricAutomationValue: t(`${p}.metricAutomationValue`),
    metricBusinessImpact: t(`${p}.metricBusinessImpact`),
    metricRoi: t(`${p}.metricRoi`),
    metricHoursSaved: t(`${p}.metricHoursSaved`),
    metricHealth: t(`${p}.metricHealth`),
    noDepartments: t(`${p}.noDepartments`),
    noScorecards: t(`${p}.noScorecards`),
    noRoiAnalyses: t(`${p}.noRoiAnalyses`),
    recommendation: t(`${p}.recommendation`),
    roiLabel: t(`${p}.roiLabel`),
    productivityLabel: t(`${p}.productivityLabel`),
    savingsLabel: t(`${p}.savingsLabel`),
    valueScoreLabel: t(`${p}.valueScoreLabel`),
    generateRoi: t(`${p}.generateRoi`),
    generateForecast: t(`${p}.generateForecast`),
    generateBenchmark: t(`${p}.generateBenchmark`),
    refreshScorecards: t(`${p}.refreshScorecards`),
    acting: t(`${p}.acting`),
    openRoi: t(`${p}.openRoi`),
    openProductivity: t(`${p}.openProductivity`),
    openCostAllocation: t(`${p}.openCostAllocation`),
    openEconomics: t(`${p}.openEconomics`),
    openSavings: t(`${p}.openSavings`),
    openBusinessImpact: t(`${p}.openBusinessImpact`),
    openGovernance: t(`${p}.openGovernance`),
    openRecruitment: t(`${p}.openRecruitment`),
    openLifecycle: t(`${p}.openLifecycle`),
    openOrchestration: t(`${p}.openOrchestration`),
    platformCosts: t(`${p}.platformCosts`),
    licensingCosts: t(`${p}.licensingCosts`),
    operationalCosts: t(`${p}.operationalCosts`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <DigitalWorkforceValueEngineDashboardPanel labels={labels} />
    </div>
  );
}
