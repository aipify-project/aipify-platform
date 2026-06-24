type AudioSessionDiagnosticEvent =
  | "context_created"
  | "context_resumed"
  | "context_suspended"
  | "bell_played"
  | "bell_blocked"
  | "bell_released"
  | "media_tracks_registered"
  | "media_tracks_stopped";

type AudioSessionDiagnosticPayload = Record<string, string | number | boolean | null>;

export function logAudioSessionDiagnostic(
  event: AudioSessionDiagnosticEvent,
  payload: AudioSessionDiagnosticPayload = {},
): void {
  if (process.env.NODE_ENV === "production") return;
  console.info("[aipify:audio-session]", event, payload);
}
