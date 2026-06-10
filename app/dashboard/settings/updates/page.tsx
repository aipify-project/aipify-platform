import { SettingsSubnav } from "@/components/app/settings/SettingsSubnav";
import { CustomerUpdatesPanel } from "@/components/app/update-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DashboardSettingsUpdatesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["settings", "branding"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SettingsSubnav
        active="updates"
        labels={{
          domains: t("settings.domains.title"),
          updates: t("settings.updates.nav"),
          security: t("settings.security.nav"),
        }}
      />
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
