import { EnterpriseOrganizationEngineDashboardPanel } from "@/components/app/enterprise-organization-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseOrganizationsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "enterpriseOrganizationEngine");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseOrganizationEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    modulesTitle: t(`${p}.modulesTitle`),
    structureTitle: t(`${p}.structureTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    regionalTitle: t(`${p}.regionalTitle`),
    sharedServicesTitle: t(`${p}.sharedServicesTitle`),
    createEntityTitle: t(`${p}.createEntityTitle`),
    consolidationTitle: t(`${p}.consolidationTitle`),
    metricOrganizations: t(`${p}.metricOrganizations`),
    metricSubsidiaries: t(`${p}.metricSubsidiaries`),
    metricBusinessUnits: t(`${p}.metricBusinessUnits`),
    metricRegions: t(`${p}.metricRegions`),
    metricEmployees: t(`${p}.metricEmployees`),
    metricDigitalEmployees: t(`${p}.metricDigitalEmployees`),
    metricBusinessPacks: t(`${p}.metricBusinessPacks`),
    metricHealthScore: t(`${p}.metricHealthScore`),
    noHierarchy: t(`${p}.noHierarchy`),
    noSignals: t(`${p}.noSignals`),
    health: t(`${p}.health`),
    recommendation: t(`${p}.recommendation`),
    entityNamePlaceholder: t(`${p}.entityNamePlaceholder`),
    entitySlugPlaceholder: t(`${p}.entitySlugPlaceholder`),
    typeBusinessUnit: t(`${p}.typeBusinessUnit`),
    typeSubsidiary: t(`${p}.typeSubsidiary`),
    typeRegional: t(`${p}.typeRegional`),
    typeHolding: t(`${p}.typeHolding`),
    typeFranchise: t(`${p}.typeFranchise`),
    createEntityButton: t(`${p}.createEntityButton`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    generateReport: t(`${p}.generateReport`),
    reporting: t(`${p}.reporting`),
    reportFailed: t(`${p}.reportFailed`),
    workspaceCrossLink: t(`${p}.workspaceCrossLink`),
    workspaceLink: t(`${p}.workspaceLink`),
    module_overview: t(`${p}.modules.overview`),
    module_structure: t(`${p}.modules.structure`),
    module_business_units: t(`${p}.modules.businessUnits`),
    module_subsidiaries: t(`${p}.modules.subsidiaries`),
    module_regional: t(`${p}.modules.regional`),
    module_shared_services: t(`${p}.modules.sharedServices`),
    module_analytics: t(`${p}.modules.analytics`),
    module_governance: t(`${p}.modules.governance`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseOrganizationEngineDashboardPanel labels={labels} />
    </div>
  );
}
