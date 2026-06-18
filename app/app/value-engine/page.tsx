import { ValueEngineDashboardPanel } from "@/components/app/value-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LegacyValueEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "valueEngine");
  const t = createTranslator(dict);
  const p = "customerApp.valueEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ValueEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          reports: t(`${p}.reports`),
          opportunities: t(`${p}.opportunities`),
          settings: t(`${p}.settings`),
          impactScore: t(`${p}.impactScore`),
          comparedToLast: t(`${p}.comparedToLast`),
          hoursSaved: t(`${p}.hoursSaved30d`),
          estimatedValue: t(`${p}.estimatedValue30d`),
          roiDisabled: t(`${p}.roiDisabled`),
          categoryScores: t(`${p}.categoryScores`),
          timeline: t(`${p}.timeline`),
          hours: t(`${p}.hours`),
          events: t(`${p}.events`),
          marketplaceImpact: t(`${p}.marketplaceImpact`),
          blueprintImpact: t(`${p}.blueprintImpact`),
          componentsApplied: t(`${p}.componentsApplied`),
          disclaimer: t(`${p}.disclaimer`),
        }}
      />
    </div>
  );
}
