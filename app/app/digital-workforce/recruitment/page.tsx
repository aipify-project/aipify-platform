import { DigitalWorkforceRecruitmentProvisioningEngineDashboardPanel } from "@/components/app/digital-workforce-recruitment-provisioning-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DigitalWorkforceRecruitmentPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "digitalWorkforceRecruitmentEngine");
  const t = createTranslator(dict);
  const p = "customerApp.digitalWorkforceRecruitmentEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    positionsTitle: t(`${p}.positionsTitle`),
    plansTitle: t(`${p}.plansTitle`),
    hiringTitle: t(`${p}.hiringTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricEmployees: t(`${p}.metricEmployees`),
    metricOpenPositions: t(`${p}.metricOpenPositions`),
    metricDepartments: t(`${p}.metricDepartments`),
    metricWorkload: t(`${p}.metricWorkload`),
    metricCapacity: t(`${p}.metricCapacity`),
    metricAutomation: t(`${p}.metricAutomation`),
    metricHealth: t(`${p}.metricHealth`),
    noPositions: t(`${p}.noPositions`),
    noPlans: t(`${p}.noPlans`),
    noHiringRequests: t(`${p}.noHiringRequests`),
    recommendation: t(`${p}.recommendation`),
    requestTitlePlaceholder: t(`${p}.requestTitlePlaceholder`),
    defaultJustification: t(`${p}.defaultJustification`),
    deptSupport: t(`${p}.deptSupport`),
    deptFinance: t(`${p}.deptFinance`),
    deptOperations: t(`${p}.deptOperations`),
    deptCompliance: t(`${p}.deptCompliance`),
    submitHiringRequest: t(`${p}.submitHiringRequest`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openPlanning: t(`${p}.openPlanning`),
    openPositions: t(`${p}.openPositions`),
    openHiring: t(`${p}.openHiring`),
    openProvisioning: t(`${p}.openProvisioning`),
    openAnalytics: t(`${p}.openAnalytics`),
    openGovernance: t(`${p}.openGovernance`),
    openLifecycle: t(`${p}.openLifecycle`),
    openOrchestration: t(`${p}.openOrchestration`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <DigitalWorkforceRecruitmentProvisioningEngineDashboardPanel labels={labels} />
    </div>
  );
}
