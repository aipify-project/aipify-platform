import { CustomerHealthPanel } from "@/components/app/app-portal/CustomerHealthPanel";
import { buildCustomerHealthLabels } from "@/lib/app-portal/customer-health";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export const dynamic = "force-dynamic";

export default async function CustomerHealthPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);

  return <CustomerHealthPanel labels={buildCustomerHealthLabels(t)} locale={locale} />;
}
