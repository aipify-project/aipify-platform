import { IndustryBlueprintsAppliedPanel } from "@/components/app/industry-blueprints";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IndustryBlueprintsAppliedPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "industryBlueprints");
  const t = createTranslator(dict);
  const p = "customerApp.industryBlueprints";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.appliedTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.appliedSubtitle`)}</p>
      </div>
      <IndustryBlueprintsAppliedPanel
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          noApplied: t(`${p}.noApplied`),
          unknownBlueprint: t(`${p}.unknownBlueprint`),
        }}
      />
    </div>
  );
}
