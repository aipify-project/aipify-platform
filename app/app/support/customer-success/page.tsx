import { CustomerSuccessPanel } from "@/components/app/app-portal/CustomerSuccessPanel";
import { buildCustomerSuccessLabels } from "@/lib/app-portal/customer-success";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerSuccessPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CustomerSuccessPanel labels={buildCustomerSuccessLabels(t)} />
    </div>
  );
}
