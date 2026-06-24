import type { Translator } from "@/lib/i18n/translate";
import type { NotificationSoundSettingsLabels } from "@/lib/presence/notification-sound-settings-labels";
import { buildNotificationSoundSettingsLabels } from "@/lib/presence/notification-sound-settings-labels";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import type { UnifiedNotificationCenterLabels } from "@/lib/presence/unified-notification-feed/labels";
import { buildUnifiedNotificationCenterLabels } from "@/lib/presence/unified-notification-feed/labels";

const SETTINGS = "customerApp.settings.notificationSound";
const INBOX = "customerApp.settings.notificationInbox";
const SETTINGS_PAGE = "customerApp.portalStructure.pages.accountNotifications";
const INBOX_PAGE = "customerApp.portalStructure.pages.notificationInbox";

export type NotificationSettingsPageLabels = {
  title: string;
  subtitle: string;
  back: string;
  settingsSectionTitle: string;
  settingsSectionDescription: string;
  browserHint: string;
  saving: string;
  saved: string;
  saveError: string;
  toggles: {
    inAppEnabled: { title: string; description: string };
    soundEnabled: { title: string; description: string };
    playfulMoments: { title: string; description: string };
    companionReplies: { title: string; description: string };
    approvalsCritical: { title: string; description: string };
    quietHours: { title: string; description: string; activeRange: string };
    testSound: { title: string; description: string };
  };
  quietHoursStart: string;
  quietHoursEnd: string;
  onLabel: string;
  offLabel: string;
  soundLabels: NotificationSoundSettingsLabels;
  manageInboxLink: string;
};

export type NotificationInboxPageLabels = {
  title: string;
  subtitle: string;
  filters: {
    unread: string;
    all: string;
    archived: string;
  };
  emptyTitle: string;
  emptyDescription: string;
  readStatusRead: string;
  readStatusUnread: string;
  readStatusArchived: string;
  markAsRead: string;
  archive: string;
  markAllAsRead: string;
  archiveAllRead: string;
  archiveAllReadConfirm: string;
  openAction: string;
  categoryLabel: string;
  loadMore: string;
  loadingMore: string;
  actionError: string;
  levels: Record<PresenceNotificationLevel, string>;
  eventTypes: UnifiedNotificationCenterLabels["eventTypes"];
  manageSettingsLink: string;
};

export function buildNotificationSettingsPageLabels(t: Translator): NotificationSettingsPageLabels {
  const soundLabels = buildNotificationSoundSettingsLabels(t);

  return {
    title: t(`${SETTINGS_PAGE}.title`),
    subtitle: t(`${SETTINGS_PAGE}.subtitle`),
    back: t("customerApp.settings.accountPreferences.back"),
    settingsSectionTitle: t(`${SETTINGS}.settingsSectionTitle`),
    settingsSectionDescription: t(`${SETTINGS}.settingsSectionDescription`),
    browserHint: t(`${SETTINGS}.browserHint`),
    saving: t(`${SETTINGS}.saving`),
    saved: t(`${SETTINGS}.saved`),
    saveError: t(`${SETTINGS}.saveError`),
    toggles: {
      inAppEnabled: {
        title: t(`${SETTINGS}.inAppEnabled`),
        description: t(`${SETTINGS}.inAppEnabledHint`),
      },
      soundEnabled: {
        title: t(`${SETTINGS}.soundEnabled`),
        description: t(`${SETTINGS}.soundEnabledHint`),
      },
      playfulMoments: {
        title: t(`${SETTINGS}.playfulMoments`),
        description: t(`${SETTINGS}.playfulMomentsHint`),
      },
      companionReplies: {
        title: t(`${SETTINGS}.companionReplies`),
        description: t(`${SETTINGS}.companionRepliesHint`),
      },
      approvalsCritical: {
        title: t(`${SETTINGS}.approvalsCritical`),
        description: t(`${SETTINGS}.approvalsCriticalHint`),
      },
      quietHours: {
        title: t(`${SETTINGS}.quietHoursEnabled`),
        description: t(`${SETTINGS}.quietHoursEnabledHint`),
        activeRange: t(`${SETTINGS}.quietHoursActiveRange`),
      },
      testSound: {
        title: t(`${SETTINGS}.testSound`),
        description: t(`${SETTINGS}.testSoundHint`),
      },
    },
    quietHoursStart: t(`${SETTINGS}.quietHoursStart`),
    quietHoursEnd: t(`${SETTINGS}.quietHoursEnd`),
    onLabel: t(`${SETTINGS}.toggleOn`),
    offLabel: t(`${SETTINGS}.toggleOff`),
    soundLabels,
    manageInboxLink: t(`${SETTINGS_PAGE}.manageInboxLink`),
  };
}

export function buildNotificationInboxPageLabels(t: Translator): NotificationInboxPageLabels {
  const feedLabels = buildUnifiedNotificationCenterLabels(t);

  return {
    title: t(`${INBOX_PAGE}.title`),
    subtitle: t(`${INBOX_PAGE}.subtitle`),
    filters: {
      unread: t(`${INBOX}.filters.unread`),
      all: t(`${INBOX}.filters.all`),
      archived: t(`${INBOX}.filters.archived`),
    },
    emptyTitle: t(`${INBOX}.emptyTitle`),
    emptyDescription: t(`${INBOX}.emptyDescription`),
    readStatusRead: t(`${INBOX}.readStatusRead`),
    readStatusUnread: t(`${INBOX}.readStatusUnread`),
    readStatusArchived: t(`${INBOX}.readStatusArchived`),
    markAsRead: t(`${INBOX}.markAsRead`),
    archive: t(`${INBOX}.archive`),
    markAllAsRead: t(`${INBOX}.markAllAsRead`),
    archiveAllRead: t(`${INBOX}.archiveAllRead`),
    archiveAllReadConfirm: t(`${INBOX}.archiveAllReadConfirm`),
    openAction: t(`${INBOX}.openAction`),
    categoryLabel: t(`${INBOX}.categoryLabel`),
    loadMore: t(`${INBOX}.loadMore`),
    loadingMore: t(`${INBOX}.loadingMore`),
    actionError: t(`${INBOX}.actionError`),
    levels: feedLabels.levels,
    eventTypes: feedLabels.eventTypes,
    manageSettingsLink: t(`${INBOX}.manageSettingsLink`),
  };
}

/** @deprecated Use buildNotificationSettingsPageLabels */
export function buildAccountNotificationsPageLabels(t: Translator) {
  return buildNotificationSettingsPageLabels(t);
}
