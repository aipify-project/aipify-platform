"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  COMPANION_PUBLIC_LINK_BECOME_PARTNER_URL,
  COMPANION_PUBLIC_LINK_BUSINESS_PACKS_URL,
  isCompanionPublicLinksEnabled,
} from "@/lib/app/companion/companion-public-links";
import {
  applyCompanionChatInitialScroll,
  COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR,
  isCompanionChatNearBottom,
  scrollCompanionChatToLatest,
  shouldAutoScrollCompanionChatOnUpdate,
} from "@/lib/app/companion/companion-chat-scroll-policy";
import type { PublicCompanionAskResponse } from "@/lib/marketing/public-companion-ask";
import {
  buildWebsiteCompanionAskBody,
  collectWebsiteCompanionPageContext,
  collectWebsiteCompanionVisitorDomain,
  formatWebsiteCompanionCharactersRemaining,
  mapWebsiteCompanionApiResponse,
  shouldAllowWebsiteCompanionSend,
  validateWebsiteCompanionQuestion,
  WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH,
  type WebsiteCompanionChatMessage,
} from "@/lib/marketing/website-companion-chat";
import {
  WEBSITE_COMPANION_PRESENCE_STYLES,
  websiteCompanionPresenceLabel,
  type WebsiteCompanionPresenceState,
} from "@/lib/marketing/website-companion-presence";
import {
  applyWebsiteCompanionWindowDragDelta,
  applyWebsiteCompanionWindowMaximize,
  applyWebsiteCompanionWindowResizeDelta,
  applyWebsiteCompanionWindowRestore,
  canStartWebsiteCompanionWindowDrag,
  clearWebsiteCompanionWindowState,
  getWebsiteCompanionWindowDisplayedGeometry,
  getWebsiteCompanionWindowMaximizeAriaLabel,
  getWebsiteCompanionWindowResetLayout,
  getWebsiteCompanionWindowResetLabel,
  getWebsiteCompanionWindowRestoreAriaLabel,
  getWebsiteCompanionWindowViewportOffset,
  isWebsiteCompanionDesktopViewport,
  isWebsiteCompanionLocalStorageAvailable,
  isWebsiteCompanionPointerEventsSupported,
  readWebsiteCompanionViewport,
  readWebsiteCompanionWindowLayoutState,
  reconcileWebsiteCompanionWindowLayoutState,
  shouldAllowWebsiteCompanionWindowDrag,
  shouldAllowWebsiteCompanionWindowResize,
  shouldShowWebsiteCompanionMaximizeControl,
  shouldUseWebsiteCompanionFloatingWindow,
  writeWebsiteCompanionWindowLayoutState,
  type CompanionViewport,
  type CompanionWindowGeometry,
  type CompanionWindowLayoutState,
} from "@/lib/marketing/website-companion-window";

type CompanionAction = {
  id: string;
  label: string;
  href: string;
  description: string;
};

type WebsiteCompanionChatLabels = {
  welcome: string;
  inputPlaceholder: string;
  send: string;
  sendAria: string;
  sending: string;
  retry: string;
  genericError: string;
  sources: string;
  goToLatest: string;
  goToLatestAria: string;
  charactersRemaining: string;
  open: string;
  close: string;
  quickLinks: string;
  publicLinks: {
    businessPacks: string;
    becomePartner: string;
  };
};

type WebsiteCompanionAssistantProps = {
  locale: string;
  title: string;
  prompt: string;
  presenceLabel: string;
  chat: WebsiteCompanionChatLabels;
  states: Record<WebsiteCompanionPresenceState, string>;
  actions: CompanionAction[];
};

function createMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function preserveLineBreaks(text: string): string[] {
  return text.split("\n").map((line) => line.trimEnd());
}

