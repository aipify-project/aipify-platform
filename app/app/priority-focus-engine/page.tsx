import { PriorityFocusEngineDashboardPanel } from "@/components/app/priority-focus-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PriorityFocusEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.priorityFocusEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PriorityFocusEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          tagPersonalFocus: t(`${p}.tagPersonalFocus`),
          goalsOkr: t(`${p}.goalsOkr`),
          proactiveCompanion: t(`${p}.proactiveCompanion`),
          p1: t(`${p}.p1`),
          p2: t(`${p}.p2`),
          p3: t(`${p}.p3`),
          p4: t(`${p}.p4`),
          activeItems: t(`${p}.activeItems`),
          pendingRecommendations: t(`${p}.pendingRecommendations`),
          executiveInsights: t(`${p}.executiveInsights`),
          priorityDimensions: t(`${p}.priorityDimensions`),
          priorityLevels: t(`${p}.priorityLevels`),
          activeItemsList: t(`${p}.activeItemsList`),
          noItems: t(`${p}.noItems`),
          focusRecommendations: t(`${p}.focusRecommendations`),
          noRecommendations: t(`${p}.noRecommendations`),
          resolve: t(`${p}.resolve`),
          dismiss: t(`${p}.dismiss`),
          actionFailed: t(`${p}.actionFailed`),
          focusSupport: t(`${p}.focusSupport`),
          companionExamples: t(`${p}.companionExamples`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportSummary: t(`${p}.exportSummary`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}
