import { SchedulingOperationsPanel } from "@/components/app/scheduling-operations";
import { buildSchedulingOperationsLabels } from "@/lib/scheduling-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BookingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildSchedulingOperationsLabels(t);

  return <SchedulingOperationsPanel labels={labels} initialTab="bookings" />;
}
