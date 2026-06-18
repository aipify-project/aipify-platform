import { IndustryBlueprintsSettingsPanel } from "@/components/app/industry-blueprints";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IndustryBlueprintsSettingsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "industryBlueprints");
  const t = createTranslator(dict);
  const p = "customerApp.industryBlueprints";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.settingsTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.settingsSubtitle`)}</p>
      </div>
      <IndustryBlueprintsSettingsPanel
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          currentBlueprint: t(`${p}.currentBlueprint`),
          noBlueprintSelected: t(`${p}.noBlueprintSelected`),
          businessSize: t(`${p}.businessSize`),
          selectSize: t(`${p}.selectSize`),
          primaryGoals: t(`${p}.primaryGoals`),
          autoRecommendPacks: t(`${p}.autoRecommendPacks`),
          notifyNewPacks: t(`${p}.notifyNewPacks`),
        }}
      />
    </div>
  );
}
