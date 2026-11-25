import { PlatformAnalyticsOverviewPanel } from "@/components/platform/PlatformAnalyticsOverviewPanel";
import { buildPlatformAnalyticsOverviewLabels } from "@/lib/platform-analytics/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformAnalyticsOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return <PlatformAnalyticsOverviewPanel labels={buildPlatformAnalyticsOverviewLabels(t)} locale={locale} />;
}
