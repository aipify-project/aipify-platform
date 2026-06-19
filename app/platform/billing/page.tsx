import { BillingCommerceOverviewPanel } from "@/components/platform/billing";
import { buildBillingCommerceCenterLabels } from "@/lib/platform/billing-commerce-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return <BillingCommerceOverviewPanel labels={buildBillingCommerceCenterLabels(t)} />;
}
