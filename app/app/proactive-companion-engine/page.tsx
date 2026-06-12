import { ProactiveCompanionEngineDashboardPanel } from "@/components/app/proactive-companion-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ProactiveCompanionEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.proactiveCompanionEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ProactiveCompanionEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          commandCenter: t(`${p}.commandCenter`),
          companionPresence: t(`${p}.companionPresence`),
          notificationEngine: t(`${p}.notificationEngine`),
          pendingNudges: t(`${p}.pendingNudges`),
          snoozedNudges: t(`${p}.snoozedNudges`),
          dismissedToday: t(`${p}.dismissedToday`),
          assistanceCategories: t(`${p}.assistanceCategories`),
          activeNudges: t(`${p}.activeNudges`),
          noNudges: t(`${p}.noNudges`),
          dismiss: t(`${p}.dismiss`),
          snooze: t(`${p}.snooze`),
          actionFailed: t(`${p}.actionFailed`),
          companionStyle: t(`${p}.companionStyle`),
          boundaries: t(`${p}.boundaries`),
          preferences: t(`${p}.preferences`),
          frequency: t(`${p}.frequency`),
          frequencyLow: t(`${p}.frequencyLow`),
          frequencyNormal: t(`${p}.frequencyNormal`),
          frequencyHigh: t(`${p}.frequencyHigh`),
          communicationStyle: t(`${p}.communicationStyle`),
          styleSupportive: t(`${p}.styleSupportive`),
          styleBalanced: t(`${p}.styleBalanced`),
          styleMinimal: t(`${p}.styleMinimal`),
          savePreferences: t(`${p}.savePreferences`),
          saving: t(`${p}.saving`),
          preferencesFailed: t(`${p}.preferencesFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportSummary: t(`${p}.exportSummary`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}
