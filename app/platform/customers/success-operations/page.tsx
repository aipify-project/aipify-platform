import { CustomerSuccessOperationsPanel } from "@/components/platform/customer-success-operations";
import { buildCustomerSuccessOperationsLabels } from "@/lib/customer-success-operations";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomerSuccessOperationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <CustomerSuccessOperationsPanel
      backHref="/platform/customers"
      labels={buildCustomerSuccessOperationsLabels(t)}
    />
  );
}
