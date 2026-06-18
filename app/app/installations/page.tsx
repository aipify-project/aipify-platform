import { InstallationsCenterPanel } from "@/components/app/installations/InstallationsCenterPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InstallationsPage() {
  const locale = await getLocale();
  const dict = {
    ...(await getCustomerAppDictionaryForSplits(locale, ["dashboard"])),
    ...(await getDictionary(locale, ["branding"])),
  };
  const t = createTranslator(dict);

  return (
    <InstallationsCenterPanel
      locale={locale}
      labels={{
        title: t("customerApp.installations.title"),
        subtitle: t("customerApp.installations.subtitle"),
        loading: t("customerApp.installations.loading"),
        empty: t("customerApp.installations.empty"),
        pulseLabel: t("branding.pulseLabel"),
        addInstall: t("customerApp.installations.addInstall"),
        viewDetails: t("customerApp.installations.viewDetails"),
        healthCheck: t("customerApp.installations.healthCheck"),
        columns: {
          platform: t("customerApp.installations.columns.platform"),
          health: t("customerApp.installations.columns.health"),
          heartbeat: t("customerApp.installations.columns.heartbeat"),
          version: t("customerApp.installations.columns.version"),
        },
      }}
    />
  );
}
