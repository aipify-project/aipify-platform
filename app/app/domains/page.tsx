import CustomerDomainsSettingsPanel from "@/components/dashboard/CustomerDomainsSettingsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DomainsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["settings", "branding", "customerApp"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {t("customerApp.nav.domains")}
        </h1>
        <p className="mt-2 text-gray-600">{t("settings.domains.subtitle")}</p>
      </div>
      <CustomerDomainsSettingsPanel
        locale={locale}
        labels={{
          title: t("settings.domains.title"),
          subtitle: t("settings.domains.subtitle"),
          loading: t("settings.domains.loading"),
          pulseLabel: t("branding.pulseLabel"),
          plan: t("settings.domains.plan"),
          domains: t("settings.domains.domains"),
          installations: t("settings.domains.installations"),
          unlimited: t("settings.domains.unlimited"),
          domainColumn: t("settings.domains.domainColumn"),
          statusColumn: t("settings.domains.statusColumn"),
          verificationColumn: t("settings.domains.verificationColumn"),
          addedColumn: t("settings.domains.addedColumn"),
          addDomain: t("settings.domains.addDomain"),
          domainPlaceholder: t("settings.domains.domainPlaceholder"),
          submit: t("settings.domains.submit"),
          empty: t("settings.domains.empty"),
          limitReached: t("settings.domains.limitReached"),
          upgrade: t("settings.domains.upgrade"),
          verificationPlaceholder: t("settings.domains.verificationPlaceholder"),
          statusLabels: {
            active: t("settings.domains.statusLabels.active"),
            pending: t("settings.domains.statusLabels.pending"),
            disabled: t("settings.domains.statusLabels.disabled"),
            removed: t("settings.domains.statusLabels.removed"),
          },
          verificationLabels: {
            unverified: t("settings.domains.verificationLabels.unverified"),
            pending: t("settings.domains.verificationLabels.pending"),
            verified: t("settings.domains.verificationLabels.verified"),
            failed: t("settings.domains.verificationLabels.failed"),
          },
        }}
      />
    </div>
  );
}
