import { AccountNotificationsPanel } from "@/components/app/account/AccountNotificationsPanel";
import { buildAccountNotificationsPageLabels } from "@/lib/app/account/account-notifications-labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AccountNotificationsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);

  return (
    <AccountNotificationsPanel labels={buildAccountNotificationsPageLabels(t)} locale={locale} />
  );
}
