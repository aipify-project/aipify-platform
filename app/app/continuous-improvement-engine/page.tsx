import { ContinuousImprovementEngineDashboardPanel } from "@/components/app/continuous-improvement-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ContinuousImprovementEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.continuousImprovementEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ContinuousImprovementEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          initiatives: t(`${p}.initiatives`),
          trends: t(`${p}.trends`),
          recommendations: t(`${p}.recommendations`),
          memoryIntegration: t(`${p}.memoryIntegration`),
          successMeasurements: t(`${p}.successMeasurements`),
          approveInitiative: t(`${p}.approveInitiative`),
          startInitiative: t(`${p}.startInitiative`),
          reviewing: t(`${p}.reviewing`),
          actionFailed: t(`${p}.actionFailed`),
        }} />
    </div>
  );
}
