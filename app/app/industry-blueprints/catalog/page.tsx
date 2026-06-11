import { IndustryBlueprintsCatalogPanel } from "@/components/app/industry-blueprints";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IndustryBlueprintsCatalogPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.industryBlueprints";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.catalogTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.catalogSubtitle`)}</p>
      </div>
      <IndustryBlueprintsCatalogPanel
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          noBlueprints: t(`${p}.noBlueprints`),
        }}
      />
    </div>
  );
}
