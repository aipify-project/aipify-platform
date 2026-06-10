import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DashboardPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {t("dashboard.controlCenter.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-gray-500 sm:text-lg">
          {t("dashboard.controlCenter.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/installs"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            {t("dashboard.controlCenter.cards.installs.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {t("dashboard.controlCenter.cards.installs.description")}
          </p>
        </Link>

        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("dashboard.controlCenter.cards.billing.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {t("dashboard.controlCenter.cards.billing.description")}
          </p>
        </div>

        <Link
          href="/dashboard/team"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            {t("dashboard.controlCenter.cards.team.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {t("dashboard.controlCenter.cards.team.description")}
          </p>
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
        <p className="text-sm font-medium text-blue-900">
          {t("dashboard.controlCenter.installFirstNote")}
        </p>
      </div>
    </div>
  );
}
