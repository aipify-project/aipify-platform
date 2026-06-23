"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CompanionChatAttachmentSummary, CompanionChatMessage } from "../types";
import type { CompanionQueueItem } from "./types";
import { mapServerMessagesToChat } from "./message-payload";
import {
  cancelCompanionQueueItem,
  createClientMessageId,
  createIdempotencyKey,
  enqueueCompanionMessage,
  fetchCompanionChatState,
  listCompanionConversations,
  markCompanionConversationRead,
  retryCompanionQueueItem,
  triggerCompanionQueueProcess,
} from "./client";

export type UseCompanionPersistentChatInput = {
  conversationId: string;
  locale: string;
  pathname: string;
  panelVisible: boolean;
  organizationKey: string | null;
  onRestoreError?: () => void;
};

export function useCompanionPersistentChat({
  conversationId,
  locale,
  pathname,
  panelVisible,
  organizationKey,
  onRestoreError,
}: UseCompanionPersistentChatInput) {
  const [messages, setMessages] = useState<CompanionChatMessage[]>([]);
  const [queue, setQueue] = useState<CompanionQueueItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [restoreFailed, setRestoreFailed] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loading = queue.some((item) => item.status === "processing");

  const applyState = useCallback((state: Awaited<ReturnType<typeof fetchCompanionChatState>>) => {
    if (!state.ok) {
      if (state.error === "fetch_failed") {
        setRestoreFailed(true);
        onRestoreError?.();
      }
      return;
    }

    if (state.conversation === null && state.messages.length === 0 && state.queue.length === 0) {
      setHydrated(true);
      return;
    }

    setMessages(mapServerMessagesToChat(state.messages));
    setQueue(state.queue);
    setHydrated(true);
    setRestoreFailed(false);
    setSyncError(false);
  }, [onRestoreError]);

  const refreshState = useCallback(async () => {
    const state = await fetchCompanionChatState(conversationId);
    applyState(state);
    return state;
  }, [applyState, conversationId]);

  useEffect(() => {
    let cancelled = false;
    setHydrated(false);

    void (async () => {
      const state = await fetchCompanionChatState(conversationId);
      if (cancelled) return;
      applyState(state);

      const hasActiveQueue = state.queue?.some(
        (item) => item.status === "waiting" || item.status === "processing",
      );
      if (hasActiveQueue) {
        void triggerCompanionQueueProcess(conversationId, panelVisible);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId, organizationKey, applyState, panelVisible]);

  useEffect(() => {
    if (panelVisible && conversationId) {
      void markCompanionConversationRead(conversationId);
    }
  }, [panelVisible, conversationId, messages.length]);

  useEffect(() => {
    const needsPoll = queue.some(
      (item) => item.status === "waiting" || item.status === "processing",
    );

    if (!needsPoll) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    pollRef.current = setInterval(() => {
      void refreshState();
      void triggerCompanionQueueProcess(conversationId, panelVisible);
    }, 2500);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [queue, conversationId, panelVisible, refreshState]);

  const enqueueQuestion = useCallback(
    async (input: {
      question: string;
      attachmentIds?: string[];
      activeArtifactId?: string | null;
      attachmentSummaries?: CompanionChatAttachmentSummary[];
      title?: string;
      platformActiveModules?: string[];
    }) => {
      const trimmed = input.question.trim();
      const hasAttachments = (input.attachmentIds?.length ?? 0) > 0;
      if (!trimmed && !hasAttachments) return false;

      setSyncError(false);
      const clientMessageId = createClientMessageId();
      const idempotencyKey = createIdempotencyKey(conversationId, clientMessageId);

      const result = await enqueueCompanionMessage({
        conversationId,
        idempotencyKey,
        question: trimmed,
        attachmentIds: input.attachmentIds,
        activeArtifactId: input.activeArtifactId,
        attachmentSummaries: input.attachmentSummaries,
        locale,
        pathname,
        platformActiveModules: input.platformActiveModules,
        title: input.title ?? trimmed,
        companionActive: panelVisible,
      });

      if (!result.ok) {
        setSyncError(true);
        return false;
      }

      await refreshState();
      void triggerCompanionQueueProcess(conversationId, panelVisible);
      return true;
    },
    [conversationId, locale, pathname, panelVisible, refreshState],
  );

  const cancelQueueItem = useCallback(
    async (queueId: string) => {
      const ok = await cancelCompanionQueueItem(queueId, conversationId);
      if (ok) await refreshState();
      return ok;
    },
    [conversationId, refreshState],
  );

  const retryQueueItem = useCallback(
    async (queueId: string) => {
      const ok = await retryCompanionQueueItem(queueId, conversationId);
      if (ok) {
        await refreshState();
        void triggerCompanionQueueProcess(conversationId, panelVisible);
      }
      return ok;
    },
    [conversationId, panelVisible, refreshState],
  );

  return {
    messages,
    setMessages,
    queue,
    loading,
    hydrated,
    restoreFailed,
    syncError,
    setSyncError,
    enqueueQuestion,
    refreshState,
    cancelQueueItem,
    retryQueueItem,
    loadServerConversations: listCompanionConversations,
  };
}
