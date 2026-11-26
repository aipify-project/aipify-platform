import { PlatformAnalyticsJourneyPanel } from "@/components/platform/PlatformAnalyticsJourneyPanel";
import { buildPlatformAnalyticsJourneyLabels } from "@/lib/platform-analytics/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomerJourneyAnalyticsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformAnalyticsJourneyPanel
      backHref="/platform/analytics"
      labels={buildPlatformAnalyticsJourneyLabels(t)}
      locale={locale}
    />
  );
}
