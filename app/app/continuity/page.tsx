import { ContinuityDashboardPanel } from "@/components/app/continuity";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ContinuityPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.continuityEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-rose-700">{t(`${p}.philosophy`)}</p>
      </div>
      <ContinuityDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          readinessScore: t(`${p}.readinessScore`),
          humanLeadership: t(`${p}.humanLeadership`),
          incidentModeActive: t(`${p}.incidentModeActive`),
          incidentModeNote: t(`${p}.incidentModeNote`),
          activateIncidentMode: t(`${p}.activateIncidentMode`),
          deactivateIncidentMode: t(`${p}.deactivateIncidentMode`),
          activating: t(`${p}.activating`),
          generateBriefing: t(`${p}.generateBriefing`),
          criticalProcesses: t(`${p}.criticalProcesses`),
          backupOwners: t(`${p}.backupOwners`),
          incidentsSection: t(`${p}.incidentsSection`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}
