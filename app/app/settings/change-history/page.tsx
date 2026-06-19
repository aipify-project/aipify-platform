import { SettingsSubnav } from "@/components/app/settings/SettingsSubnav";
import { ChangeHistoryPanel } from "@/components/app/change-history";
import { buildChangeHistoryLabels } from "@/lib/change-operations-engine/labels";
import { getCustomerAppPageDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppSettingsChangeHistoryPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppPageDictionary(locale, { splits: ["settings"], namespaces: ["settings"] });
  const t = createTranslator(dict);
  const labels = buildChangeHistoryLabels(t);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <SettingsSubnav
        active="updates"
        labels={{
          domains: t("settings.domains.title"),
          updates: t("settings.updates.nav"),
          security: t("settings.security.nav"),
        }}
      />
      <ChangeHistoryPanel labels={labels} />
    </div>
  );
}
