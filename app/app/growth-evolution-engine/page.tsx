import { GrowthEvolutionEngineDashboardPanel } from "@/components/app/growth-evolution-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthEvolutionEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.growthEvolutionEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GrowthEvolutionEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          proactiveCompanion: t(`${p}.proactiveCompanion`),
          continuousImprovement: t(`${p}.continuousImprovement`),
          learning: t(`${p}.learning`),
          pendingRecommendations: t(`${p}.pendingRecommendations`),
          acceptedRecommendations: t(`${p}.acceptedRecommendations`),
          recentSignals: t(`${p}.recentSignals`),
          learningCycle: t(`${p}.learningCycle`),
          growthDimensions: t(`${p}.growthDimensions`),
          evolutionCapabilities: t(`${p}.evolutionCapabilities`),
          recentSignalsTitle: t(`${p}.recentSignalsTitle`),
          noSignals: t(`${p}.noSignals`),
          pendingRecommendationsTitle: t(`${p}.pendingRecommendationsTitle`),
          noRecommendations: t(`${p}.noRecommendations`),
          evidence: t(`${p}.evidence`),
          tradeOffs: t(`${p}.tradeOffs`),
          confidence: t(`${p}.confidence`),
          accept: t(`${p}.accept`),
          defer: t(`${p}.defer`),
          dismiss: t(`${p}.dismiss`),
          actionFailed: t(`${p}.actionFailed`),
          settings: t(`${p}.settings`),
          learningCycleCadence: t(`${p}.learningCycleCadence`),
          cadenceWeekly: t(`${p}.cadenceWeekly`),
          cadenceBiweekly: t(`${p}.cadenceBiweekly`),
          cadenceMonthly: t(`${p}.cadenceMonthly`),
          cadenceQuarterly: t(`${p}.cadenceQuarterly`),
          celebrateProgress: t(`${p}.celebrateProgress`),
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
