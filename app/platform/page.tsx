import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {t("platform.overview.title")}
      </h1>
      <p className="mt-2 text-base text-gray-500">{t("platform.overview.subtitle")}</p>
      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 text-sm text-blue-900">
        {t("platform.overview.note")}
      </div>
    </div>
  );
}
