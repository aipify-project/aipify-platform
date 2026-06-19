import { ExecutiveInsightsPanel } from "@/components/app/analytics-management";
import { buildAnalyticsManagementLabels } from "@/lib/analytics-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InsightsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildAnalyticsManagementLabels(t);
  return <ExecutiveInsightsPanel labels={labels} />;
}
