import { ImpactEngineDashboardPanel } from "@/components/app/impact-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ImpactEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "impactEngine");
  const t = createTranslator(dict);
  const p = "customerApp.impactEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ImpactEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          signalCount: t(`${p}.signalCount`),
          publishedReports: t(`${p}.publishedReports`),
          positiveTrends: t(`${p}.positiveTrends`),
          celebrateProgress: t(`${p}.celebrateProgress`),
          yes: t(`${p}.yes`),
          no: t(`${p}.no`),
          impactDimensions: t(`${p}.impactDimensions`),
          reportingExamples: t(`${p}.reportingExamples`),
          recentSignals: t(`${p}.recentSignals`),
          latestReport: t(`${p}.latestReport`),
          reportPeriod: t(`${p}.reportPeriod`),
          limitations: t(`${p}.limitations`),
          celebrationExamples: t(`${p}.celebrationExamples`),
          selfLoveNote: t(`${p}.selfLoveNote`),
          trustNote: t(`${p}.trustNote`),
          impactSettings: t(`${p}.impactSettings`),
          reportingCadence: t(`${p}.reportingCadence`),
          cadenceWeekly: t(`${p}.cadenceWeekly`),
          cadenceMonthly: t(`${p}.cadenceMonthly`),
          cadenceQuarterly: t(`${p}.cadenceQuarterly`),
          celebrateProgressToggle: t(`${p}.celebrateProgressToggle`),
          includeWellbeing: t(`${p}.includeWellbeing`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          generateSummary: t(`${p}.generateSummary`),
          generating: t(`${p}.generating`),
          generateFailed: t(`${p}.generateFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}
