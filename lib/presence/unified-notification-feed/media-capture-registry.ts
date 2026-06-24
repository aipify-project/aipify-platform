import { logAudioSessionDiagnostic } from "@/lib/presence/unified-notification-feed/audio-session-diagnostics";

type RegisteredTrack = {
  track: MediaStreamTrack;
  source: string;
};

const registeredTracks = new Map<string, RegisteredTrack>();

function trackKey(track: MediaStreamTrack, source: string): string {
  return `${source}:${track.id}`;
}

export function registerMediaStreamTracks(stream: MediaStream, source: string): void {
  for (const track of stream.getTracks()) {
    registeredTracks.set(trackKey(track, source), { track, source });
  }
  logAudioSessionDiagnostic("media_tracks_registered", {
    source,
    activeTrackCount: registeredTracks.size,
    microphoneActive: isMicrophoneActive(),
  });
}

export function unregisterMediaStreamTrack(track: MediaStreamTrack, source: string): void {
  registeredTracks.delete(trackKey(track, source));
}

export function stopAllMediaCaptureTracks(reason: string): number {
  let stopped = 0;
  for (const entry of registeredTracks.values()) {
    if (entry.track.readyState !== "ended") {
      entry.track.stop();
      stopped += 1;
    }
  }
  registeredTracks.clear();
  if (stopped > 0) {
    logAudioSessionDiagnostic("media_tracks_stopped", {
      reason,
      stopped,
      activeTrackCount: 0,
      microphoneActive: false,
    });
  }
  return stopped;
}

export function isMicrophoneActive(): boolean {
  for (const entry of registeredTracks.values()) {
    if (entry.track.kind === "audio" && entry.track.readyState === "live") {
      return true;
    }
  }
  return false;
}

export function getMediaCaptureDiagnostics(): {
  activeTrackCount: number;
  microphoneActive: boolean;
  sources: string[];
} {
  const sources = new Set<string>();
  let activeTrackCount = 0;

  for (const entry of registeredTracks.values()) {
    if (entry.track.readyState === "live") {
      activeTrackCount += 1;
      sources.add(entry.source);
    }
  }

  return {
    activeTrackCount,
    microphoneActive: isMicrophoneActive(),
    sources: [...sources],
  };
}
