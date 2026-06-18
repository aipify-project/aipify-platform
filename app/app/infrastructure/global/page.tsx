import { GlobalDeploymentEnterpriseInfrastructureDashboardPanel } from "@/components/app/global-deployment-enterprise-infrastructure-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalInfrastructurePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "globalDeploymentEnterpriseInfrastructureEngine");
  const t = createTranslator(dict);
  const p = "customerApp.globalDeploymentEnterpriseInfrastructureEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    regionsTitle: t(`${p}.regionsTitle`),
    countriesTitle: t(`${p}.countriesTitle`),
    localizationTitle: t(`${p}.localizationTitle`),
    complianceTitle: t(`${p}.complianceTitle`),
    residencyTitle: t(`${p}.residencyTitle`),
    infrastructureTitle: t(`${p}.infrastructureTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    auditTitle: t(`${p}.auditTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricRegions: t(`${p}.metricRegions`),
    metricCountries: t(`${p}.metricCountries`),
    metricLanguages: t(`${p}.metricLanguages`),
    metricDeployments: t(`${p}.metricDeployments`),
    metricCompliance: t(`${p}.metricCompliance`),
    metricHealth: t(`${p}.metricHealth`),
    metricUsage: t(`${p}.metricUsage`),
    metricInfraHealth: t(`${p}.metricInfraHealth`),
    noRegions: t(`${p}.noRegions`),
    noCountries: t(`${p}.noCountries`),
    noLocalizations: t(`${p}.noLocalizations`),
    noCompliance: t(`${p}.noCompliance`),
    noResidency: t(`${p}.noResidency`),
    noDeployments: t(`${p}.noDeployments`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openGlobalExpansion: t(`${p}.openGlobalExpansion`),
    openDeploymentEnvironment: t(`${p}.openDeploymentEnvironment`),
    openObservability: t(`${p}.openObservability`),
    addRegion: t(`${p}.addRegion`),
    addCountry: t(`${p}.addCountry`),
    createDeployment: t(`${p}.createDeployment`),
    updateInfrastructure: t(`${p}.updateInfrastructure`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    countriesLabel: t(`${p}.countriesLabel`),
    coreLanguagesLabel: t(`${p}.coreLanguagesLabel`),
    adoptionLabel: t(`${p}.adoptionLabel`),
    healthLabel: t(`${p}.healthLabel`),
    readinessLabel: t(`${p}.readinessLabel`),
    governanceTenantIsolation: t(`${p}.governanceTenantIsolation`),
    governanceRegionalGovernance: t(`${p}.governanceRegionalGovernance`),
    governanceRegionalCompliance: t(`${p}.governanceRegionalCompliance`),
    governanceDeploymentFlexibility: t(`${p}.governanceDeploymentFlexibility`),
    governanceHumanApproval: t(`${p}.governanceHumanApproval`),
    executiveSummary: t(`${p}.executiveSummary`),
    footprintLabel: t(`${p}.footprintLabel`),
    complianceLabel: t(`${p}.complianceLabel`),
    adoptionExecutiveLabel: t(`${p}.adoptionExecutiveLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GlobalDeploymentEnterpriseInfrastructureDashboardPanel labels={labels} />
    </div>
  );
}
