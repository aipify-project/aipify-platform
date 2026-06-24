export type NotificationPlaybackResult =
  | { status: "completed"; ended: true }
  | { status: "autoplay_blocked"; error: string }
  | { status: "file_missing" }
  | { status: "decode_error"; error: string }
  | { status: "play_rejected"; error: string }
  | { status: "incomplete"; error: string };

export const NOTIFICATION_CHIME_SRC = "/audio/notification-chime.wav";

const CHIME_DEBOUNCE_MS = 750;
const CHIME_VOLUME = 0.85;
const CHIME_END_TIMEOUT_MS = 5000;

let sharedAudio: HTMLAudioElement | null = null;
let chimePrimed = false;
let lastChimePlayedAt = 0;

function getSharedAudioElement(): HTMLAudioElement {
  if (!sharedAudio) {
    sharedAudio = new Audio(NOTIFICATION_CHIME_SRC);
    sharedAudio.preload = "auto";
    sharedAudio.volume = CHIME_VOLUME;
  }
  return sharedAudio;
}

export function primeNotificationChime(): void {
  if (typeof window === "undefined") return;
  chimePrimed = true;
  const audio = getSharedAudioElement();
  audio.load();
}

export function isNotificationChimePrimed(): boolean {
  return chimePrimed;
}

export function isNotificationChimeSupported(): boolean {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

export async function playNotificationChime(): Promise<NotificationPlaybackResult> {
  if (typeof window === "undefined") {
    return { status: "file_missing" };
  }
  if (!isNotificationChimeSupported()) {
    return { status: "file_missing" };
  }

  const now = Date.now();
  if (now - lastChimePlayedAt < CHIME_DEBOUNCE_MS) {
    return { status: "completed", ended: true };
  }

  const audio = getSharedAudioElement();
  audio.currentTime = 0;
  audio.volume = CHIME_VOLUME;

  const decodeError = await new Promise<string | null>((resolve) => {
    const onError = () => {
      cleanup();
      const mediaError = audio.error;
      if (mediaError?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        resolve("decode_error");
        return;
      }
      if (mediaError?.code === MediaError.MEDIA_ERR_NETWORK) {
        resolve("file_missing");
        return;
      }
      resolve(mediaError?.message ?? "decode_error");
    };
    const onCanPlay = () => {
      cleanup();
      resolve(null);
    };
    const cleanup = () => {
      audio.removeEventListener("error", onError);
      audio.removeEventListener("canplaythrough", onCanPlay);
    };
    audio.addEventListener("error", onError, { once: true });
    audio.addEventListener("canplaythrough", onCanPlay, { once: true });
    audio.load();
  });

  if (decodeError === "file_missing") return { status: "file_missing" };
  if (decodeError === "decode_error") return { status: "decode_error", error: "decode_error" };
  if (decodeError) return { status: "decode_error", error: decodeError };

  try {
    await audio.play();
  } catch (err) {
    const message = err instanceof Error ? err.message : "play_rejected";
    const lower = message.toLowerCase();
    if (lower.includes("notallowed") || lower.includes("interact")) {
      return { status: "autoplay_blocked", error: message };
    }
    return { status: "play_rejected", error: message };
  }

  const ended = await new Promise<boolean>((resolve) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      resolve(false);
    }, CHIME_END_TIMEOUT_MS);
    const onEnded = () => {
      cleanup();
      resolve(true);
    };
    const cleanup = () => {
      window.clearTimeout(timeout);
      audio.removeEventListener("ended", onEnded);
    };
    audio.addEventListener("ended", onEnded, { once: true });
  });

  if (!ended) {
    return { status: "incomplete", error: "ended_not_received" };
  }

  lastChimePlayedAt = Date.now();
  return { status: "completed", ended: true };
}

export function mapPlaybackResultToTestResult(
  result: NotificationPlaybackResult,
): "played" | "blocked" | "file_error" | "incomplete" {
  if (result.status === "completed") return "played";
  if (result.status === "autoplay_blocked" || result.status === "play_rejected") return "blocked";
  if (result.status === "file_missing" || result.status === "decode_error") return "file_error";
  return "incomplete";
}
