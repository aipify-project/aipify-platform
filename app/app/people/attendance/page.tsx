import { PeopleOperationsPanel } from "@/components/app/people-operations";
import { buildPeopleOperationsLabels } from "@/lib/people-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PeopleAttendancePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildPeopleOperationsLabels(t);

  return <PeopleOperationsPanel labels={labels} initialTab="attendance" />;
}
