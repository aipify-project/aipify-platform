import { ValueEngineOpportunitiesPanel } from "@/components/app/value-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ValueEngineOpportunitiesPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "valueEngine");
  const t = createTranslator(dict);
  const p = "customerApp.valueEngine";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.opportunitiesTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.opportunitiesSubtitle`)}</p>
      </div>
      <ValueEngineOpportunitiesPanel
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          noOpportunities: t(`${p}.noOpportunities`),
          evidence: t(`${p}.evidence`),
        }}
      />
    </div>
  );
}
