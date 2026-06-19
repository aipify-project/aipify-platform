import Link from "next/link";
import { BillingCommerceSectionPanel } from "@/components/platform/billing";
import { buildBillingCommerceCenterLabels } from "@/lib/platform/billing-commerce-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingGrowthPartnerAttributionPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildBillingCommerceCenterLabels(t);

  return (
    <BillingCommerceSectionPanel
      section="growth_partner_attribution"
      title={labels.modules.growthPartnerAttribution}
      subtitle={labels.moduleDescriptions.growthPartnerAttribution}
      labels={labels}
    >
      <Link
        href="/platform/pilot-operations"
        className="inline-flex rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
        {labels.openModule} — {t("platform.nav.growthPartners")}
      </Link>
    </BillingCommerceSectionPanel>
  );
}
