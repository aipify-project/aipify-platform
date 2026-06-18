import { CapacityWorkloadManagementEngineDashboardPanel } from "@/components/app/capacity-workload-management-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CapacityWorkloadManagementEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "capacityWorkloadManagementEngine");
  const t = createTranslator(dict);
  const p = "customerApp.capacityWorkloadManagementEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CapacityWorkloadManagementEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          recommendations: t(`${p}.recommendations`),
          warnings: t(`${p}.warnings`),
          unassignedWorkSection: t(`${p}.unassignedWorkSection`),
          myWorkload: t(`${p}.myWorkload`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          overloadedUsers: t(`${p}.overloadedUsers`),
          openWarnings: t(`${p}.openWarnings`),
          unassignedWork: t(`${p}.unassignedWork`),
          upcomingRisks: t(`${p}.upcomingRisks`),
          openWorkloadItems: t(`${p}.openWorkloadItems`),
          criticalWarnings: t(`${p}.criticalWarnings`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          acknowledgeWarning: t(`${p}.acknowledgeWarning`),
          actionFailed: t(`${p}.actionFailed`),
        }} />
    </div>
  );
}
