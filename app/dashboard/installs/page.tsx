import InstallsPanel from "@/components/dashboard/InstallsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InstallsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["install", "branding"]);
  const t = createTranslator(dict);

  return (
    <InstallsPanel
      locale={locale}
      labels={{
        title: t("install.title"),
        subtitle: t("install.subtitle"),
        create: t("install.create"),
        name: t("install.name"),
        siteUrl: t("install.siteUrl"),
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
        company: t("install.company"),
        installationId: t("install.installationId"),
        modules: t("install.modules"),
        integrations: t("install.integrations"),
        lastSynced: t("install.lastSynced"),
        neverSynced: t("install.neverSynced"),
        modulesList: {
          support_ai: t("install.modulesList.support_ai"),
          analytics_ai: t("install.modulesList.analytics_ai"),
          assistant: t("install.modulesList.assistant"),
          commerce_ai: t("install.modulesList.commerce_ai"),
          notifications: t("install.modulesList.notifications"),
          install_ai: t("install.modulesList.install_ai"),
        },
        integrationsList: {
          supabase: t("install.integrationsList.supabase"),
          shopify: t("install.integrationsList.shopify"),
          resend: t("install.integrationsList.resend"),
          wordpress: t("install.integrationsList.wordpress"),
          stripe: t("install.integrationsList.stripe"),
          openai: t("install.integrationsList.openai"),
        },
        integrationStatus: {
          connected: t("install.integrationStatus.connected"),
          pending: t("install.integrationStatus.pending"),
          error: t("install.integrationStatus.error"),
          disconnected: t("install.integrationStatus.disconnected"),
        },
        pulseLabel: t("branding.pulseLabel"),
        connectionSuccess: t("install.connectionSuccess"),
      }}
    />
  );
}
