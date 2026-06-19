import { ActivityFeedPanel } from "@/components/app/communication-management";
import { buildActivityFeedLabels } from "@/lib/communication-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActivityPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildActivityFeedLabels(t);
  return <ActivityFeedPanel labels={labels} />;
}
