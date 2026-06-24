"use client";

import { useEffect, useRef } from "react";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import { markCompanionConversationRead } from "@/lib/app/companion/chat-queue/client";
import { setCompanionActiveSession } from "@/lib/presence/unified-notification-feed/companion-active-session";
import { useOptionalUnifiedNotificationFeed } from "@/components/presence/UnifiedNotificationFeedProvider";

type CompanionNotificationSeenSyncProps = {
  conversationId: string;
  panelVisible: boolean;
  messages: CompanionChatMessage[];
};

/** Keeps Companion chat seen-state aligned with the unified notification feed (server-authoritative). */
export function CompanionNotificationSeenSync({
  conversationId,
  panelVisible,
  messages,
}: CompanionNotificationSeenSyncProps) {
  const feed = useOptionalUnifiedNotificationFeed();
  const lastSyncedSignatureRef = useRef("");

  const assistantMessageCount = messages.filter((message) => message.role === "aipify").length;
  const hasVisibleAssistantReply = assistantMessageCount > 0;

  useEffect(() => {
    setCompanionActiveSession({
      panelVisible,
      conversationId: panelVisible ? conversationId : null,
      hasVisibleAssistantReply: panelVisible ? hasVisibleAssistantReply : false,
    });

    return () => {
      setCompanionActiveSession({
        panelVisible: false,
        conversationId: null,
        hasVisibleAssistantReply: false,
      });
    };
  }, [conversationId, hasVisibleAssistantReply, panelVisible]);

  useEffect(() => {
    if (!panelVisible || !conversationId || !hasVisibleAssistantReply) {
      if (!panelVisible) {
        lastSyncedSignatureRef.current = "";
      }
      return;
    }

    const signature = `${conversationId}:${assistantMessageCount}:${panelVisible}`;
    if (lastSyncedSignatureRef.current === signature) return;
    lastSyncedSignatureRef.current = signature;

    void (async () => {
      await markCompanionConversationRead(conversationId);
      await feed?.markConversationNotificationsRead(conversationId);
    })();
  }, [
    assistantMessageCount,
    conversationId,
    feed,
    hasVisibleAssistantReply,
    panelVisible,
  ]);

  return null;
}
