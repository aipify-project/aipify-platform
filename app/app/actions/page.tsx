import { RealWorldActionServiceOrchestrationDashboardPanel } from "@/components/app/real-world-action-service-orchestration-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import Link from "next/link";

export default async function RealWorldActionsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(
    locale,
    "realWorldActionServiceOrchestrationEngine"
  );
  const t = createTranslator(dict);
  const p = "customerApp.realWorldActionServiceOrchestrationEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    catalogTitle: t(`${p}.catalogTitle`),
    providersTitle: t(`${p}.providersTitle`),
    approvalsTitle: t(`${p}.approvalsTitle`),
    executionsTitle: t(`${p}.executionsTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    auditTitle: t(`${p}.auditTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricAvailable: t(`${p}.metricAvailable`),
    metricPending: t(`${p}.metricPending`),
    metricExecuted: t(`${p}.metricExecuted`),
    metricFailed: t(`${p}.metricFailed`),
    metricProviders: t(`${p}.metricProviders`),
    metricHealth: t(`${p}.metricHealth`),
    metricSuccessRate: t(`${p}.metricSuccessRate`),
    metricAutomation: t(`${p}.metricAutomation`),
    noCatalog: t(`${p}.noCatalog`),
    noProviders: t(`${p}.noProviders`),
    noApprovals: t(`${p}.noApprovals`),
    noExecutions: t(`${p}.noExecutions`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openActionHub: t(`${p}.openActionHub`),
    openApprovals: t(`${p}.openApprovals`),
    openActionCenter: t(`${p}.openActionCenter`),
    requestAction: t(`${p}.requestAction`),
    executeAction: t(`${p}.executeAction`),
    initiateRecovery: t(`${p}.initiateRecovery`),
    registerProvider: t(`${p}.registerProvider`),
    approve: t(`${p}.approve`),
    reject: t(`${p}.reject`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    acting: t(`${p}.acting`),
    vendorTier: t(`${p}.vendorTier`),
    approvalReq: t(`${p}.approvalReq`),
    governanceNoIrreversible: t(`${p}.governanceNoIrreversible`),
    governanceNoFinancial: t(`${p}.governanceNoFinancial`),
    governanceNoExternal: t(`${p}.governanceNoExternal`),
    governanceHumanOverride: t(`${p}.governanceHumanOverride`),
    executiveSummary: t(`${p}.executiveSummary`),
    executedLabel: t(`${p}.executedLabel`),
    pendingLabel: t(`${p}.pendingLabel`),
    successLabel: t(`${p}.successLabel`),
    actionHubTitle: t(`${p}.actionHubTitle`),
    actionHubLink: t(`${p}.actionHubLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <RealWorldActionServiceOrchestrationDashboardPanel labels={labels} />
      <section className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-800">{labels.actionHubTitle}</p>
        <p className="mt-1 text-xs text-gray-500">{t(`${p}.actionHubNote`)}</p>
        <Link href="/app/actions/inbox" className="mt-2 inline-block text-sm text-slate-700 underline">
          {labels.actionHubLink}
        </Link>
      </section>
    </div>
  );
}
