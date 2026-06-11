import { MarketplaceCatalogPanel } from "@/components/app/marketplace";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketplaceCatalogPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.marketplace";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.catalogTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.catalogSubtitle`)}</p>
      </div>
      <MarketplaceCatalogPanel
        labels={{
          loading: t(`${p}.loading`),
          allTypes: t(`${p}.allTypes`),
          noItems: t(`${p}.noItems`),
        }}
      />
    </div>
  );
}
