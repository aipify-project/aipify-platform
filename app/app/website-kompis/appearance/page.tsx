import { DomainLicenseCenterPanel } from "@/components/app/domain-license";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { buildDomainLicenseLabels } from "@/lib/domain-license/labels";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Kompis Web appearance — under Settings; AppHubShell + embedded panel (job 61).
 * Does not modify frozen Website Kompis public runtime.
 */
export default async function WebsiteKompisAppearancePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const labels = buildDomainLicenseLabels(t);

  return (
    <AppHubShell
      breadcrumb={[
        {
          label: t("customerApp.portalStructure.navGroups.kompisWeb"),
          href: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
        },
        {
          label: t("customerApp.portalStructure.nav.kompisWebSettings"),
          href: FOUNDATION_NAV_BINDINGS.kompisWebSettings,
        },
        { label: t("customerApp.portalStructure.nav.kompisWebAppearance") },
      ]}
      eyebrow={t("customerApp.portalStructure.nav.kompisWebSettings")}
      title={t("customerApp.portalStructure.nav.kompisWebAppearance")}
      description={t("customerApp.portalStructure.webHub.appearanceDescription")}
    >
      <DomainLicenseCenterPanel labels={labels} embedded />
    </AppHubShell>
  );
}
