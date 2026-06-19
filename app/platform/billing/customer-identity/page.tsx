import { BillingCommerceSectionPanel } from "@/components/platform/billing";
import { buildBillingCommerceCenterLabels } from "@/lib/platform/billing-commerce-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingCustomerIdentityPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildBillingCommerceCenterLabels(t);

  return (
    <BillingCommerceSectionPanel
      section="customer_identity"
      title={labels.modules.customerIdentity}
      subtitle={labels.moduleDescriptions.customerIdentity}
      labels={labels}
    />
  );
}
