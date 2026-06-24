import { meetsMinimumLevel, type PresenceNotificationLevel } from "@/lib/presence/notifications";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import { shouldDeliverNotification } from "@/lib/presence/quiet-hours";
import type { PresenceNotification } from "@/lib/presence/notification-state";

const BELL_DEBOUNCE_MS = 750;

let sharedAudioContext: AudioContext | null = null;
let audioPrimed = false;
let lastBellPlayedAt = 0;

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ??
    null
  );
}

function getSharedAudioContext(): AudioContext | null {
  const AudioContextCtor = getAudioContextCtor();
  if (!AudioContextCtor) return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextCtor();
  }
  return sharedAudioContext;
}

export function getNotificationAudioContextState(): {
  supported: boolean;
  primed: boolean;
  state: AudioContextState | "unsupported";
} {
  const context = getSharedAudioContext();
  if (!context) {
    return { supported: false, primed: audioPrimed, state: "unsupported" };
  }
  return { supported: true, primed: audioPrimed, state: context.state };
}

/** Resume audio after the first user gesture when the browser requires it. */
export function primeSoftBellAudio(): void {
  try {
    const context = getSharedAudioContext();
    if (!context) return;
    if (context.state === "suspended") {
      void context.resume();
    }
    audioPrimed = true;
  } catch {
    // Sound is optional — keep the pulse without surfacing errors.
  }
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
  if (
    notification.event_type === "playful_bell_moment" &&
    !prefs.playful_moments_enabled
  ) {
    return false;
  }
  if (!meetsMinimumLevel(notification.level, prefs.min_level_in_app)) return false;
  return passesQuietHours(prefs, notification.level, now);
}

export function playSoftBellChime(): void {
  void playSoftBellChimeWithResult();
}

export function playSoftBellChimeWithResult(): boolean {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  if (now - lastBellPlayedAt < BELL_DEBOUNCE_MS) return true;

  try {
    const context = getSharedAudioContext();
    if (!context) return false;
    if (context.state === "suspended" && !audioPrimed) return false;

    if (context.state === "suspended") {
      void context.resume().then(() => {
        if (context.state === "running") {
          playSoftBellChimeOnContext(context);
        }
      });
      return false;
    }

    return playSoftBellChimeOnContext(context);
  } catch {
    return false;
  }
}

function playSoftBellChimeOnContext(context: AudioContext): boolean {
  const now = Date.now();
  if (now - lastBellPlayedAt < BELL_DEBOUNCE_MS) return true;
  lastBellPlayedAt = now;

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
  return true;
}
