import { BusinessPackLanguageEngineDashboardPanel } from "@/components/app/business-pack-language-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackLanguageEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.businessPackLanguageEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <BusinessPackLanguageEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          packDefinitions: t(`${p}.packDefinitions`),
          tenantConfigurations: t(`${p}.tenantConfigurations`),
          openGaps: t(`${p}.openGaps`),
          auditEvents: t(`${p}.auditEvents`),
          mandatoryLanguages: t(`${p}.mandatoryLanguages`),
          optionalLanguages: t(`${p}.optionalLanguages`),
          localizationScope: t(`${p}.localizationScope`),
          governance: t(`${p}.governance`),
          catalogTitle: t(`${p}.catalogTitle`),
          viewLanguageCenter: t(`${p}.viewLanguageCenter`),
          forbiddenTitle: t(`${p}.forbiddenTitle`),
        }}
      />
    </div>
  );
}
