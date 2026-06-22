"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { readCompanionUiSession, patchCompanionUiSession } from "./session-state";
import {
  applyCompanionChatInitialScroll,
  COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR,
  isCompanionChatNearBottom,
  scrollCompanionChatToLatest,
  shouldAutoScrollCompanionChatOnUpdate,
  shouldRestoreCompanionChatScroll,
} from "./companion-chat-scroll-policy";

export type CompanionChatScrollSessionOptions = {
  organizationKey?: string | null;
  pathname?: string | null;
  persistScroll?: boolean;
};

export type UseCompanionChatScrollOptions = {
  messageCount: number;
  /** Bumps when rendered list content changes (messages, pending drafts, loading). */
  contentSignature: string;
  conversationId: string;
  loading?: boolean;
  visible?: boolean;
  session?: CompanionChatScrollSessionOptions;
};

export function useCompanionChatScroll({
  messageCount,
  contentSignature,
  conversationId,
  loading = false,
  visible = true,
  session,
}: UseCompanionChatScrollOptions) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isPageLoadRef = useRef(true);
  const panelWasHiddenRef = useRef(!visible);
  const initialScrollAppliedRef = useRef(false);
  const pendingConversationScrollRef = useRef<string | null>(null);
  const userJustSentMessageRef = useRef(false);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [messagesViewportReady, setMessagesViewportReady] = useState(() => !visible);

  const persistScroll = session?.persistScroll ?? false;
  const organizationKey = session?.organizationKey ?? null;
  const pathname = session?.pathname ?? null;

  useEffect(() => {
    if (visible) return;
    panelWasHiddenRef.current = true;
  }, [visible]);

  const persistScrollPosition = useCallback(
    (scrollTop: number) => {
      if (!persistScroll) return;
      patchCompanionUiSession(
        {
          scrollTop,
          organizationKey,
          pathname,
          activeConversationId: conversationId,
        },
        organizationKey,
      );
    },
    [conversationId, organizationKey, pathname, persistScroll],
  );

  const applyInitialChatScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !visible) return;

    const sessionState = persistScroll ? readCompanionUiSession(organizationKey) : null;
    const shouldRestore =
      persistScroll &&
      shouldRestoreCompanionChatScroll({
        isPageLoad: isPageLoadRef.current,
        panelWasHidden: panelWasHiddenRef.current,
        sessionScrollTop: sessionState?.scrollTop ?? 0,
        sessionConversationId: sessionState?.activeConversationId ?? null,
        activeConversationId: conversationId,
      });

    applyCompanionChatInitialScroll({
      container,
      shouldRestore: Boolean(shouldRestore && sessionState),
      restoreScrollTop: sessionState?.scrollTop ?? 0,
    });

    panelWasHiddenRef.current = false;
    isPageLoadRef.current = false;
    initialScrollAppliedRef.current = true;
    pendingConversationScrollRef.current = null;
    setShowJumpToLatest(false);
    setMessagesViewportReady(true);
    persistScrollPosition(container.scrollTop);
  }, [conversationId, organizationKey, persistScroll, persistScrollPosition, visible]);

  useLayoutEffect(() => {
    if (!visible) {
      setMessagesViewportReady(false);
      return;
    }

    if (messageCount === 0 && !loading) {
      initialScrollAppliedRef.current = false;
      setShowJumpToLatest(false);
      setMessagesViewportReady(true);
      isPageLoadRef.current = false;
      return;
    }

    if (messageCount === 0 && loading) {
      setMessagesViewportReady(true);
      return;
    }

    const reopeningPanel = panelWasHiddenRef.current && initialScrollAppliedRef.current;
    const needsInitialPosition =
      reopeningPanel ||
      !initialScrollAppliedRef.current ||
      pendingConversationScrollRef.current === conversationId;

    if (!needsInitialPosition) {
      setMessagesViewportReady(true);
      return;
    }

    setMessagesViewportReady(false);
    let cancelled = false;

    const positionViewport = () => {
      if (cancelled) return;
      applyInitialChatScroll();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(positionViewport);
    });

    return () => {
      cancelled = true;
    };
  }, [applyInitialChatScroll, conversationId, loading, messageCount, visible]);

  useLayoutEffect(() => {
    if (!visible || !initialScrollAppliedRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;
    if (messageCount === 0 && !loading) return;

    const shouldAutoScroll = shouldAutoScrollCompanionChatOnUpdate({
      isNearBottom: isCompanionChatNearBottom(container),
      userJustSentMessage: userJustSentMessageRef.current,
    });

    userJustSentMessageRef.current = false;

    if (shouldAutoScroll) {
      scrollCompanionChatToLatest(container, COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR);
      setShowJumpToLatest(false);
      persistScrollPosition(container.scrollTop);
      return;
    }

    if (loading || messageCount > 0) {
      setShowJumpToLatest(true);
    }
  }, [contentSignature, loading, messageCount, persistScrollPosition, visible]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    persistScrollPosition(container.scrollTop);
    setShowJumpToLatest(!isCompanionChatNearBottom(container));
  }, [persistScrollPosition]);

  const jumpToLatestMessage = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    scrollCompanionChatToLatest(container, COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR);
    setShowJumpToLatest(false);
    persistScrollPosition(container.scrollTop);
  }, [persistScrollPosition]);

  const notifyUserSentMessage = useCallback(() => {
    userJustSentMessageRef.current = true;
  }, []);

  const resetForNewConversation = useCallback(() => {
    initialScrollAppliedRef.current = false;
    pendingConversationScrollRef.current = null;
    setShowJumpToLatest(false);
    isPageLoadRef.current = false;
    panelWasHiddenRef.current = false;
  }, []);

  const prepareConversationChange = useCallback((nextConversationId: string) => {
    initialScrollAppliedRef.current = false;
    pendingConversationScrollRef.current = nextConversationId;
    isPageLoadRef.current = false;
    panelWasHiddenRef.current = false;
    setShowJumpToLatest(false);
  }, []);

  const viewportContentClassName =
    messageCount > 0 || loading ? (!messagesViewportReady ? "invisible" : "") : "";

  return {
    scrollContainerRef,
    chatEndRef,
    messagesViewportReady,
    showJumpToLatest,
    handleScroll,
    jumpToLatestMessage,
    notifyUserSentMessage,
    resetForNewConversation,
    prepareConversationChange,
    viewportContentClassName,
  };
}
