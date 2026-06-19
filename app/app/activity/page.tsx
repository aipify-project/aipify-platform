import { ActivityOperationsPanel } from "@/components/app/activity-operations";
import { buildActivityOperationsLabels } from "@/lib/activity-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActivityPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildActivityOperationsLabels(t);
  return <ActivityOperationsPanel labels={labels} />;
}
