import { DigitalEmployeeLifecycleManagementPerformanceEngineDashboardPanel } from "@/components/app/digital-employee-lifecycle-management-performance-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DigitalEmployeesPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "digitalEmployeeLifecycleEngine");
  const t = createTranslator(dict);
  const p = "customerApp.digitalEmployeeLifecycleEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    directoryTitle: t(`${p}.directoryTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    metricActiveEmployees: t(`${p}.metricActiveEmployees`),
    metricDepartments: t(`${p}.metricDepartments`),
    metricAssignedTasks: t(`${p}.metricAssignedTasks`),
    metricCompletedTasks: t(`${p}.metricCompletedTasks`),
    metricPerformance: t(`${p}.metricPerformance`),
    metricTrainingCoverage: t(`${p}.metricTrainingCoverage`),
    metricHealth: t(`${p}.metricHealth`),
    noEmployees: t(`${p}.noEmployees`),
    recommendation: t(`${p}.recommendation`),
    performanceLabel: t(`${p}.performanceLabel`),
    healthLabel: t(`${p}.healthLabel`),
    employeeNamePlaceholder: t(`${p}.employeeNamePlaceholder`),
    roleSupport: t(`${p}.roleSupport`),
    roleOperations: t(`${p}.roleOperations`),
    roleCompliance: t(`${p}.roleCompliance`),
    roleExecutive: t(`${p}.roleExecutive`),
    roleCustom: t(`${p}.roleCustom`),
    addEmployee: t(`${p}.addEmployee`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openDirectory: t(`${p}.openDirectory`),
    openRoles: t(`${p}.openRoles`),
    openPerformance: t(`${p}.openPerformance`),
    openTraining: t(`${p}.openTraining`),
    openLifecycle: t(`${p}.openLifecycle`),
    openGovernance: t(`${p}.openGovernance`),
    openAnalytics: t(`${p}.openAnalytics`),
    openOrchestration: t(`${p}.openOrchestration`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <DigitalEmployeeLifecycleManagementPerformanceEngineDashboardPanel labels={labels} />
    </div>
  );
}
