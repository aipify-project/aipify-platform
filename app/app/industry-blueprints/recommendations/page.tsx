import { IndustryBlueprintsRecommendationsPanel } from "@/components/app/industry-blueprints";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IndustryBlueprintsRecommendationsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.industryBlueprints";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.recommendationsTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.recommendationsSubtitle`)}</p>
      </div>
      <IndustryBlueprintsRecommendationsPanel
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          noRecommendations: t(`${p}.noRecommendations`),
          accept: t(`${p}.accept`),
          reject: t(`${p}.reject`),
          dismiss: t(`${p}.dismiss`),
        }}
      />
    </div>
  );
}
