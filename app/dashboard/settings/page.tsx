import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard", "settings"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {t("settings.title")}
      </h1>
      <p className="mt-2 text-base text-gray-500">{t("settings.subtitle")}</p>
      <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-sm text-gray-600">
        {t("settings.comingSoon")}
      </div>
    </div>
  );
}
