import { ModuleMarketplaceFoundationEngineDashboardPanel } from "@/components/app/module-marketplace-foundation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ModuleMarketplaceFoundationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.moduleMarketplaceFoundationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ModuleMarketplaceFoundationEngineDashboardPanel labels={{ loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
          catalog_count: t(`${p}.catalog_count`),
          active_modules: t(`${p}.active_modules`),
          beta_modules: t(`${p}.beta_modules`),
          future_modules: t(`${p}.future_modules`),
          catalog: t(`${p}.catalog`),
          modulesSettings: t(`${p}.modulesSettings`),
          subscription: t(`${p}.subscription`) }} />
    </div>
  );
}
