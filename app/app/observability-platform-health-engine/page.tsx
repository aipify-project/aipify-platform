import { ObservabilityPlatformHealthEngineDashboardPanel } from "@/components/app/observability-platform-health-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ObservabilityPlatformHealthEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "observabilityPlatformHealthEngine");
  const t = createTranslator(dict);
  const p = "customerApp.observabilityPlatformHealthEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ObservabilityPlatformHealthEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          observabilityEngine: t(`${p}.observabilityEngine`),
          operationsDashboard: t(`${p}.operationsDashboard`),
          integrationEngine: t(`${p}.integrationEngine`),
          notifications: t(`${p}.notifications`),
          analytics: t(`${p}.analytics`),
          platformStatus: t(`${p}.platformStatus`),
          runHealthCheck: t(`${p}.runHealthCheck`),
          openIncidents: t(`${p}.openIncidents`),
          degradedComponents: t(`${p}.degradedComponents`),
          resolvedIncidents: t(`${p}.resolvedIncidents`),
          maintenanceWindows: t(`${p}.maintenanceWindows`),
          componentStatus: t(`${p}.componentStatus`),
          noComponents: t(`${p}.noComponents`),
          activeIncidents: t(`${p}.activeIncidents`),
          resolveIncident: t(`${p}.resolveIncident`),
          recentOutages: t(`${p}.recentOutages`),
          responseTimeTrends: t(`${p}.responseTimeTrends`),
          upcomingMaintenance: t(`${p}.upcomingMaintenance`),
          monitoringSettings: t(`${p}.monitoringSettings`),
          proactiveMonitoring: t(`${p}.proactiveMonitoring`),
          saveSettings: t(`${p}.saveSettings`),
          principles: t(`${p}.principles`),
        }}
      />
    </div>
  );
}
