import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import { shouldDeliverNotification } from "@/lib/presence/quiet-hours";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import { meetsMinimumLevel } from "@/lib/presence/notifications";
import {
  isNotificationChimePrimed,
  isNotificationChimeSupported,
  playNotificationChime,
  primeNotificationChime,
} from "@/lib/presence/notification-chime";

export function getNotificationAudioContextState(): {
  supported: boolean;
  primed: boolean;
  state: "idle" | "unsupported";
  activeContextInstances: number;
} {
  return {
    supported: isNotificationChimeSupported(),
    primed: isNotificationChimePrimed(),
    state: isNotificationChimeSupported() ? "idle" : "unsupported",
    activeContextInstances: 0,
  };
}

/** Records a user gesture for notification chime playback. */
export function primeSoftBellAudio(): void {
  primeNotificationChime();
}

function passesQuietHours(
  prefs: PresenceNotificationPreferences,
  level: PresenceNotificationLevel,
  now: Date,
): boolean {
  if (!prefs.quiet_hours_enabled) return true;
  return shouldDeliverNotification(level, prefs, now);
}

export function shouldPlayInAppNotificationSound(
  notification: PresenceNotification,
  prefs: PresenceNotificationPreferences | null,
  now: Date = new Date(),
): boolean {
  if (!prefs?.channel_in_app) return false;
  if (!prefs.sound_enabled) return false;
  if (
    notification.event_type === "playful_bell_moment" &&
    !prefs.playful_moments_enabled
  ) {
    return false;
  }
  if (
    notification.event_type === "companion_reply_ready" &&
    !prefs.companion_replies_enabled
  ) {
    return false;
  }
  if (
    notification.event_type === "approval_awaiting_action" &&
    !prefs.approvals_critical_enabled
  ) {
    return false;
  }
  if (notification.level === "critical" && !prefs.approvals_critical_enabled) {
    return false;
  }
  if (!meetsMinimumLevel(notification.level, prefs.min_level_in_app)) return false;
  return passesQuietHours(prefs, notification.level, now);
}

export function playSoftBellChime(): void {
  void playNotificationChime();
}

export async function playSoftBellChimeAsync(): Promise<boolean> {
  const result = await playNotificationChime();
  return result.status === "completed";
}

export function playSoftBellChimeWithResult(): boolean {
  void playNotificationChime();
  return false;
}

export { playNotificationChime, primeNotificationChime };
