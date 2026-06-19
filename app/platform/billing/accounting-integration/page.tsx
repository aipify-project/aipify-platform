import Link from "next/link";
import { BillingCommerceSectionPanel } from "@/components/platform/billing";
import { buildBillingCommerceCenterLabels } from "@/lib/platform/billing-commerce-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingAccountingIntegrationPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildBillingCommerceCenterLabels(t);

  return (
    <BillingCommerceSectionPanel
      section="accounting_integration"
      title={labels.modules.accountingIntegration}
      subtitle={labels.moduleDescriptions.accountingIntegration}
      labels={labels}
    >
      <Link
        href="/platform/trust/commercial"
        className="inline-flex rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
        {labels.openModule} — {t("platform.trustCenter.domains.commercial.title")}
      </Link>
    </BillingCommerceSectionPanel>
  );
}
