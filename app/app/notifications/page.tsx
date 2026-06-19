import { NotificationManagementPanel } from "@/components/app/communication-management";
import { buildNotificationManagementLabels } from "@/lib/communication-management/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function NotificationsCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildNotificationManagementLabels(t);
  return <NotificationManagementPanel labels={labels} />;
}
