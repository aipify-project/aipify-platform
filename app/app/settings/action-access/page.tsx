import { UniversalActionAccessPanel } from "@/components/app/settings/UniversalActionAccessPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionAccessSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard", "navigation"]);
  const t = createTranslator(dict);

  return (
    <UniversalActionAccessPanel
      labels={{
        title: t("customerApp.universalActionAccess.title"),
        subtitle: t("customerApp.universalActionAccess.subtitle"),
        loading: t("customerApp.universalActionAccess.loading"),
        corePrinciple: t("customerApp.universalActionAccess.corePrinciple"),
        integrationsTitle: t("customerApp.universalActionAccess.integrationsTitle"),
        noIntegrations: t("customerApp.universalActionAccess.noIntegrations"),
        auditTitle: t("customerApp.universalActionAccess.auditTitle"),
        noAudit: t("customerApp.universalActionAccess.noAudit"),
        settingsTitle: t("customerApp.universalActionAccess.settingsTitle"),
        enabled: t("customerApp.universalActionAccess.enabled"),
        businessHoursOnly: t("customerApp.universalActionAccess.businessHoursOnly"),
        emergencyHonored: t("customerApp.universalActionAccess.emergencyHonored"),
        saveSettings: t("customerApp.universalActionAccess.saveSettings"),
        saved: t("customerApp.universalActionAccess.saved"),
        approvalLevels: {
          automatic: t("customerApp.universalActionAccess.approvalLevels.automatic"),
          user_confirmation: t("customerApp.universalActionAccess.approvalLevels.user_confirmation"),
          multi_step_approval: t("customerApp.universalActionAccess.approvalLevels.multi_step_approval"),
        },
        categories: {
          personal: t("customerApp.universalActionAccess.categories.personal"),
          business: t("customerApp.universalActionAccess.categories.business"),
          commerce: t("customerApp.universalActionAccess.categories.commerce"),
          workforce: t("customerApp.universalActionAccess.categories.workforce"),
          device: t("customerApp.universalActionAccess.categories.device"),
          future: t("customerApp.universalActionAccess.categories.future"),
        },
        links: {
          approvals: t("customerApp.universalActionAccess.links.approvals"),
          actionCenter: t("customerApp.universalActionAccess.links.actionCenter"),
          printers: t("customerApp.universalActionAccess.links.printers"),
        },
        settings: t("customerApp.nav.settings"),
      }}
    />
  );
}
