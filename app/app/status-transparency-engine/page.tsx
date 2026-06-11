import { StatusTransparencyEngineDashboardPanel } from "@/components/app/status-transparency-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StatusTransparencyEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.statusTransparencyEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <StatusTransparencyEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          noOrganization: t(`${p}.noOrganization`),
          platformStatus: t(`${p}.platformStatus`),
          observabilityEngine: t(`${p}.observabilityEngine`),
          publicStatus: t(`${p}.publicStatus`),
          openIncidents: t(`${p}.openIncidents`),
          maintenanceActive: t(`${p}.maintenanceActive`),
          monthlyUptime: t(`${p}.monthlyUptime`),
          recentResolutions: t(`${p}.recentResolutions`),
          principles: t(`${p}.principles`),
          activeIncidents: t(`${p}.activeIncidents`),
          noActiveIncidents: t(`${p}.noActiveIncidents`),
          resolveIncident: t(`${p}.resolveIncident`),
          scheduledMaintenance: t(`${p}.scheduledMaintenance`),
          noMaintenance: t(`${p}.noMaintenance`),
          uptimeTrends: t(`${p}.uptimeTrends`),
          noUptimeData: t(`${p}.noUptimeData`),
          statusSettings: t(`${p}.statusSettings`),
          publicStatusPage: t(`${p}.publicStatusPage`),
          tenantNotices: t(`${p}.tenantNotices`),
          saveSettings: t(`${p}.saveSettings`),
        }}
      />
    </div>
  );
}
