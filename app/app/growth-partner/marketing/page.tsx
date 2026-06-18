import { GrowthPartnerAutoMarketingPanel } from "@/components/app/growth-partner-attribution";
import { buildGrowthPartnerAttributionMarketingLabels } from "@/lib/growth-partner-attribution/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerMarketingPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["growthPartners"]);
  const t = createTranslator(dict);
  const labels = buildGrowthPartnerAttributionMarketingLabels(t);

  return <GrowthPartnerAutoMarketingPanel labels={labels} />;
}
