import { DigitalWorkforceGovernanceEngineDashboardPanel } from "@/components/app/digital-workforce-governance-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DigitalWorkforceGovernancePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "digitalWorkforceGovernanceEngine");
  const t = createTranslator(dict);
  const p = "customerApp.digitalWorkforceGovernanceEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    authorityLevelsTitle: t(`${p}.authorityLevelsTitle`),
    matrixTitle: t(`${p}.matrixTitle`),
    assignmentsTitle: t(`${p}.assignmentsTitle`),
    policiesTitle: t(`${p}.policiesTitle`),
    decisionsTitle: t(`${p}.decisionsTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricEmployees: t(`${p}.metricEmployees`),
    metricAuthorityLevels: t(`${p}.metricAuthorityLevels`),
    metricActivePolicies: t(`${p}.metricActivePolicies`),
    metricApprovalChains: t(`${p}.metricApprovalChains`),
    metricExceptions: t(`${p}.metricExceptions`),
    metricRiskEvents: t(`${p}.metricRiskEvents`),
    metricOpenDecisions: t(`${p}.metricOpenDecisions`),
    metricHealth: t(`${p}.metricHealth`),
    noMatrix: t(`${p}.noMatrix`),
    noAssignments: t(`${p}.noAssignments`),
    noDecisions: t(`${p}.noDecisions`),
    recommendation: t(`${p}.recommendation`),
    levelLabel: t(`${p}.levelLabel`),
    humanApproval: t(`${p}.humanApproval`),
    syncAuthority: t(`${p}.syncAuthority`),
    completeReview: t(`${p}.completeReview`),
    logRiskEvent: t(`${p}.logRiskEvent`),
    defaultRiskTitle: t(`${p}.defaultRiskTitle`),
    policyNamePlaceholder: t(`${p}.policyNamePlaceholder`),
    createPolicy: t(`${p}.createPolicy`),
    acting: t(`${p}.acting`),
    openDecisionAuthority: t(`${p}.openDecisionAuthority`),
    openApprovalPolicies: t(`${p}.openApprovalPolicies`),
    openRiskPolicies: t(`${p}.openRiskPolicies`),
    openEthicalGuidelines: t(`${p}.openEthicalGuidelines`),
    openEscalationRules: t(`${p}.openEscalationRules`),
    openAnalytics: t(`${p}.openAnalytics`),
    openIntelligence: t(`${p}.openIntelligence`),
    openLifecycle: t(`${p}.openLifecycle`),
    openValue: t(`${p}.openValue`),
    openApprovals: t(`${p}.openApprovals`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <DigitalWorkforceGovernanceEngineDashboardPanel labels={labels} />
    </div>
  );
}
