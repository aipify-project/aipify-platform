import InstallsPanel from "@/components/dashboard/InstallsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InstallsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["install"]);
  const t = createTranslator(dict);

  return (
    <InstallsPanel
      labels={{
        title: t("install.title"),
        subtitle: t("install.subtitle"),
        create: t("install.create"),
        systemType: t("install.systemType"),
        systemTypes: {
          wordpress: t("install.systemTypes.wordpress"),
          shopify: t("install.systemTypes.shopify"),
          custom: t("install.systemTypes.custom"),
          other: t("install.systemTypes.other"),
        },
        empty: t("install.empty"),
        tokenTitle: t("install.tokenTitle"),
        tokenHint: t("install.tokenHint"),
        copy: t("install.copy"),
        copied: t("install.copied"),
        status: {
          pending: t("install.status.pending"),
          active: t("install.status.active"),
          paused: t("install.status.paused"),
          revoked: t("install.status.revoked"),
        },
        verifyEndpoint: t("install.verifyEndpoint"),
        error: t("install.error"),
        loading: t("install.loading"),
      }}
    />
  );
}
