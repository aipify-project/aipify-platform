import { IndustryBlueprintsDashboardPanel } from "@/components/app/industry-blueprints";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IndustryBlueprintsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "industryBlueprints");
  const t = createTranslator(dict);
  const p = "customerApp.industryBlueprints";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <IndustryBlueprintsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          catalog: t(`${p}.catalog`),
          recommendations: t(`${p}.recommendations`),
          applied: t(`${p}.applied`),
          settings: t(`${p}.settings`),
          setupCompleteness: t(`${p}.setupCompleteness`),
          itemsApplied: t(`${p}.itemsApplied`),
          pending: t(`${p}.pending`),
          selectBlueprint: t(`${p}.selectBlueprintPrompt`),
          nextRecommendations: t(`${p}.nextRecommendations`),
          viewAll: t(`${p}.viewAll`),
          principle: t(`${p}.principle`),
        }}
      />
    </div>
  );
}
