import { ChangeManagementEngineDashboardPanel } from "@/components/app/change-management-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ChangeManagementEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.changeManagementEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ChangeManagementEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          initiatives: t(`${p}.initiatives`),
          milestones: t(`${p}.milestones`),
          communications: t(`${p}.communications`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          startInitiative: t(`${p}.startInitiative`),
          updating: t(`${p}.updating`),
          updateFailed: t(`${p}.updateFailed`),
          completeMilestone: t(`${p}.completeMilestone`),
          completing: t(`${p}.completing`),
          milestoneFailed: t(`${p}.milestoneFailed`),
          releaseCommunication: t(`${p}.releaseCommunication`),
          releasing: t(`${p}.releasing`),
          releaseFailed: t(`${p}.releaseFailed`),
        }} />
    </div>
  );
}
