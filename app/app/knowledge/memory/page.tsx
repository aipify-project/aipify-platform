import { EnterpriseOrganizationalMemoryEngineDashboardPanel } from "@/components/app/enterprise-organizational-memory-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalMemoryPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "enterpriseOrganizationalMemoryEngine");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseOrganizationalMemoryEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    sourcesTitle: t(`${p}.sourcesTitle`),
    assetsTitle: t(`${p}.assetsTitle`),
    decisionsTitle: t(`${p}.decisionsTitle`),
    retentionTitle: t(`${p}.retentionTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricAssets: t(`${p}.metricAssets`),
    metricDocuments: t(`${p}.metricDocuments`),
    metricDecisions: t(`${p}.metricDecisions`),
    metricProcesses: t(`${p}.metricProcesses`),
    metricCoverage: t(`${p}.metricCoverage`),
    metricHealth: t(`${p}.metricHealth`),
    metricGrowth: t(`${p}.metricGrowth`),
    metricSources: t(`${p}.metricSources`),
    noAssets: t(`${p}.noAssets`),
    noDecisions: t(`${p}.noDecisions`),
    recommendation: t(`${p}.recommendation`),
    assetTitlePlaceholder: t(`${p}.assetTitlePlaceholder`),
    decisionTitlePlaceholder: t(`${p}.decisionTitlePlaceholder`),
    addAsset: t(`${p}.addAsset`),
    recordDecision: t(`${p}.recordDecision`),
    validateKnowledge: t(`${p}.validateKnowledge`),
    acting: t(`${p}.acting`),
    openSources: t(`${p}.openSources`),
    openOrganizational: t(`${p}.openOrganizational`),
    openDecisions: t(`${p}.openDecisions`),
    openOperational: t(`${p}.openOperational`),
    openCollective: t(`${p}.openCollective`),
    openAnalytics: t(`${p}.openAnalytics`),
    openGovernance: t(`${p}.openGovernance`),
    openKnowledgeCenter: t(`${p}.openKnowledgeCenter`),
    openLearning: t(`${p}.openLearning`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseOrganizationalMemoryEngineDashboardPanel labels={labels} />
    </div>
  );
}
