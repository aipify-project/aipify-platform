import { GrowthPartnerMarketingPanel } from "@/components/growth-partner-marketing";
import { buildGrowthPartnerMarketingLabels } from "@/lib/growth-partner-marketing";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerMarketingPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["growthPartners"]);
  const t = createTranslator(dict);

  return (
    <GrowthPartnerMarketingPanel
      surface="partner"
      backHref="/app/growth-partner-operations"
      labels={buildGrowthPartnerMarketingLabels(t, "customerApp.growthPartnerMarketing")}
    />
  );
}