function AssistantAnswerBody({
  message,
  sourcesLabel,
}: {
  message: Extract<WebsiteCompanionChatMessage, { role: "assistant"; failed?: false }>;
  sourcesLabel: string;
}) {
  if ("failed" in message && message.failed) return null;

  return (
    <div className="space-y-3 text-sm text-aipify-text">
      <div className="space-y-2">
        {preserveLineBreaks(message.directAnswer).map((line, index) => (
          <p key={`answer-${index}`} className={line ? undefined : "min-h-[1em]"}>
            {line}
          </p>
        ))}
      </div>

      {message.explanation?.trim() ? (
        <div className="space-y-2 text-aipify-text-secondary">
          {preserveLineBreaks(message.explanation).map((line, index) => (
            <p key={`explanation-${index}`} className={line ? undefined : "min-h-[1em]"}>
              {line}
            </p>
          ))}
        </div>
      ) : null}

      {message.steps.length > 0 ? (
        <ol className="list-decimal space-y-1.5 pl-5 text-aipify-text-secondary">
          {message.steps.map((step, index) => (
            <li key={`step-${index}`}>{step}</li>
          ))}
        </ol>
      ) : null}

      {message.sources.length > 0 ? (
        <div className="rounded-lg border border-aipify-border bg-aipify-surface-muted/60 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-aipify-text-muted">
            {sourcesLabel}
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-aipify-text-secondary">
            {message.sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {message.actions.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {message.actions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              className={
                action.variant === "primary"
                  ? "inline-flex min-h-9 items-center rounded-full bg-aipify-companion px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
                  : "inline-flex min-h-9 items-center rounded-full border border-aipify-border bg-aipify-surface px-3 py-1.5 text-xs font-medium text-aipify-companion hover:bg-aipify-surface-muted"
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function WebsiteCompanionAssistant({
  locale,
  title,
  prompt,
  presenceLabel,
  chat,
  states,
  actions,
}: WebsiteCompanionAssistantProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [presence, setPresence] = useState<WebsiteCompanionPresenceState>("READY");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<WebsiteCompanionChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userJustSentMessageRef = useRef(false);
  const initialScrollAppliedRef = useRef(false);
  const requestIdRef = useRef(0);
  const dragSessionRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: CompanionWindowGeometry;
  } | null>(null);
  const resizeSessionRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: CompanionWindowGeometry;
  } | null>(null);

  const [viewport, setViewport] = useState<CompanionViewport>({ width: 1280, height: 900 });
  const [viewportOffset, setViewportOffset] = useState<Pick<CompanionWindowGeometry, "x" | "y">>({
    x: 0,
    y: 0,
  });
  const [pointerEventsSupported, setPointerEventsSupported] = useState(true);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [windowLayout, setWindowLayout] = useState<CompanionWindowLayoutState | null>(null);

  const floatingWindowEnabled = shouldUseWebsiteCompanionFloatingWindow({
    viewportWidth: viewport.width,
    pointerEventsSupported,
  });
  const displayedWindowGeometry =
    windowLayout && floatingWindowEnabled
      ? getWebsiteCompanionWindowDisplayedGeometry(windowLayout, viewport)
      : null;
  const floatingWindowActive = open && floatingWindowEnabled && displayedWindowGeometry !== null;
  const windowMaximized = windowLayout?.isMaximized ?? false;
  const showMaximizeControl =
    floatingWindowActive && shouldShowWebsiteCompanionMaximizeControl(viewport.width);

  const inConversation = messages.some((message) => message.role === "user");
  const contentSignature = `${messages.length}:${sending}:${messages
    .map((message) => message.id)
    .join(",")}`;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    setPointerEventsSupported(isWebsiteCompanionPointerEventsSupported({ window }));
    setStorageAvailable(isWebsiteCompanionLocalStorageAvailable(window.localStorage));
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      const nextViewport = readWebsiteCompanionViewport(window);
      setViewport(nextViewport);
      setViewportOffset(getWebsiteCompanionWindowViewportOffset(window));
      setWindowLayout((current) => {
        if (!current || !isWebsiteCompanionDesktopViewport(nextViewport.width)) {
          return current;
        }
        return reconcileWebsiteCompanionWindowLayoutState(current, nextViewport);
      });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);
    window.visualViewport?.addEventListener("resize", syncViewport);
    window.visualViewport?.addEventListener("scroll", syncViewport);
    return () => {
      window.removeEventListener("resize", syncViewport);
      window.visualViewport?.removeEventListener("resize", syncViewport);
      window.visualViewport?.removeEventListener("scroll", syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!open || !isWebsiteCompanionDesktopViewport(viewport.width)) {
      return;
    }
    setWindowLayout(readWebsiteCompanionWindowLayoutState(window.localStorage, viewport));
  }, [open, viewport.height, viewport.width]);

  const persistWindowLayout = useCallback(
    (layout: CompanionWindowLayoutState) => {
      const reconciled = reconcileWebsiteCompanionWindowLayoutState(layout, viewport);
      setWindowLayout(reconciled);
      if (storageAvailable) {
        writeWebsiteCompanionWindowLayoutState(window.localStorage, reconciled, viewport);
      }
    },
    [storageAvailable, viewport],
  );

  const persistManualGeometry = useCallback(
    (geometry: CompanionWindowGeometry) => {
      persistWindowLayout({
        geometry,
        isMaximized: false,
        restoreState: geometry,
      });
    },
    [persistWindowLayout],
  );

  const handleResetWindowLayout = useCallback(() => {
    clearWebsiteCompanionWindowState(window.localStorage);
    setWindowLayout(getWebsiteCompanionWindowResetLayout(viewport));
  }, [viewport]);

  const handleToggleWindowMaximize = useCallback(() => {
    setWindowLayout((current) => {
      if (!current) return current;
      const nextLayout = current.isMaximized
        ? applyWebsiteCompanionWindowRestore(current, viewport)
        : applyWebsiteCompanionWindowMaximize(current, viewport);
      const reconciled = reconcileWebsiteCompanionWindowLayoutState(nextLayout, viewport);
      if (storageAvailable) {
        writeWebsiteCompanionWindowLayoutState(window.localStorage, reconciled, viewport);
      }
      return reconciled;
    });
  }, [storageAvailable, viewport]);

  const handleWindowDragPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!floatingWindowEnabled || !windowLayout || !displayedWindowGeometry) return;
      if (!shouldAllowWebsiteCompanionWindowDrag(windowLayout)) return;
      if (!canStartWebsiteCompanionWindowDrag(event.target as Element)) return;
      event.preventDefault();

      const session = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin: displayedWindowGeometry,
      };
      dragSessionRef.current = session;

      const onMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== session.pointerId) return;
        const geometry = applyWebsiteCompanionWindowDragDelta(
          session.origin,
          moveEvent.clientX - session.startX,
          moveEvent.clientY - session.startY,
          viewport,
        );
        setWindowLayout((current) =>
          current
            ? {
                ...current,
                geometry,
                isMaximized: false,
              }
            : current,
        );
      };

      const onEnd = (endEvent: PointerEvent) => {
        if (endEvent.pointerId !== session.pointerId) return;
        const finalGeometry = applyWebsiteCompanionWindowDragDelta(
          session.origin,
          endEvent.clientX - session.startX,
          endEvent.clientY - session.startY,
          viewport,
        );
        dragSessionRef.current = null;
        persistManualGeometry(finalGeometry);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
    },
    [
      displayedWindowGeometry,
      floatingWindowEnabled,
      persistManualGeometry,
      viewport,
      windowLayout,
    ],
  );

  const handleWindowResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!floatingWindowEnabled || !windowLayout || !displayedWindowGeometry) return;
      if (!shouldAllowWebsiteCompanionWindowResize(windowLayout)) return;
      event.preventDefault();
      event.stopPropagation();

      const session = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin: displayedWindowGeometry,
      };
      resizeSessionRef.current = session;

      const onMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== session.pointerId) return;
        const geometry = applyWebsiteCompanionWindowResizeDelta(
          session.origin,
          moveEvent.clientX - session.startX,
          moveEvent.clientY - session.startY,
          viewport,
        );
        setWindowLayout((current) =>
          current
            ? {
                ...current,
                geometry,
                isMaximized: false,
              }
            : current,
        );
      };

      const onEnd = (endEvent: PointerEvent) => {
        if (endEvent.pointerId !== session.pointerId) return;
        const finalGeometry = applyWebsiteCompanionWindowResizeDelta(
          session.origin,
          endEvent.clientX - session.startX,
          endEvent.clientY - session.startY,
          viewport,
        );
        resizeSessionRef.current = null;
        persistManualGeometry(finalGeometry);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
    },
    [
      displayedWindowGeometry,
      floatingWindowEnabled,
      persistManualGeometry,
      viewport,
      windowLayout,
    ],
  );

  useEffect(() => {
    if (!open) {
      setPresence("READY");
      return undefined;
    }
    if (sending) {
      setPresence("WORKING");
      return undefined;
    }
    setPresence(inConversation ? "COMPLETED" : "READY");
    return undefined;
  }, [inConversation, open, sending]);

  const applyInitialScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    applyCompanionChatInitialScroll({
      container,
      shouldRestore: false,
      restoreScrollTop: 0,
    });
    initialScrollAppliedRef.current = true;
    setShowJumpToLatest(false);
  }, []);

  useLayoutEffect(() => {
    if (!open || messages.length === 0) {
      initialScrollAppliedRef.current = false;
      setShowJumpToLatest(false);
      return;
    }

    if (!initialScrollAppliedRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => applyInitialScroll());
      });
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const shouldAutoScroll = shouldAutoScrollCompanionChatOnUpdate({
      isNearBottom: isCompanionChatNearBottom(container),
      userJustSentMessage: userJustSentMessageRef.current,
    });
    userJustSentMessageRef.current = false;

    if (shouldAutoScroll) {
      scrollCompanionChatToLatest(container, COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR);
      setShowJumpToLatest(false);
      return;
    }

    setShowJumpToLatest(true);
  }, [applyInitialScroll, contentSignature, messages.length, open, sending]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setShowJumpToLatest(!isCompanionChatNearBottom(container));
  }, []);

  const jumpToLatestMessage = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    scrollCompanionChatToLatest(container, COMPANION_CHAT_INITIAL_SCROLL_BEHAVIOR);
    setShowJumpToLatest(false);
  }, []);

  const submitQuestion = useCallback(
    async (
      question: string,
      priorMessages: WebsiteCompanionChatMessage[],
      options?: { appendUserMessage?: boolean; replaceFailedMessageId?: string },
    ) => {
      const validation = validateWebsiteCompanionQuestion(question);
      if (!validation.valid || sending) return;

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      const appendUserMessage = options?.appendUserMessage ?? true;
      const userMessage: WebsiteCompanionChatMessage = {
        id: createMessageId(),
        role: "user",
        text: validation.question,
      };

      setMessages((current) => {
        const withoutFailed = options?.replaceFailedMessageId
          ? current.filter((message) => message.id !== options.replaceFailedMessageId)
          : current;
        return appendUserMessage ? [...withoutFailed, userMessage] : withoutFailed;
      });
      setDraft("");
      setSending(true);
      userJustSentMessageRef.current = true;

      const body = buildWebsiteCompanionAskBody({
        question: validation.question,
        locale,
        messages: priorMessages,
        pageContext: collectWebsiteCompanionPageContext(
          typeof window !== "undefined" ? window : undefined,
        ),
        domain: collectWebsiteCompanionVisitorDomain(
          typeof window !== "undefined" ? window : undefined,
        ),
      });

      try {
        const response = await fetch("/api/marketing/companion/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("request failed");
        }

        const payload = (await response.json()) as PublicCompanionAskResponse;
        if (requestIdRef.current !== requestId) return;

        const assistantMessage: WebsiteCompanionChatMessage = {
          id: createMessageId(),
          role: "assistant",
          ...mapWebsiteCompanionApiResponse(payload),
        };
        setMessages((current) => [...current, assistantMessage]);
      } catch {
        if (requestIdRef.current !== requestId) return;
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "assistant",
            failed: true,
            retryQuestion: validation.question,
          },
        ]);
      } finally {
        if (requestIdRef.current === requestId) {
          setSending(false);
        }
      }
    },
    [locale, sending],
  );

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      if (!shouldAllowWebsiteCompanionSend({ question: draft, sending })) return;
      await submitQuestion(draft, messages);
    },
    [draft, messages, sending, submitQuestion],
  );

  const handleRetry = useCallback(
    async (retryQuestion: string, failedMessageId: string) => {
      const withoutFailed = messages.filter((message) => message.id !== failedMessageId);
      await submitQuestion(retryQuestion, withoutFailed, {
        appendUserMessage: false,
        replaceFailedMessageId: failedMessageId,
      });
    },
    [messages, submitQuestion],
  );

  const style = WEBSITE_COMPANION_PRESENCE_STYLES[presence];
  const stateLabel = websiteCompanionPresenceLabel(states, presence);
  const ringAnimation = reducedMotion ? "" : style.ringAnimation;
  const remainingCharacters = WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH - draft.length;
  const publicLinksEnabled = isCompanionPublicLinksEnabled();
  const toggleLabel = open
    ? chat.close.replace("{title}", title)
    : chat.open.replace("{title}", title);

  const resetWindowLabel = getWebsiteCompanionWindowResetLabel(locale);
  const maximizeAriaLabel = getWebsiteCompanionWindowMaximizeAriaLabel(locale);
  const restoreAriaLabel = getWebsiteCompanionWindowRestoreAriaLabel(locale);

  const panelBody = (
    <>
      <div
        data-companion-window-drag-handle
        onPointerDown={handleWindowDragPointerDown}
        className={`shrink-0 border-b border-aipify-border px-4 py-3 ${
          floatingWindowActive && !windowMaximized
            ? "cursor-grab touch-none active:cursor-grabbing"
            : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-aipify-text">{title}</p>
            <p className="mt-1 text-xs text-aipify-text-secondary">{prompt}</p>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-aipify-text-muted">
              {presenceLabel}: <span className="text-aipify-companion">{stateLabel}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1" data-companion-window-no-drag>
            {showMaximizeControl ? (
              <button
                type="button"
                data-companion-window-maximize-control
                onClick={handleToggleWindowMaximize}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-aipify-text-secondary hover:bg-aipify-surface-muted"
                aria-label={windowMaximized ? restoreAriaLabel : maximizeAriaLabel}
              >
                {windowMaximized ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    className="text-current"
                  >
                    <rect x="1.5" y="3.5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" />
                    <path d="M5 1.5H11.5V8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                    className="text-current"
                  >
                    <rect x="2.5" y="2.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.25" />
                  </svg>
                )}
              </button>
            ) : null}
            {floatingWindowActive ? (
              <button
                type="button"
                onClick={handleResetWindowLayout}
                className="rounded-full px-2 py-1 text-[11px] font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted"
              >
                {resetWindowLabel}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-2 py-1 text-xs font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted"
              aria-label={chat.close.replace("{title}", title)}
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-3"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-aipify-surface-muted/70 px-3 py-3 text-sm text-aipify-text-secondary">
            {chat.welcome}
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-aipify-text-muted">
              {chat.quickLinks}
            </p>
            <ul className="space-y-1">
              {actions.map((action) => (
                <li key={action.id}>
                  <Link
                    href={action.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-2 py-2 hover:bg-aipify-surface-muted"
                  >
                    <span className="text-sm font-medium text-aipify-companion">{action.label}</span>
                    <span className="mt-0.5 block text-xs text-aipify-text-secondary">
                      {action.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {messages.map((message) => {
            if (message.role === "user") {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[92%] rounded-2xl rounded-br-md bg-aipify-companion px-3 py-2 text-sm text-white">
                    {message.text}
                  </div>
                </div>
              );
            }

            if ("failed" in message && message.failed) {
              return (
                <div key={message.id} className="flex justify-start">
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-aipify-border bg-aipify-surface px-3 py-3">
                    <p className="text-sm text-aipify-text-secondary">{chat.genericError}</p>
                    <button
                      type="button"
                      onClick={() => void handleRetry(message.retryQuestion, message.id)}
                      className="mt-3 inline-flex min-h-9 items-center rounded-full border border-aipify-border px-3 py-1.5 text-xs font-medium text-aipify-companion hover:bg-aipify-surface-muted"
                      disabled={sending}
                    >
                      {chat.retry}
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className="flex justify-start">
                <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-aipify-border bg-aipify-surface px-3 py-3">
                  <AssistantAnswerBody message={message} sourcesLabel={chat.sources} />
                </div>
              </div>
            );
          })}

          {sending ? (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-aipify-border bg-aipify-surface px-3 py-3">
                <AipifyLoader size="sm" centered={false} label="" className="justify-start" />
                <span className="sr-only">{chat.sending}</span>
              </div>
            </div>
          ) : null}

          {showJumpToLatest ? (
            <div className="sticky bottom-2 flex justify-center">
              <button
                type="button"
                onClick={jumpToLatestMessage}
                className="inline-flex min-h-9 items-center rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-medium text-aipify-companion shadow-sm hover:bg-violet-50"
                aria-label={chat.goToLatestAria}
              >
                {chat.goToLatest}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="shrink-0 border-t border-aipify-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        data-companion-window-no-drag
      >
        <label htmlFor={inputId} className="sr-only">
          {chat.inputPlaceholder}
        </label>
        <textarea
          id={inputId}
          value={draft}
          onChange={(event) =>
            setDraft(event.target.value.slice(0, WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH))
          }
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleSubmit();
            }
          }}
          rows={2}
          placeholder={chat.inputPlaceholder}
          disabled={sending}
          className="w-full resize-none rounded-xl border border-aipify-border bg-aipify-surface px-3 py-2 text-sm text-aipify-text outline-none ring-aipify-focus placeholder:text-aipify-text-muted focus:ring-2 disabled:opacity-60"
        />
        {publicLinksEnabled ? (
          <div className="mt-2 flex min-w-0 max-w-full flex-wrap gap-2">
            <a
              href={COMPANION_PUBLIC_LINK_BUSINESS_PACKS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full min-h-8 shrink-0 items-center rounded-xl border border-aipify-border bg-aipify-surface px-3 py-1.5 text-xs font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted"
            >
              <span className="truncate">{chat.publicLinks.businessPacks}</span>
            </a>
            <a
              href={COMPANION_PUBLIC_LINK_BECOME_PARTNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full min-h-8 shrink-0 items-center rounded-xl border border-aipify-border bg-aipify-surface px-3 py-1.5 text-xs font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted"
            >
              <span className="truncate">{chat.publicLinks.becomePartner}</span>
            </a>
          </div>
        ) : null}
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[11px] text-aipify-text-muted">
            {formatWebsiteCompanionCharactersRemaining(chat.charactersRemaining, remainingCharacters)}
          </p>
          <button
            type="submit"
            disabled={!shouldAllowWebsiteCompanionSend({ question: draft, sending })}
            className="inline-flex min-h-10 items-center rounded-full bg-aipify-companion px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={chat.sendAria}
          >
            {sending ? chat.sending : chat.send}
          </button>
        </div>
      </form>

      {floatingWindowActive && !windowMaximized ? (
        <button
          type="button"
          aria-label={locale === "no" ? "Juster vindusstørrelse" : "Adjust window size"}
          data-companion-window-resize-handle
          onPointerDown={handleWindowResizePointerDown}
          className="absolute bottom-0 right-0 z-10 h-5 w-5 touch-none cursor-nwse-resize rounded-br-2xl text-aipify-text-muted hover:text-aipify-companion"
        >
          <span
            aria-hidden="true"
            className="absolute bottom-1.5 right-1.5 block h-2.5 w-2.5 border-b-2 border-r-2 border-current"
          />
        </button>
      ) : null}
    </>
  );

  return (
    <>
      {open && floatingWindowActive && displayedWindowGeometry ? (
        <div
          className="fixed z-40 flex flex-col overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg"
          style={{
            left: displayedWindowGeometry.x + viewportOffset.x,
            top: displayedWindowGeometry.y + viewportOffset.y,
            width: displayedWindowGeometry.width,
            height: displayedWindowGeometry.height,
          }}
        >
          <div className="relative flex min-h-0 flex-1 flex-col">{panelBody}</div>
        </div>
      ) : null}

      <div className="fixed bottom-4 right-4 z-50 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] sm:bottom-6 sm:right-6">
        {open && !floatingWindowActive ? (
          <div className="mb-3 flex w-[min(100vw-2rem,26rem)] max-h-[min(78vh,40rem)] flex-col overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg sm:w-[min(100vw-3rem,27.5rem)]">
            {panelBody}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={`relative flex h-12 w-12 items-center justify-center rounded-full border bg-aipify-surface shadow-lg transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-aipify-focus ${style.buttonRing}`}
          aria-expanded={open}
          aria-label={`${toggleLabel} — ${stateLabel}`}
          title={`${title} — ${stateLabel}`}
        >
          <span
            className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br ${style.ring} blur-md ${ringAnimation}`}
            aria-hidden="true"
          />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-aipify-surface">
            <AipifyPulse size={28} variant="gradient" title={title} aria-label={title} />
          </span>
          <span className="sr-only">{`${presenceLabel}: ${stateLabel}`}</span>
        </button>
      </div>
    </>
  );
}
