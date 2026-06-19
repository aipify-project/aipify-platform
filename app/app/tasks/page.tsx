import { TaskManagementPanel } from "@/components/app/task-management";
import { buildTaskManagementLabels } from "@/lib/task-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TasksPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildTaskManagementLabels(t);

  return <TaskManagementPanel labels={labels} />;
}
