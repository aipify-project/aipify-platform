import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TeamPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {t("dashboard.team.title")}
      </h1>
      <p className="mt-2 text-base text-gray-500">{t("dashboard.team.subtitle")}</p>
      <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-sm text-gray-600">
        {t("dashboard.team.comingSoon")}
      </div>
    </div>
  );
}
