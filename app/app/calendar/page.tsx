import { CalendarManagementPanel } from "@/components/app/calendar-management";
import { buildCalendarManagementLabels } from "@/lib/calendar-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CalendarPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildCalendarManagementLabels(t);

  return <CalendarManagementPanel labels={labels} />;
}
