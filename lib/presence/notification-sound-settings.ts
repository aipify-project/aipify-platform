import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import { shouldDeliverNotification } from "@/lib/presence/quiet-hours";
import {
  isNotificationChimePrimed,
  isNotificationChimeSupported,
  mapPlaybackResultToTestResult,
  playNotificationChime,
  primeNotificationChime,
} from "@/lib/presence/notification-chime";

export type NotificationSoundStatus =
  | "active"
  | "disabled"
  | "quiet_hours"
  | "browser_blocked"
  | "needs_interaction";

export type NotificationSoundTestResult =
  | "played"
  | "blocked"
  | "file_error"
  | "incomplete"
  | "disabled"
  | "quiet_hours";

function isInAppSoundMuted(prefs: PresenceNotificationPreferences | null): boolean {
  return !prefs?.channel_in_app || prefs.sound_enabled === false;
}

export function resolveNotificationSoundStatus(
  prefs: PresenceNotificationPreferences | null,
  now: Date = new Date(),
): NotificationSoundStatus {
  if (!prefs || isInAppSoundMuted(prefs)) return "disabled";

  if (
    prefs.quiet_hours_enabled &&
    !shouldDeliverNotification("informational", prefs, now)
  ) {
    return "quiet_hours";
  }

  if (!isNotificationChimeSupported()) return "browser_blocked";
  if (!isNotificationChimePrimed()) return "needs_interaction";
  return "active";
}

export function runNotificationSoundTest(
  prefs: PresenceNotificationPreferences | null,
  now: Date = new Date(),
): NotificationSoundTestResult {
  return runNotificationSoundTestSync(prefs, now);
}

function runNotificationSoundTestSync(
  prefs: PresenceNotificationPreferences | null,
  now: Date = new Date(),
): NotificationSoundTestResult {
  if (!prefs || isInAppSoundMuted(prefs)) return "disabled";

  if (
    prefs.quiet_hours_enabled &&
    !shouldDeliverNotification("informational", prefs, now)
  ) {
    return "quiet_hours";
  }

  if (!isNotificationChimeSupported()) return "file_error";

  return "played";
}

export async function runNotificationSoundTestAsync(
  prefs: PresenceNotificationPreferences | null,
  now: Date = new Date(),
): Promise<NotificationSoundTestResult> {
  if (!prefs || isInAppSoundMuted(prefs)) return "disabled";

  if (
    prefs.quiet_hours_enabled &&
    !shouldDeliverNotification("informational", prefs, now)
  ) {
    return "quiet_hours";
  }

  if (!isNotificationChimeSupported()) return "file_error";

  primeNotificationChime();
  const playback = await playNotificationChime();
  return mapPlaybackResultToTestResult(playback);
}
