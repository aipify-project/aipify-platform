import { UnifiedBillingAdminSectionPanel } from "@/components/platform/unified-billing/UnifiedBillingAdminSectionPanel";
import { buildBillingCommerceCenterLabels } from "@/lib/platform/billing-commerce-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingLicensesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildBillingCommerceCenterLabels(t);
  return (
    <UnifiedBillingAdminSectionPanel
      section="licenses"
      title={t("platform.unifiedBillingAdmin.licenses.title")}
      subtitle={t("platform.unifiedBillingAdmin.licenses.subtitle")}
      labels={labels}
    />
  );
}
