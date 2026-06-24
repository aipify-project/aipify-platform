import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import { shouldDeliverNotification } from "@/lib/presence/quiet-hours";
import {
  getNotificationAudioContextState,
  playSoftBellChimeAsync,
  playSoftBellChimeWithResult,
  primeSoftBellAudio,
} from "@/lib/presence/unified-notification-feed/sound-policy";

export type NotificationSoundStatus =
  | "active"
  | "disabled"
  | "quiet_hours"
  | "browser_blocked"
  | "needs_interaction";

export type NotificationSoundTestResult =
  | "played"
  | "blocked"
  | "disabled"
  | "quiet_hours"
  | "context_unavailable";

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

  const audioState = getNotificationAudioContextState();
  if (!audioState.supported) return "browser_blocked";
  if (audioState.state === "idle" && !audioState.primed) return "needs_interaction";
  if (audioState.state === "suspended") return "browser_blocked";
  if (audioState.state === "unsupported") return "browser_blocked";

  return "active";
}

export function runNotificationSoundTest(
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

  primeSoftBellAudio();
  return playSoftBellChimeWithResult() ? "played" : "blocked";
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

  if (!getNotificationAudioContextState().supported) {
    return "context_unavailable";
  }

  primeSoftBellAudio();
  return (await playSoftBellChimeAsync()) ? "played" : "blocked";
}
