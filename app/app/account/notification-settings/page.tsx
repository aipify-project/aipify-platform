import { NotificationSettingsPanel } from "@/components/app/account/NotificationSettingsPanel";
import { buildNotificationSettingsPageLabels } from "@/lib/app/notifications/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function NotificationSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);

  return <NotificationSettingsPanel labels={buildNotificationSettingsPageLabels(t)} />;
}
