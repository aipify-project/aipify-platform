import { NotificationOrchestrationPanel } from "@/components/app/notification-orchestration";
import { buildNotificationOrchestrationLabels } from "@/lib/notification-orchestration/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveAlertsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildNotificationOrchestrationLabels(t);

  return <NotificationOrchestrationPanel labels={labels} executiveOnly />;
}
