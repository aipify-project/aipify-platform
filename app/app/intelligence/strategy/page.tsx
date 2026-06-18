import { EnterpriseStrategicIntelligenceAdvisoryDashboardPanel } from "@/components/app/enterprise-strategic-intelligence-advisory-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategicIntelligencePage() {
  const dict = await getCustomerAppDictionaryForModule(
    await getLocale(),
    "enterpriseStrategicIntelligenceAdvisoryEngine"
  );
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseStrategicIntelligenceAdvisoryEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    briefingsTitle: t(`${p}.briefingsTitle`),
    objectivesTitle: t(`${p}.objectivesTitle`),
    risksTitle: t(`${p}.risksTitle`),
    opportunitiesTitle: t(`${p}.opportunitiesTitle`),
    forecastsTitle: t(`${p}.forecastsTitle`),
    scenariosTitle: t(`${p}.scenariosTitle`),
    prioritiesTitle: t(`${p}.prioritiesTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    metricObjectives: t(`${p}.metricObjectives`),
    metricInitiatives: t(`${p}.metricInitiatives`),
    metricRisks: t(`${p}.metricRisks`),
    metricOpportunities: t(`${p}.metricOpportunities`),
    metricPriorities: t(`${p}.metricPriorities`),
    metricForecastConfidence: t(`${p}.metricForecastConfidence`),
    metricHealth: t(`${p}.metricHealth`),
    metricGrowthOutlook: t(`${p}.metricGrowthOutlook`),
    noBriefings: t(`${p}.noBriefings`),
    noObjectives: t(`${p}.noObjectives`),
    noRisks: t(`${p}.noRisks`),
    noOpportunities: t(`${p}.noOpportunities`),
    noForecasts: t(`${p}.noForecasts`),
    noScenarios: t(`${p}.noScenarios`),
    noPriorities: t(`${p}.noPriorities`),
    noAdvisorSignals: t(`${p}.noAdvisorSignals`),
    recommendation: t(`${p}.recommendation`),
    generateBriefing: t(`${p}.generateBriefing`),
    generateForecast: t(`${p}.generateForecast`),
    createScenario: t(`${p}.createScenario`),
    generateDecisionReport: t(`${p}.generateDecisionReport`),
    acting: t(`${p}.acting`),
    openBriefings: t(`${p}.openBriefings`),
    openRisk: t(`${p}.openRisk`),
    openOpportunity: t(`${p}.openOpportunity`),
    openForecast: t(`${p}.openForecast`),
    openScenario: t(`${p}.openScenario`),
    openDecisionSupport: t(`${p}.openDecisionSupport`),
    openExecutive: t(`${p}.openExecutive`),
    openScenarioPlanning: t(`${p}.openScenarioPlanning`),
    openExecutiveForesight: t(`${p}.openExecutiveForesight`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseStrategicIntelligenceAdvisoryDashboardPanel labels={labels} />
    </div>
  );
}
