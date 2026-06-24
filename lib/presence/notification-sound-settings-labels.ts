import type { Translator } from "@/lib/i18n/translate";
import type { NotificationSoundStatus, NotificationSoundTestResult } from "@/lib/presence/notification-sound-settings";

const BASE = "customerApp.settings.notificationSound";

export type NotificationSoundSettingsLabels = {
  sectionTitle: string;
  sectionDescription: string;
  browserHint: string;
  soundEnabled: string;
  soundEnabledHint: string;
  playfulMoments: string;
  playfulMomentsHint: string;
  quietHoursEnabled: string;
  quietHoursEnabledHint: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  testSound: string;
  testSoundHint: string;
  save: string;
  saving: string;
  saved: string;
  saveError: string;
  statusTitle: string;
  status: Record<NotificationSoundStatus, string>;
  testResult: Record<NotificationSoundTestResult, string>;
  manageFromDrawer: string;
};

export function buildNotificationSoundSettingsLabels(
  t: Translator,
): NotificationSoundSettingsLabels {
  return {
    sectionTitle: t(`${BASE}.sectionTitle`),
    sectionDescription: t(`${BASE}.sectionDescription`),
    browserHint: t(`${BASE}.browserHint`),
    soundEnabled: t(`${BASE}.soundEnabled`),
    soundEnabledHint: t(`${BASE}.soundEnabledHint`),
    playfulMoments: t(`${BASE}.playfulMoments`),
    playfulMomentsHint: t(`${BASE}.playfulMomentsHint`),
    quietHoursEnabled: t(`${BASE}.quietHoursEnabled`),
    quietHoursEnabledHint: t(`${BASE}.quietHoursEnabledHint`),
    quietHoursStart: t(`${BASE}.quietHoursStart`),
    quietHoursEnd: t(`${BASE}.quietHoursEnd`),
    testSound: t(`${BASE}.testSound`),
    testSoundHint: t(`${BASE}.testSoundHint`),
    save: t(`${BASE}.save`),
    saving: t(`${BASE}.saving`),
    saved: t(`${BASE}.saved`),
    saveError: t(`${BASE}.saveError`),
    statusTitle: t(`${BASE}.statusTitle`),
    status: {
      active: t(`${BASE}.status.active`),
      disabled: t(`${BASE}.status.disabled`),
      quiet_hours: t(`${BASE}.status.quietHours`),
      browser_blocked: t(`${BASE}.status.browserBlocked`),
      needs_interaction: t(`${BASE}.status.needsInteraction`),
    },
    testResult: {
      played: t(`${BASE}.testResult.played`),
      blocked: t(`${BASE}.testResult.blocked`),
      file_error: t(`${BASE}.testResult.fileError`),
      incomplete: t(`${BASE}.testResult.incomplete`),
      disabled: t(`${BASE}.testResult.disabled`),
      quiet_hours: t(`${BASE}.testResult.quietHours`),
    },
    manageFromDrawer: t(`${BASE}.manageFromDrawer`),
  };
}

export function notificationSoundStatusKind(
  status: NotificationSoundStatus,
): "verified" | "not_allowed" | "waiting" | "restricted" | "needs_attention" {
  if (status === "active") return "verified";
  if (status === "needs_interaction") return "needs_attention";
  if (status === "quiet_hours") return "waiting";
  if (status === "disabled") return "not_allowed";
  return "restricted";
}
