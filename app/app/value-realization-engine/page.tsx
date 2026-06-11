import { ValueRealizationEngineDashboardPanel } from "@/components/app/value-realization-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ValueRealizationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.valueRealizationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ValueRealizationEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          metrics: t(`${p}.metrics`),
          milestones: t(`${p}.milestones`),
          suggestions: t(`${p}.suggestions`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          baseline: t(`${p}.baseline`),
          current: t(`${p}.current`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          achieveMilestone: t(`${p}.achieveMilestone`),
          completing: t(`${p}.completing`),
          milestoneFailed: t(`${p}.milestoneFailed`),
        }} />
    </div>
  );
}
