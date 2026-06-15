import { CustomerLifecycleCenterPanel } from "@/components/platform/customer-lifecycle-center";
import { buildCustomerLifecycleCenterLabels } from "@/lib/customer-lifecycle-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomerLifecycleCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <CustomerLifecycleCenterPanel
      backHref="/platform/customers"
      labels={buildCustomerLifecycleCenterLabels(t)}
    />
  );
}
