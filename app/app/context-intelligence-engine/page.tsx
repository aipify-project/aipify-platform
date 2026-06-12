import { ContextIntelligenceEngineDashboardPanel } from "@/components/app/context-intelligence-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ContextIntelligenceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.contextIntelligenceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ContextIntelligenceEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          openGaps: t(`${p}.openGaps`),
          dimensionsMonitored: t(`${p}.dimensionsMonitored`),
          proactiveLevel: t(`${p}.proactiveLevel`),
          gapDetection: t(`${p}.gapDetection`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          contextDimensions: t(`${p}.contextDimensions`),
          contextGaps: t(`${p}.contextGaps`),
          resolveGap: t(`${p}.resolveGap`),
          exportSummary: t(`${p}.exportSummary`),
          exporting: t(`${p}.exporting`),
          noItems: t(`${p}.noItems`),
          noGaps: t(`${p}.noGaps`),
          noSignals: t(`${p}.noSignals`),
          principles: t(`${p}.principles`),
        }}
      />
    </div>
  );
}
