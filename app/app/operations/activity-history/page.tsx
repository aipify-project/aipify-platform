import { ActivityHistoryPanel } from "@/components/app/app-portal/ActivityHistoryPanel";
import { buildActivityHistoryLabels } from "@/lib/app-portal/activity-history";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActivityHistoryPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ActivityHistoryPanel labels={buildActivityHistoryLabels(t)} />
    </div>
  );
}
