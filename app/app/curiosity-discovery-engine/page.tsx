import { CuriosityDiscoveryEngineDashboardPanel } from "@/components/app/curiosity-discovery-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CuriosityDiscoveryEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.curiosityDiscoveryEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CuriosityDiscoveryEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          promptCount: t(`${p}.promptCount`),
          pendingPrompts: t(`${p}.pendingPrompts`),
          exploredPrompts: t(`${p}.exploredPrompts`),
          signalCount: t(`${p}.signalCount`),
          discoveryCategories: t(`${p}.discoveryCategories`),
          questionExamples: t(`${p}.questionExamples`),
          recentPrompts: t(`${p}.recentPrompts`),
          recentSignals: t(`${p}.recentSignals`),
          explorePrompt: t(`${p}.explorePrompt`),
          dismissPrompt: t(`${p}.dismissPrompt`),
          updating: t(`${p}.updating`),
          promptUpdateFailed: t(`${p}.promptUpdateFailed`),
          selfLoveNote: t(`${p}.selfLoveNote`),
          trustNote: t(`${p}.trustNote`),
          discoverySettings: t(`${p}.discoverySettings`),
          promptCadence: t(`${p}.promptCadence`),
          cadenceWeekly: t(`${p}.cadenceWeekly`),
          cadenceMonthly: t(`${p}.cadenceMonthly`),
          cadenceQuarterly: t(`${p}.cadenceQuarterly`),
          encourageExperimentationToggle: t(`${p}.encourageExperimentationToggle`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}
