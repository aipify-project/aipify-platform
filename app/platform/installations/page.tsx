import PlatformInstallationsPanel from "@/components/platform/PlatformInstallationsPanel";
import { installationStatusLabels, integrationStatusLabels } from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformInstallationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformInstallationsPanel
      locale={locale}
      labels={{
        title: t("platform.installations.title"),
        subtitle: t("platform.installations.subtitle"),
        loading: t("platform.installations.loading"),
        empty: t("platform.installations.empty"),
        customer: t("platform.installations.customer"),
        domain: t("platform.installations.domain"),
        status: t("platform.installations.status"),
        modules: t("platform.installations.modules"),
        lastSynced: t("platform.installations.lastSynced"),
        actions: t("platform.installations.actions"),
        viewCustomer: t("platform.installations.viewCustomer"),
        detailTitle: t("platform.installations.detailTitle"),
        integrations: t("platform.installations.integrations"),
        webhooks: t("platform.installations.webhooks"),
        errorLogs: t("platform.installations.errorLogs"),
        syncHistory: t("platform.installations.syncHistory"),
        noModules: t("platform.installations.noModules"),
        noIntegrations: t("platform.installations.noIntegrations"),
        webhookOperational: t("platform.installations.webhookOperational"),
        noErrors: t("platform.installations.noErrors"),
        lastSyncEntry: t("platform.installations.lastSyncEntry"),
        never: t("platform.installations.never"),
        pulseLabel: t("branding.pulseLabel"),
        statusLabels: installationStatusLabels(t),
        integrationStatusLabels: integrationStatusLabels(t),
      }}
    />
  );
}
