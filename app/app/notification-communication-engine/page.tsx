import { NotificationCommunicationEngineDashboardPanel } from "@/components/app/notification-communication-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function NotificationCommunicationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.notificationCommunicationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <NotificationCommunicationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          notificationEngine: t(`${p}.notificationEngine`),
          operationsDashboard: t(`${p}.operationsDashboard`),
          presence: t(`${p}.presence`),
          adminAssistant: t(`${p}.adminAssistant`),
          secureAiActions: t(`${p}.secureAiActions`),
          generateDigest: t(`${p}.generateDigest`),
          unread: t(`${p}.unread`),
          criticalUnread: t(`${p}.criticalUnread`),
          deliveredWeek: t(`${p}.deliveredWeek`),
          recentDigests: t(`${p}.recentDigests`),
          criticalAlerts: t(`${p}.criticalAlerts`),
          unreadNotifications: t(`${p}.unreadNotifications`),
          noNotifications: t(`${p}.noNotifications`),
          markRead: t(`${p}.markRead`),
          dismiss: t(`${p}.dismiss`),
          openAction: t(`${p}.openAction`),
          preferences: t(`${p}.preferences`),
          frequency: t(`${p}.frequency`),
          immediate: t(`${p}.immediate`),
          dailyDigest: t(`${p}.dailyDigest`),
          weeklyDigest: t(`${p}.weeklyDigest`),
          savePreferences: t(`${p}.savePreferences`),
          recentHistory: t(`${p}.recentHistory`),
          principles: t(`${p}.principles`),
        }}
      />
    </div>
  );
}
