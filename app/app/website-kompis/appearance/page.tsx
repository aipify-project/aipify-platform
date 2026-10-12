import { DomainLicenseCenterPanel } from "@/components/app/domain-license";
import { AppContentWidth, AppPageHeader } from "@/components/app/design";
import { buildDomainLicenseLabels } from "@/lib/domain-license/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Kompis Web appearance entry — reuses domain/widget settings (distinct URL from connection).
 * Does not modify frozen Website Kompis public runtime.
 */
export default async function WebsiteKompisAppearancePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const labels = buildDomainLicenseLabels(t);

  return (
    <AppContentWidth>
      <AppPageHeader
        eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
        title={t("customerApp.portalStructure.nav.kompisWebAppearance")}
        description={t("customerApp.portalStructure.webHub.appearanceDescription")}
      />
      <DomainLicenseCenterPanel labels={labels} />
    </AppContentWidth>
  );
}
