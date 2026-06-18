import { LegalComplianceCaseOperationsPackDashboardPanel } from "@/components/app/legal-compliance-case-operations-pack";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LegalPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.legalComplianceCaseOperationsPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    casesTitle: t(`${p}.casesTitle`),
    contractsTitle: t(`${p}.contractsTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricCases: t(`${p}.metricCases`),
    metricClients: t(`${p}.metricClients`),
    metricContracts: t(`${p}.metricContracts`),
    metricReviews: t(`${p}.metricReviews`),
    metricDeadlines: t(`${p}.metricDeadlines`),
    metricDocActivity: t(`${p}.metricDocActivity`),
    metricCompliance: t(`${p}.metricCompliance`),
    metricHealth: t(`${p}.metricHealth`),
    noCases: t(`${p}.noCases`),
    noContracts: t(`${p}.noContracts`),
    recommendation: t(`${p}.recommendation`),
    caseTitlePlaceholder: t(`${p}.caseTitlePlaceholder`),
    typeContractReview: t(`${p}.typeContractReview`),
    typeCorporate: t(`${p}.typeCorporate`),
    typeCompliance: t(`${p}.typeCompliance`),
    typeLitigation: t(`${p}.typeLitigation`),
    priorityLow: t(`${p}.priorityLow`),
    priorityNormal: t(`${p}.priorityNormal`),
    priorityHigh: t(`${p}.priorityHigh`),
    priorityCritical: t(`${p}.priorityCritical`),
    addCase: t(`${p}.addCase`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openCases: t(`${p}.openCases`),
    openClients: t(`${p}.openClients`),
    openContracts: t(`${p}.openContracts`),
    openCompliance: t(`${p}.openCompliance`),
    openDocuments: t(`${p}.openDocuments`),
    openGovernance: t(`${p}.openGovernance`),
    openExecutive: t(`${p}.openExecutive`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <LegalComplianceCaseOperationsPackDashboardPanel labels={labels} />
    </div>
  );
}
