import type { Translator } from "@/lib/i18n/translate";

export function buildNotificationOrchestrationLabels(t: Translator) {
  const p = "customerApp.notificationOrchestration";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    philosophy: t(`${p}.philosophy`),
    accessDenied: t(`${p}.accessDenied`),
    overview: t(`${p}.overview`),
    inbox: t(`${p}.inbox`),
    unread: t(`${p}.unread`),
    priority: t(`${p}.priority`),
    approvals: t(`${p}.approvals`),
    tasks: t(`${p}.tasks`),
    systemAlerts: t(`${p}.systemAlerts`),
    settings: t(`${p}.settings`),
    history: t(`${p}.history`),
    executiveAlerts: t(`${p}.executiveAlerts`),
    unreadCount: t(`${p}.unreadCount`),
    criticalCount: t(`${p}.criticalCount`),
    attentionRequired: t(`${p}.attentionRequired`),
    pendingApprovals: t(`${p}.pendingApprovals`),
    taskNotifications: t(`${p}.taskNotifications`),
    securityAlerts: t(`${p}.securityAlerts`),
    markRead: t(`${p}.markRead`),
    noNotifications: t(`${p}.noNotifications`),
    emptyHint: t(`${p}.emptyHint`),
    notificationVolume: t(`${p}.notificationVolume`),
    readRate: t(`${p}.readRate`),
    digestsGenerated: t(`${p}.digestsGenerated`),
    auditLog: t(`${p}.auditLog`),
    status: t(`${p}.status`),
    mobileReady: t(`${p}.mobileReady`),
    frequency: t(`${p}.frequency`),
    channels: t(`${p}.channels`),
    savePreferences: t(`${p}.savePreferences`),
    generateDigest: t(`${p}.generateDigest`),
    acknowledgeAlert: t(`${p}.acknowledgeAlert`),
    resolveAlert: t(`${p}.resolveAlert`),
    openApprovals: t(`${p}.openApprovals`),
    openCommunications: t(`${p}.openCommunications`),
  };
}

export type NotificationOrchestrationLabels = ReturnType<typeof buildNotificationOrchestrationLabels>;
