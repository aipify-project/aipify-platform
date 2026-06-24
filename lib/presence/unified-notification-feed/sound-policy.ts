import { meetsMinimumLevel, type PresenceNotificationLevel } from "@/lib/presence/notifications";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import { shouldDeliverNotification } from "@/lib/presence/quiet-hours";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import { logAudioSessionDiagnostic } from "@/lib/presence/unified-notification-feed/audio-session-diagnostics";
import { getMediaCaptureDiagnostics } from "@/lib/presence/unified-notification-feed/media-capture-registry";

const BELL_DEBOUNCE_MS = 750;
const BELL_IDLE_SUSPEND_MS = 450;

let sharedAudioContext: AudioContext | null = null;
let audioPrimed = false;
let lastBellPlayedAt = 0;
let idleSuspendTimer: ReturnType<typeof setTimeout> | null = null;
let activeBellNodes: { oscillator: OscillatorNode; gain: GainNode } | null = null;
let activeContextInstances = 0;

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ??
    null
  );
}

function peekBellAudioContext(): AudioContext | null {
  if (!sharedAudioContext || sharedAudioContext.state === "closed") return null;
  return sharedAudioContext;
}

function acquireBellAudioContext(): AudioContext | null {
  const AudioContextCtor = getAudioContextCtor();
  if (!AudioContextCtor) return null;

  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new AudioContextCtor();
    activeContextInstances += 1;
    logAudioSessionDiagnostic("context_created", {
      activeContextInstances,
      state: sharedAudioContext.state,
      activeTrackCount: getMediaCaptureDiagnostics().activeTrackCount,
      microphoneActive: getMediaCaptureDiagnostics().microphoneActive,
    });
  }

  return sharedAudioContext;
}

function releaseActiveBellNodes(): void {
  if (!activeBellNodes) return;
  try {
    activeBellNodes.oscillator.disconnect();
    activeBellNodes.gain.disconnect();
  } catch {
    // Nodes may already be disconnected after stop().
  }
  activeBellNodes = null;
  logAudioSessionDiagnostic("bell_released", {
    contextState: peekBellAudioContext()?.state ?? "none",
  });
}

function scheduleIdleSuspend(context: AudioContext): void {
  if (idleSuspendTimer) {
    clearTimeout(idleSuspendTimer);
  }
  idleSuspendTimer = setTimeout(() => {
    idleSuspendTimer = null;
    if (context.state !== "running") return;
    void context
      .suspend()
      .then(() => {
        logAudioSessionDiagnostic("context_suspended", {
          reason: "idle_after_bell",
          state: context.state,
        });
      })
      .catch(() => {
        // Suspend is best-effort — never block UI.
      });
  }, BELL_IDLE_SUSPEND_MS);
}

export function getNotificationAudioContextState(): {
  supported: boolean;
  primed: boolean;
  state: AudioContextState | "unsupported" | "idle";
  activeContextInstances: number;
} {
  const context = peekBellAudioContext();
  if (!context) {
    return {
      supported: getAudioContextCtor() !== null,
      primed: audioPrimed,
      state: getAudioContextCtor() ? "idle" : "unsupported",
      activeContextInstances,
    };
  }
  return {
    supported: true,
    primed: audioPrimed,
    state: context.state,
    activeContextInstances,
  };
}

/** Records a user gesture without creating or resuming an AudioContext. */
export function primeSoftBellAudio(): void {
  audioPrimed = true;
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
  void playSoftBellChimeAsync();
}

async function ensureRunningAudioContext(): Promise<AudioContext | null> {
  const before = peekBellAudioContext()?.state ?? "idle";
  const context = acquireBellAudioContext();
  if (!context || context.state === "closed") return null;

  if (idleSuspendTimer) {
    clearTimeout(idleSuspendTimer);
    idleSuspendTimer = null;
  }

  const initialState = context.state;
  if (initialState === "suspended") {
    try {
      await context.resume();
      const afterState = context.state;
      logAudioSessionDiagnostic("context_resumed", {
        before,
        after: afterState,
        resumeSucceeded: afterState === "running",
      });
    } catch {
      logAudioSessionDiagnostic("bell_blocked", {
        reason: "resume_failed",
        before,
        after: context.state,
      });
      return null;
    }
  }

  return context.state === "running" ? context : null;
}

export async function playSoftBellChimeAsync(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  if (now - lastBellPlayedAt < BELL_DEBOUNCE_MS) return true;

  try {
    const context = await ensureRunningAudioContext();
    if (!context) {
      logAudioSessionDiagnostic("bell_blocked", {
        reason: "context_unavailable",
        primed: audioPrimed,
      });
      return false;
    }
    const played = playSoftBellChimeOnContext(context);
    if (played) {
      logAudioSessionDiagnostic("bell_played", {
        contextState: context.state,
        activeTrackCount: getMediaCaptureDiagnostics().activeTrackCount,
        microphoneActive: getMediaCaptureDiagnostics().microphoneActive,
      });
    }
    return played;
  } catch {
    logAudioSessionDiagnostic("bell_blocked", { reason: "unexpected_error" });
    return false;
  }
}

/** Synchronous attempt — used only when an explicit user gesture just occurred. */
export function playSoftBellChimeWithResult(): boolean {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  if (now - lastBellPlayedAt < BELL_DEBOUNCE_MS) return true;

  try {
    const context = acquireBellAudioContext();
    if (!context || context.state === "closed") return false;

    if (context.state === "suspended") {
      if (!audioPrimed) return false;
      void playSoftBellChimeAsync();
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

  releaseActiveBellNodes();

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  activeBellNodes = { oscillator, gain };

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(660, context.currentTime + 0.12);

  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.onended = () => {
    releaseActiveBellNodes();
    scheduleIdleSuspend(context);
  };

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + 0.36);
  return true;
}
