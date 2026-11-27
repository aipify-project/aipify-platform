import Link from "next/link";
import { BillingCommerceSectionPanel } from "@/components/platform/billing";
import { buildBillingCommerceCenterLabels } from "@/lib/platform/billing-commerce-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingBusinessPacksPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildBillingCommerceCenterLabels(t, locale);

  return (
    <BillingCommerceSectionPanel
      section="business_packs"
      title={labels.modules.businessPacks}
      subtitle={labels.moduleDescriptions.businessPacks}
      labels={labels}
    >
      <Link
        href="/platform/product/business-packs"
        className="text-sm font-medium text-sky-800 hover:text-sky-900"
      >
        {labels.economy.seeProductCatalog}
      </Link>
    </BillingCommerceSectionPanel>
  );
}
