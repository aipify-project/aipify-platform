import type { Translator } from "@/lib/i18n/translate";

export type CommunicationManagementLabels = {
  title: string;
  subtitle: string;
  inbox: string;
  announcements: string;
  teamChat: string;
  directMessages: string;
  notifications: string;
  approvals: string;
  activityFeed: string;
  history: string;
  accessDenied: string;
  sendMessage: string;
  subject: string;
  body: string;
  save: string;
  publishAnnouncement: string;
  announcementTitle: string;
  markRead: string;
  archive: string;
  unread: string;
  pendingApprovals: string;
  noMessages: string;
  noMessagesHint: string;
  search: string;
  searchPlaceholder: string;
  notificationsLink: string;
  approvalsLink: string;
  activityLink: string;
  priority: string;
  status: string;
  department: string;
};

export type NotificationManagementLabels = {
  title: string;
  subtitle: string;
  unread: string;
  critical: string;
  attentionRequired: string;
  accessDenied: string;
  communicationsLink: string;
  markRead: string;
  noNotifications: string;
  noNotificationsHint: string;
  priority: string;
};

export type ActivityFeedLabels = {
  title: string;
  subtitle: string;
  accessDenied: string;
  communicationsLink: string;
  recentTasks: string;
  recentDocuments: string;
  noActivity: string;
  noActivityHint: string;
};

export function buildCommunicationManagementLabels(t: Translator): CommunicationManagementLabels {
  const p = "customerApp.communicationManagement";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    inbox: t(`${p}.inbox`),
    announcements: t(`${p}.announcements`),
    teamChat: t(`${p}.teamChat`),
    directMessages: t(`${p}.directMessages`),
    notifications: t(`${p}.notifications`),
    approvals: t(`${p}.approvals`),
    activityFeed: t(`${p}.activityFeed`),
    history: t(`${p}.history`),
    accessDenied: t(`${p}.accessDenied`),
    sendMessage: t(`${p}.sendMessage`),
    subject: t(`${p}.subject`),
    body: t(`${p}.body`),
    save: t(`${p}.save`),
    publishAnnouncement: t(`${p}.publishAnnouncement`),
    announcementTitle: t(`${p}.announcementTitle`),
    markRead: t(`${p}.markRead`),
    archive: t(`${p}.archive`),
    unread: t(`${p}.unread`),
    pendingApprovals: t(`${p}.pendingApprovals`),
    noMessages: t(`${p}.noMessages`),
    noMessagesHint: t(`${p}.noMessagesHint`),
    search: t(`${p}.search`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    notificationsLink: t(`${p}.notificationsLink`),
    approvalsLink: t(`${p}.approvalsLink`),
    activityLink: t(`${p}.activityLink`),
    priority: t(`${p}.priority`),
    status: t(`${p}.status`),
    department: t(`${p}.department`),
  };
}

export function buildNotificationManagementLabels(t: Translator): NotificationManagementLabels {
  const p = "customerApp.notificationManagement";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    unread: t(`${p}.unread`),
    critical: t(`${p}.critical`),
    attentionRequired: t(`${p}.attentionRequired`),
    accessDenied: t(`${p}.accessDenied`),
    communicationsLink: t(`${p}.communicationsLink`),
    markRead: t(`${p}.markRead`),
    noNotifications: t(`${p}.noNotifications`),
    noNotificationsHint: t(`${p}.noNotificationsHint`),
    priority: t(`${p}.priority`),
  };
}

export function buildActivityFeedLabels(t: Translator): ActivityFeedLabels {
  const p = "customerApp.activityFeed";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    accessDenied: t(`${p}.accessDenied`),
    communicationsLink: t(`${p}.communicationsLink`),
    recentTasks: t(`${p}.recentTasks`),
    recentDocuments: t(`${p}.recentDocuments`),
    noActivity: t(`${p}.noActivity`),
    noActivityHint: t(`${p}.noActivityHint`),
  };
}
