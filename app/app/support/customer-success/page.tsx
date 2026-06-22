import { CustomerSuccessPanel } from "@/components/app/app-portal/CustomerSuccessPanel";
import { buildCustomerSuccessLabels } from "@/lib/app-portal/customer-success";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export const dynamic = "force-dynamic";

export default async function CustomerSuccessPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  return (
    <CustomerSuccessPanel labels={buildCustomerSuccessLabels(t)} locale={locale} />
  );
}
