import type { Translator } from "@/lib/i18n/translate";
import type { NotificationSoundSettingsLabels } from "@/lib/presence/notification-sound-settings-labels";
import { buildNotificationSoundSettingsLabels } from "@/lib/presence/notification-sound-settings-labels";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import type { UnifiedNotificationCenterLabels } from "@/lib/presence/unified-notification-feed/labels";
import { buildUnifiedNotificationCenterLabels } from "@/lib/presence/unified-notification-feed/labels";

const SETTINGS = "customerApp.settings.notificationSound";
const RECENT = "customerApp.settings.accountNotifications";
const PAGE = "customerApp.portalStructure.pages.accountNotifications";

export type AccountNotificationsPageLabels = {
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
  recent: {
    sectionTitle: string;
    sectionDescription: string;
    emptyTitle: string;
    emptyDescription: string;
    readStatusRead: string;
    readStatusUnread: string;
    markAsRead: string;
    archive: string;
    markAllAsRead: string;
    openAction: string;
    categoryLabel: string;
    levels: Record<PresenceNotificationLevel, string>;
    eventTypes: UnifiedNotificationCenterLabels["eventTypes"];
  };
  feedLabels: UnifiedNotificationCenterLabels;
};

export function buildAccountNotificationsPageLabels(t: Translator): AccountNotificationsPageLabels {
  const soundLabels = buildNotificationSoundSettingsLabels(t);
  const feedLabels = buildUnifiedNotificationCenterLabels(t);

  return {
    title: t(`${PAGE}.title`),
    subtitle: t(`${PAGE}.subtitle`),
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
    recent: {
      sectionTitle: t(`${RECENT}.sectionTitle`),
      sectionDescription: t(`${RECENT}.sectionDescription`),
      emptyTitle: t(`${RECENT}.emptyTitle`),
      emptyDescription: t(`${RECENT}.emptyDescription`),
      readStatusRead: t(`${RECENT}.readStatusRead`),
      readStatusUnread: t(`${RECENT}.readStatusUnread`),
      markAsRead: t(`${RECENT}.markAsRead`),
      archive: t(`${RECENT}.archive`),
      markAllAsRead: t(`${RECENT}.markAllAsRead`),
      openAction: t(`${RECENT}.openAction`),
      categoryLabel: t(`${RECENT}.categoryLabel`),
      levels: feedLabels.levels,
      eventTypes: feedLabels.eventTypes,
    },
    feedLabels,
  };
}
