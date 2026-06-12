import { StrategicIntelligenceFoundationEngineDashboardPanel } from "@/components/app/strategic-intelligence-foundation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategicIntelligenceFoundationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.strategicIntelligenceFoundationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <StrategicIntelligenceFoundationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          newInsights: t(`${p}.newInsights`),
          highImpact: t(`${p}.highImpact`),
          completed: t(`${p}.completed`),
          runScan: t(`${p}.runScan`),
          scanning: t(`${p}.scanning`),
          strategicObjectives: t(`${p}.strategicObjectives`),
          insightCategories: t(`${p}.insightCategories`),
          activeInsights: t(`${p}.activeInsights`),
          priorities: t(`${p}.priorities`),
          noItems: t(`${p}.noItems`),
          dismiss: t(`${p}.dismiss`),
          dismissing: t(`${p}.dismissing`),
          companionExamples: t(`${p}.companionExamples`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          trustConnection: t(`${p}.trustConnection`),
          dataSources: t(`${p}.dataSources`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          visionPhrases: t(`${p}.visionPhrases`),
        }}
      />
    </div>
  );
}
