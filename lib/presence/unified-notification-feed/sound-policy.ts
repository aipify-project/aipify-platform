import { meetsMinimumLevel, type PresenceNotificationLevel } from "@/lib/presence/notifications";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import { shouldDeliverNotification } from "@/lib/presence/quiet-hours";
import type { PresenceNotification } from "@/lib/presence/notification-state";

export function shouldPlayInAppNotificationSound(
  notification: PresenceNotification,
  prefs: PresenceNotificationPreferences | null,
  now: Date = new Date(),
): boolean {
  if (!prefs?.channel_in_app) return false;
  if (!meetsMinimumLevel(notification.level, prefs.min_level_in_app)) return false;
  return shouldDeliverNotification(notification.level, prefs, now);
}

export function playSoftBellChime(): void {
  if (typeof window === "undefined") return;

  try {
    const AudioContextCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(660, context.currentTime + 0.12);

    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.36);

    window.setTimeout(() => {
      void context.close();
    }, 500);
  } catch {
    // Silent fallback — sound is optional enhancement.
  }
}
