import Link from "next/link";
import { CustomerUpdatesPanel } from "@/components/app/update-engine";
import { resolveAppHref } from "@/lib/app/route-aliases";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DashboardSettingsUpdatesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["settings", "branding"]);
  const t = createTranslator(dict);
  const settingsHref = resolveAppHref("/app/settings");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav className="flex gap-4 border-b border-gray-200 px-1 text-sm">
        <Link href={settingsHref} className="py-3 text-gray-500 hover:text-gray-700">
          {t("settings.domains.title")}
        </Link>
        <span className="border-b-2 border-indigo-600 py-3 font-medium text-indigo-600">
          {t("settings.updates.nav")}
        </span>
      </nav>
      <CustomerUpdatesPanel
        locale={locale}
        labels={{
          title: t("settings.updates.title"),
          subtitle: t("settings.updates.subtitle"),
          loading: t("settings.updates.loading"),
          empty: t("settings.updates.empty"),
          currentVersion: t("settings.updates.currentVersion"),
          nextUpdate: t("settings.updates.nextUpdate"),
          noNextUpdate: t("settings.updates.noNextUpdate"),
          maintenanceWindow: t("settings.updates.maintenanceWindow"),
          history: t("settings.updates.history"),
          noHistory: t("settings.updates.noHistory"),
          status: t("settings.updates.status"),
          reassurance: t("settings.updates.reassurance"),
          readOnly: t("settings.updates.readOnly"),
          pulseLabel: t("branding.pulseLabel"),
        }}
      />
    </div>
  );
}
