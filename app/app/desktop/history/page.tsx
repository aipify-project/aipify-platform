import { DesktopCompanionPanel } from "@/components/app/desktop";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DesktopHistoryPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);

  return (
    <DesktopCompanionPanel
      mode="history"
      labels={{
        title: t("customerApp.desktop.title"),
        subtitle: t("customerApp.desktop.subtitle"),
        loading: t("customerApp.desktop.loading"),
        empty: t("customerApp.desktop.empty"),
        summary: t("customerApp.desktop.summary"),
        notifications: t("customerApp.desktop.notifications"),
        noNotifications: t("customerApp.desktop.noNotifications"),
        refresh: t("customerApp.desktop.refresh"),
        settings: t("customerApp.desktop.settings"),
        modes: t("customerApp.desktop.modes"),
        history: t("customerApp.desktop.history"),
        reminders: t("customerApp.desktop.reminders"),
        mode: t("customerApp.desktop.mode"),
        unread: t("customerApp.desktop.unread"),
        open: t("customerApp.desktop.open"),
        dismiss: t("customerApp.desktop.dismiss"),
        privacy: t("customerApp.desktop.privacy"),
        back: t("customerApp.desktop.back"),
        historyTitle: t("customerApp.desktop.historyTitle"),
        chat: {
          title: t("customerApp.desktop.chat.title"),
          hint: t("customerApp.desktop.chat.hint"),
          empty: t("customerApp.desktop.chat.empty"),
          placeholder: t("customerApp.desktop.chat.placeholder"),
          send: t("customerApp.desktop.chat.send"),
          openLink: t("customerApp.desktop.chat.openLink"),
          disabled: t("customerApp.desktop.chat.disabled"),
        },
      }}
    />
  );
}
