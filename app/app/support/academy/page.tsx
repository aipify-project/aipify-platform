import { CustomerAcademyPanel } from "@/components/app/app-portal/CustomerAcademyPanel";
import { buildCustomerAcademyLabels } from "@/lib/app-portal/customer-academy";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerAcademyPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CustomerAcademyPanel labels={buildCustomerAcademyLabels(t)} />
    </div>
  );
}
