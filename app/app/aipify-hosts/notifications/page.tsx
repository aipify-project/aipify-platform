import { AipifyHostsNotificationCenterDashboardPanel } from "@/components/app/aipify-hosts-notification-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsNotificationsPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.notifications";
  const c = "hosts.common";

  const catKeys = [
    "guest_requests",
    "arrivals",
    "departures",
    "cleaning_updates",
    "maintenance_updates",
    "incidents",
    "approvals",
    "financial_events",
    "team_events",
  ] as const;
  const priorityKeys = ["informational", "important", "high", "critical"] as const;
  const statusKeys = ["unread", "read", "archived"] as const;
  const sectionKeys = [
    "all_notifications",
    "critical_alerts",
    "operational_updates",
    "guest_activity",
    "team_activity",
    "notification_settings",
  ] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    unreadCount: t(`${p}.unreadCount`),
    criticalAlerts: t(`${p}.criticalAlerts`),
    requiresAttention: t(`${p}.requiresAttention`),
    recentActivity: t(`${p}.recentActivity`),
    category: t(`${p}.category`),
    priority: t(`${p}.priority`),
    message: t(`${p}.message`),
    when: t(`${p}.when`),
    actions: t(`${c}.actions`),
    status: t(`${c}.status`),
    markRead: t(`${p}.markRead`),
    archive: t(`${p}.archive`),
    acknowledge: t(`${p}.acknowledge`),
    emptyNotificationsTitle: t(`${p}.emptyNotificationsTitle`),
    emptyNotificationsMessage: t(`${p}.emptyNotificationsMessage`),
    emptyCriticalTitle: t(`${p}.emptyCriticalTitle`),
    emptyCriticalMessage: t(`${p}.emptyCriticalMessage`),
    settingsTitle: t(`${p}.settingsTitle`),
    channelInApp: t(`${p}.channelInApp`),
    channelEmail: t(`${p}.channelEmail`),
    channelPush: t(`${p}.channelPush`),
    quietHours: t(`${p}.quietHours`),
    minPriority: t(`${p}.minPriority`),
    escalateOwner: t(`${p}.escalateOwner`),
    escalatePropertyManager: t(`${p}.escalatePropertyManager`),
    repeatCritical: t(`${p}.repeatCritical`),
    savePreferences: t(`${p}.savePreferences`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of catKeys) labels[`cat_${key}`] = t(`${p}.categories.${key}`);
  for (const key of priorityKeys) labels[`priority_${key}`] = t(`${p}.priorities.${key}`);
  for (const key of statusKeys) labels[`status_${key}`] = t(`${p}.statuses.${key}`);
  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsNotificationCenterDashboardPanel labels={labels} />
    </div>
  );
}
