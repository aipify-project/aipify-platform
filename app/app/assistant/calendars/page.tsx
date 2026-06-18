import { CalendarDashboardPanel } from "@/components/app/assistant";
import { CALENDAR_PROVIDERS, CALENDAR_PURPOSES } from "@/lib/context-engine";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantCalendarsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);

  const mapKeys = <K extends string>(keys: readonly K[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`customerApp.universalCalendar.${prefix}.${k}`)])) as Record<
      K,
      string
    >;

  return (
    <CalendarDashboardPanel
      locale={locale}
      labels={{
        title: t("customerApp.universalCalendar.title"),
        subtitle: t("customerApp.universalCalendar.subtitle"),
        loading: t("customerApp.universalCalendar.loading"),
        back: t("customerApp.universalCalendar.back"),
        privacy: t("customerApp.universalCalendar.privacy"),
        connect: t("customerApp.universalCalendar.connect"),
        disconnect: t("customerApp.universalCalendar.disconnect"),
        connecting: t("customerApp.universalCalendar.connecting"),
        viewContext: t("customerApp.universalCalendar.viewContext"),
        sections: {
          connections: t("customerApp.universalCalendar.sections.connections"),
          providers: t("customerApp.universalCalendar.sections.providers"),
          activity: t("customerApp.universalCalendar.sections.activity"),
          syncHistory: t("customerApp.universalCalendar.sections.syncHistory"),
          permissions: t("customerApp.universalCalendar.sections.permissions"),
        },
        providers: mapKeys(CALENDAR_PROVIDERS, "providers"),
        purposes: mapKeys(CALENDAR_PURPOSES, "purposes"),
        statuses: {
          connected: t("customerApp.universalCalendar.statuses.connected"),
          pending: t("customerApp.universalCalendar.statuses.pending"),
          disconnected: t("customerApp.universalCalendar.statuses.disconnected"),
          error: t("customerApp.universalCalendar.statuses.error"),
        },
        empty: t("customerApp.universalCalendar.empty"),
        internalNote: t("customerApp.universalCalendar.internalNote"),
      }}
    />
  );
}
