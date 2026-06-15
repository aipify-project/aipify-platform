import { CustomerJourneyAnalyticsPanel } from "@/components/platform/customer-journey-analytics";
import { buildCustomerJourneyAnalyticsLabels } from "@/lib/customer-journey-analytics";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomerJourneyAnalyticsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <CustomerJourneyAnalyticsPanel
      backHref="/platform/metrics"
      labels={buildCustomerJourneyAnalyticsLabels(t)}
    />
  );
}
