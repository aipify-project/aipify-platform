import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import { playNotificationChime, primeNotificationChime } from "@/lib/presence/notification-chime";
import { shouldDeliverNotification } from "@/lib/presence/quiet-hours";

export type CompanionChatSoundMessage = {
  role: "user" | "aipify";
  serverId?: string | null;
  clientId: string;
};

function isSoundMuted(prefs: PresenceNotificationPreferences | null): boolean {
  if (!prefs?.channel_in_app || prefs.sound_enabled === false) return true;
  if (
    prefs.quiet_hours_enabled &&
    !shouldDeliverNotification("informational", prefs, new Date())
  ) {
    return true;
  }
  return false;
}

function resolveDedupeKey(message: CompanionChatSoundMessage): string {
  return message.serverId ?? message.clientId;
}

export function detectNewAssistantMessagesForSound(
  previous: CompanionChatSoundMessage[],
  next: CompanionChatSoundMessage[],
): CompanionChatSoundMessage[] {
  const known = new Set(
    previous.filter((m) => m.role === "aipify").map((m) => resolveDedupeKey(m)),
  );

  return next.filter((message) => {
    if (message.role !== "aipify") return false;
    const key = resolveDedupeKey(message);
    if (known.has(key)) return false;
    return true;
  });
}

export async function playCompanionAssistantMessageSound(input: {
  message: CompanionChatSoundMessage;
  preferences: PresenceNotificationPreferences | null;
  playedKeys: Set<string>;
}): Promise<"played" | "skipped" | "blocked" | "muted"> {
  const dedupeKey = resolveDedupeKey(input.message);
  if (input.playedKeys.has(dedupeKey)) return "skipped";
  if (isSoundMuted(input.preferences)) return "muted";

  primeNotificationChime();
  const result = await playNotificationChime();

  if (result.status === "completed") {
    input.playedKeys.add(dedupeKey);
    return "played";
  }

  if (result.status === "autoplay_blocked" || result.status === "play_rejected") {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[aipify:companion-chat-sound] playback blocked", {
        dedupeKey,
        status: result.status,
      });
    }
    return "blocked";
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn("[aipify:companion-chat-sound] playback failed", {
      dedupeKey,
      status: result.status,
    });
  }
  return "blocked";
}
