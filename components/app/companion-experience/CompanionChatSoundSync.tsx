"use client";

import { useEffect, useRef } from "react";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import {
  detectNewAssistantMessagesForSound,
  playCompanionAssistantMessageSound,
  type CompanionChatSoundMessage,
} from "@/lib/app/companion/chat-queue/companion-chat-sound";
import { useOptionalUnifiedNotificationFeed } from "@/components/presence/UnifiedNotificationFeedProvider";

type CompanionChatSoundSyncProps = {
  messages: CompanionChatMessage[];
  enabled?: boolean;
};

function toSoundMessages(messages: CompanionChatMessage[]): CompanionChatSoundMessage[] {
  return messages.map((message) => ({
    role: message.role,
    serverId: message.serverId ?? null,
    clientId: message.id,
  }));
}

export function CompanionChatSoundSync({
  messages,
  enabled = true,
}: CompanionChatSoundSyncProps) {
  const feed = useOptionalUnifiedNotificationFeed();
  const previousRef = useRef<CompanionChatSoundMessage[]>([]);
  const playedKeysRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const next = toSoundMessages(messages);
    const newAssistantMessages = detectNewAssistantMessagesForSound(previousRef.current, next);
    previousRef.current = next;

    if (newAssistantMessages.length === 0 || inFlightRef.current) return;

    inFlightRef.current = true;
    void (async () => {
      try {
        for (const message of newAssistantMessages) {
          await playCompanionAssistantMessageSound({
            message,
            preferences: feed?.preferences ?? null,
            playedKeys: playedKeysRef.current,
          });
          break;
        }
      } finally {
        inFlightRef.current = false;
      }
    })();
  }, [enabled, feed?.preferences, messages]);

  return null;
}
