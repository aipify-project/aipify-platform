import { EnterpriseDigitalTwinDashboardPanel } from "@/components/app/enterprise-digital-twin-future-modeling-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DigitalTwinPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "digitalTwinFutureModelingEngine");
  const t = createTranslator(dict);
  const p = "customerApp.digitalTwinFutureModelingEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    organizationTitle: t(`${p}.organizationTitle`),
    operationalTitle: t(`${p}.operationalTitle`),
    financialTitle: t(`${p}.financialTitle`),
    workforceTitle: t(`${p}.workforceTitle`),
    simulationLabTitle: t(`${p}.simulationLabTitle`),
    futureModelingTitle: t(`${p}.futureModelingTitle`),
    scenariosTitle: t(`${p}.scenariosTitle`),
    stressTestsTitle: t(`${p}.stressTestsTitle`),
    riskModelsTitle: t(`${p}.riskModelsTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    auditTitle: t(`${p}.auditTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricCoverage: t(`${p}.metricCoverage`),
    metricAccuracy: t(`${p}.metricAccuracy`),
    metricModels: t(`${p}.metricModels`),
    metricActiveSimulations: t(`${p}.metricActiveSimulations`),
    metricScenarios: t(`${p}.metricScenarios`),
    metricRiskModels: t(`${p}.metricRiskModels`),
    metricHealth: t(`${p}.metricHealth`),
    metricForecastAccuracy: t(`${p}.metricForecastAccuracy`),
    noOrganization: t(`${p}.noOrganization`),
    noOperational: t(`${p}.noOperational`),
    noFinancial: t(`${p}.noFinancial`),
    noWorkforce: t(`${p}.noWorkforce`),
    noSimulations: t(`${p}.noSimulations`),
    noForecasts: t(`${p}.noForecasts`),
    noScenarios: t(`${p}.noScenarios`),
    noStressTests: t(`${p}.noStressTests`),
    noRiskModels: t(`${p}.noRiskModels`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openSimulationLab: t(`${p}.openSimulationLab`),
    openDecisions: t(`${p}.openDecisions`),
    openProcessTwin: t(`${p}.openProcessTwin`),
    createSimulation: t(`${p}.createSimulation`),
    runSimulation: t(`${p}.runSimulation`),
    createScenario: t(`${p}.createScenario`),
    generateForecast: t(`${p}.generateForecast`),
    runStressTest: t(`${p}.runStressTest`),
    validateTwin: t(`${p}.validateTwin`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    acting: t(`${p}.acting`),
    entitiesLabel: t(`${p}.entitiesLabel`),
    coverageLabel: t(`${p}.coverageLabel`),
    maturityLabel: t(`${p}.maturityLabel`),
    confidenceLabel: t(`${p}.confidenceLabel`),
    utilizationLabel: t(`${p}.utilizationLabel`),
    headcountLabel: t(`${p}.headcountLabel`),
    resilienceLabel: t(`${p}.resilienceLabel`),
    governanceForecastsNotGuarantees: t(`${p}.governanceForecastsNotGuarantees`),
    governanceSimulationsIdentified: t(`${p}.governanceSimulationsIdentified`),
    governanceHumanOwnership: t(`${p}.governanceHumanOwnership`),
    governanceAssumptionsTransparent: t(`${p}.governanceAssumptionsTransparent`),
    governanceHumanOverride: t(`${p}.governanceHumanOverride`),
    executiveSummary: t(`${p}.executiveSummary`),
    growthLabel: t(`${p}.growthLabel`),
    riskLabel: t(`${p}.riskLabel`),
    revenueLabel: t(`${p}.revenueLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseDigitalTwinDashboardPanel labels={labels} />
    </div>
  );
}
