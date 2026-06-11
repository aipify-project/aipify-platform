import { DesktopRemindersPanel } from "@/components/app/desktop";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DesktopRemindersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">{t("customerApp.desktop.remindersTitle")}</h1>
      <p className="mt-2 text-sm text-gray-600">{t("customerApp.desktop.remindersSubtitle")}</p>
      <div className="mt-6">
        <DesktopRemindersPanel
          locale={locale}
          labels={{
            loading: t("customerApp.desktop.loading"),
            create: t("customerApp.desktop.reminders.create"),
            upcoming: t("customerApp.desktop.reminders.upcoming"),
            empty: t("customerApp.desktop.reminders.empty"),
            add: t("customerApp.desktop.reminders.add"),
            cancel: t("customerApp.desktop.reminders.cancel"),
            titlePlaceholder: t("customerApp.desktop.reminders.titlePlaceholder"),
          }}
        />
      </div>
    </div>
  );
}
