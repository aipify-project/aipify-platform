import { AccountNotificationsPanel } from "@/components/app/account/AccountNotificationsPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildNotificationSoundSettingsLabels } from "@/lib/presence/notification-sound-settings-labels";

export default async function AccountNotificationsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const page = "customerApp.portalStructure.pages.accountNotifications";
  const account = "customerApp.settings.accountPreferences";

  return (
    <AccountNotificationsPanel
      labels={{
        title: t(`${page}.title`),
        subtitle: t(`${page}.subtitle`),
        back: t(`${account}.back`),
        emptyTitle: t(`${page}.emptyTitle`),
        emptyDescription: t(`${page}.emptyDescription`),
        emptyAction: t(`${page}.emptyAction`),
        emptyActionHref: "/app/command-center",
        secondaryAction: t(`${page}.secondaryAction`),
        secondaryActionHref: "/app/settings",
      }}
      soundLabels={buildNotificationSoundSettingsLabels(t)}
    />
  );
}
