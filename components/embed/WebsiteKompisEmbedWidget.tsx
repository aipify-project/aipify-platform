"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type UIEvent,
} from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { CompanionLauncherIconEmbedConfig } from "@/lib/branding/companion-launcher-icon";
import {
  isCompanionChatNearBottom,
  scrollCompanionChatToLatest,
  shouldAutoScrollCompanionChatOnUpdate,
} from "@/lib/app/companion/companion-chat-scroll-policy";
import type { PublicCompanionAskResponse } from "@/lib/marketing/public-companion-ask";
import {
  buildWebsiteKompisAskPayload,
  buildWebsiteKompisEmbedResizeMessage,
  buildWebsiteKompisMetadataRequestPath,
  parseWebsiteKompisEmbedPageContextMessage,
  WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX,
  WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX,
  WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REQUEST_MESSAGE_TYPE,
  type WebsiteKompisEmbedLocale,
  type WebsiteKompisEmbedRecentContextMessage,
} from "@/lib/marketing/website-kompis-embed";
import type { WebsiteKompisPublicPageContext } from "@/lib/marketing/website-kompis-public-page-context";
import { shouldHideWebsiteKompisLauncherFromEmbedMetadata } from "@/lib/marketing/website-kompis-launcher-visibility";
import {
  resolveWebsiteKompisEmbedUiLabels,
  WEBSITE_KOMPIS_DESIGN_V1_ASSET_BASE,
  type WebsiteKompisEmbedUiLabels,
} from "@/lib/marketing/website-kompis-visitor-tone";
import {
  mapWebsiteCompanionApiResponse,
  validateWebsiteCompanionQuestion,
  WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH,
  type WebsiteCompanionUiSource,
} from "@/lib/marketing/website-companion-chat";
import {
  AkIconArrowUp,
  AkIconChevronRight,
  AkIconClose,
  AkIconDocument,
  AkIconExternalLink,
  AkIconMinimize,
  AkIconRocket,
} from "@/components/embed/website-kompis-design-icons";
import "@/components/embed/website-kompis-design-v1.css";

const DESIGN_LOGO_SRC = `${WEBSITE_KOMPIS_DESIGN_V1_ASSET_BASE}/brand/aipify-logo-dark.svg`;
const DESIGN_MARK_SRC = `${WEBSITE_KOMPIS_DESIGN_V1_ASSET_BASE}/brand/aipify-mark.svg`;
const DESIGN_AVATAR_SRC = `${WEBSITE_KOMPIS_DESIGN_V1_ASSET_BASE}/images/aipify-kompis-avatar.svg`;

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      sources?: WebsiteCompanionUiSource[];
      failed?: false;
    }
  | { id: string; role: "assistant"; failed: true; retryQuestion: string };

function createMessageId(): string {
  return `embed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toRecentContext(messages: ChatMessage[]): WebsiteKompisEmbedRecentContextMessage[] {
  return messages
    .filter(
      (message): message is Extract<ChatMessage, { role: "user" } | { role: "assistant"; failed?: false }> =>
        message.role === "user" || (message.role === "assistant" && !("failed" in message && message.failed)),
    )
    .slice(-6)
    .map((message) => ({
      role: message.role,
      text: message.text.trim(),
    }))
    .filter((entry) => entry.text.length > 0);
}

function resolveParentPostMessageOrigin(): string {
  if (typeof document === "undefined") {
    return "*";
  }
  try {
    const referrer = document.referrer?.trim();
    if (!referrer) {
      return "*";
    }
    return new URL(referrer).origin;
  } catch {
    return "*";
  }
}

function postResizeToParent(open: boolean) {
  if (typeof window === "undefined" || window.parent === window) {
    return;
  }
  window.parent.postMessage(
    buildWebsiteKompisEmbedResizeMessage(open),
    resolveParentPostMessageOrigin(),
  );
}

function resizeComposerTextarea(element: HTMLTextAreaElement | null) {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${Math.min(element.scrollHeight, 112)}px`;
}

function renderMessageParagraphs(text: string) {
  const parts = text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) {
    return <p>{text}</p>;
  }
  return parts.map((part, index) => (
    <p key={`${index}-${part.slice(0, 12)}`}>{part}</p>
  ));
}

export function WebsiteKompisEmbedWidget({
  installId,
  domain,
  locale,
}: {
  installId: string;
  domain: string;
  locale: WebsiteKompisEmbedLocale;
}) {
  const inputId = useId();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottomRef = useRef(true);
  const userJustSentRef = useRef(false);
  const savedScrollTopRef = useRef<number | null>(null);
  const [metadata, setMetadata] = useState<CompanionLauncherIconEmbedConfig | null>(null);
  const [metadataState, setMetadataState] = useState<"loading" | "ready" | "error">("loading");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [pageContext, setPageContext] = useState<WebsiteKompisPublicPageContext | undefined>(
    undefined,
  );

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.source !== window.parent) {
        return;
      }

      const nextPageContext = parseWebsiteKompisEmbedPageContextMessage(event.data);
      if (nextPageContext) {
        setPageContext(nextPageContext);
      }
    }

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REQUEST_MESSAGE_TYPE }, "*");
    postResizeToParent(false);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    postResizeToParent(open);
  }, [open]);

  useEffect(() => {
    let cancelled = false;

    async function loadMetadata() {
      setMetadataState("loading");
      try {
        const response = await fetch(
          buildWebsiteKompisMetadataRequestPath({ installId, domain }),
        );
        if (!response.ok) {
          throw new Error("metadata request failed");
        }
        const payload = (await response.json()) as CompanionLauncherIconEmbedConfig;
        if (cancelled) return;
        setMetadata(payload);
        setMetadataState("ready");
      } catch {
        if (cancelled) return;
        setMetadata(null);
        setMetadataState("error");
      }
    }

    void loadMetadata();
    return () => {
      cancelled = true;
    };
  }, [domain, installId]);

  useEffect(() => {
    resizeComposerTextarea(textareaRef.current);
  }, [draft, open]);

  const contentSignature = `${messages.length}:${sending ? "1" : "0"}:${messages.at(-1)?.id ?? "none"}`;

  useLayoutEffect(() => {
    if (!open) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    if (savedScrollTopRef.current !== null) {
      container.scrollTop = savedScrollTopRef.current;
      savedScrollTopRef.current = null;
      stickToBottomRef.current = isCompanionChatNearBottom(container);
      userJustSentRef.current = false;
      return;
    }

    const shouldScroll = shouldAutoScrollCompanionChatOnUpdate({
      isNearBottom: stickToBottomRef.current,
      userJustSentMessage: userJustSentRef.current,
    });
    if (shouldScroll) {
      const latest = latestMessageRef.current;
      if (latest && latest.offsetHeight > container.clientHeight * 0.7) {
        // Long new reply: keep the start readable; user can scroll the rest.
        latest.scrollIntoView({ block: "start", inline: "nearest" });
      } else {
        scrollCompanionChatToLatest(container, "instant");
      }
      stickToBottomRef.current = true;
    }
    userJustSentRef.current = false;
  }, [contentSignature, open]);

  const handleConversationScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    stickToBottomRef.current = isCompanionChatNearBottom(event.currentTarget);
  }, []);

  const hidden = shouldHideWebsiteKompisLauncherFromEmbedMetadata(metadata);
  const unavailable = metadataState === "error" || (metadataState === "ready" && hidden);
  const labels: WebsiteKompisEmbedUiLabels = resolveWebsiteKompisEmbedUiLabels({
    locale,
    welcomeMessageVariant: metadata?.welcomeMessageVariant,
  });

  const fillDraft = useCallback((text: string) => {
    setDraft(text.slice(0, WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH));
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      resizeComposerTextarea(textareaRef.current);
    });
  }, []);

  const submitQuestion = useCallback(
    async (question: string, priorMessages: ChatMessage[]) => {
      const validation = validateWebsiteCompanionQuestion(question);
      if (!validation.valid || sending) return;

      const userMessage: ChatMessage = {
        id: createMessageId(),
        role: "user",
        text: validation.question,
      };

      userJustSentRef.current = true;
      stickToBottomRef.current = true;
      setMessages((current) => [...current, userMessage]);
      setDraft("");
      setSending(true);

      try {
        const response = await fetch("/api/marketing/companion/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            buildWebsiteKompisAskPayload({
              question: validation.question,
              locale,
              domain,
              installId,
              recentContext: toRecentContext(priorMessages),
              pageContext,
            }),
          ),
        });

        if (!response.ok) {
          throw new Error("ask request failed");
        }

        const payload = (await response.json()) as PublicCompanionAskResponse;
        const mapped = mapWebsiteCompanionApiResponse(payload);
        const answerParts = [mapped.directAnswer.trim()];
        if (mapped.explanation?.trim()) answerParts.push(mapped.explanation.trim());
        for (const step of mapped.steps) {
          if (step.trim()) answerParts.push(step.trim());
        }

        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "assistant",
            text: answerParts.join("\n\n"),
            sources: mapped.sources,
          },
        ]);
      } catch {
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
        setSending(false);
      }
    },
    [domain, installId, locale, pageContext, sending],
  );

  const handleSubmit = useCallback(
    async (event?: FormEvent) => {
      event?.preventDefault();
      if (sending || !draft.trim()) return;
      await submitQuestion(draft, messages);
    },
    [draft, messages, sending, submitQuestion],
  );

  const handleClose = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      savedScrollTopRef.current = container.scrollTop;
    }
    setOpen(false);
  }, []);

  const handleOpenToggle = useCallback(() => {
    setOpen((value) => {
      if (value) {
        const container = scrollContainerRef.current;
        if (container) {
          savedScrollTopRef.current = container.scrollTop;
        }
        return false;
      }
      stickToBottomRef.current = true;
      return true;
    });
  }, []);

  if (metadataState === "loading") {
    return (
      <div
        className="ml-auto flex items-end justify-end bg-transparent p-2"
        style={{
          width: WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX,
          height: WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX,
        }}
      >
        <AipifyLoader size="sm" centered={false} label="" />
      </div>
    );
  }

  if (unavailable) {
    return <div className="h-full w-full bg-transparent" aria-hidden />;
  }

  const lastMessageId = messages.at(-1)?.id;

  return (
    <div
      className={`relative bg-transparent ${
        open ? "h-full w-full" : "ml-auto mt-auto"
      }`}
      style={
        open
          ? undefined
          : {
              width: WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX,
              height: WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX,
            }
      }
    >
      {open ? (
        <div className="ak-widget absolute inset-0">
          <header className="ak-header">
            <img className="ak-logo" src={DESIGN_LOGO_SRC} alt="Aipify" width={115} height={30} />
            <span className="ak-name">{labels.productName}</span>
            <div className="ak-controls">
              <button
                type="button"
                className="ak-icon-button"
                onClick={handleClose}
                aria-label={labels.minimize}
              >
                <AkIconMinimize />
              </button>
              <button
                type="button"
                className="ak-icon-button"
                onClick={handleClose}
                aria-label={labels.close}
              >
                <AkIconClose />
              </button>
            </div>
          </header>

          <div
            ref={scrollContainerRef}
            onScroll={handleConversationScroll}
            className="ak-scroll"
          >
            {messages.length === 0 ? (
              <section className="ak-welcome">
                <img className="ak-hero" src={DESIGN_AVATAR_SRC} alt="" width={136} height={136} />
                <h1>{labels.greeting}</h1>
                <p>{labels.greetingSupport}</p>
                <div className="ak-quick-list">
                  {labels.quickActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      className="ak-quick"
                      onClick={() => fillDraft(action.draft)}
                      disabled={sending}
                    >
                      {action.id === "get_started" ? <AkIconRocket /> : <AkIconDocument />}
                      <span>{action.label}</span>
                      <AkIconChevronRight className="ak-icon ak-chevron" />
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <div className="ak-messages" role="log" aria-live="polite" aria-relevant="additions text">
                {messages.map((message) => {
                  const isLatest = message.id === lastMessageId;
                  if ("failed" in message && message.failed) {
                    return (
                      <div
                        key={message.id}
                        className="ak-row"
                        ref={isLatest ? latestMessageRef : undefined}
                      >
                        <img className="ak-avatar" src={DESIGN_AVATAR_SRC} alt="" width={36} height={36} />
                        <div className="ak-bubble">
                          <p className="ak-error" style={{ margin: 0 }}>
                            {labels.error}
                          </p>
                          <button
                            type="button"
                            className="ak-followup"
                            style={{ marginTop: 10 }}
                            onClick={() =>
                              void submitQuestion(
                                message.retryQuestion,
                                messages.filter((m) => m.id !== message.id),
                              )
                            }
                            disabled={sending}
                          >
                            {labels.send}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const isUser = message.role === "user";
                  const sources =
                    message.role === "assistant" && "sources" in message
                      ? message.sources
                      : undefined;

                  return (
                    <div
                      key={message.id}
                      className={`ak-row${isUser ? " ak-row--user" : ""}`}
                      ref={isLatest ? latestMessageRef : undefined}
                    >
                      {!isUser ? (
                        <img className="ak-avatar" src={DESIGN_AVATAR_SRC} alt="" width={36} height={36} />
                      ) : null}
                      <div className={`ak-bubble${isUser ? " ak-bubble--user" : ""}`}>
                        {renderMessageParagraphs(message.text)}
                        {sources && sources.length > 0
                          ? sources.map((source) =>
                              source.href ? (
                                <a
                                  key={`${source.title}-${source.href}`}
                                  className="ak-source"
                                  href={source.href}
                                  target="_blank"
                                  rel="noopener noreferrer nofollow"
                                >
                                  <AkIconDocument />
                                  <span className="ak-source-copy">
                                    <strong>{source.title}</strong>
                                    <small>{labels.sourceFromSite}</small>
                                  </span>
                                  <AkIconExternalLink className="ak-icon ak-external" />
                                </a>
                              ) : (
                                <div
                                  key={`${source.title}-nolink`}
                                  className="ak-source"
                                  style={{ cursor: "default" }}
                                >
                                  <AkIconDocument />
                                  <span className="ak-source-copy">
                                    <strong>{source.title}</strong>
                                    <small>{labels.sourceFromSite}</small>
                                  </span>
                                </div>
                              ),
                            )
                          : null}
                      </div>
                    </div>
                  );
                })}

                {sending ? (
                  <div className="ak-row" ref={latestMessageRef}>
                    <img className="ak-avatar" src={DESIGN_AVATAR_SRC} alt="" width={36} height={36} />
                    <div className="ak-bubble">
                      <AipifyLoader size="sm" centered={false} label="" />
                      <p className="ak-status ak-sr-only">{labels.sending}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="ak-composer-area">
            <form className="ak-composer" onSubmit={(event) => void handleSubmit(event)}>
              <label htmlFor={inputId} className="ak-sr-only">
                {labels.placeholder}
              </label>
              <textarea
                ref={textareaRef}
                id={inputId}
                className="ak-input"
                value={draft}
                rows={1}
                placeholder={labels.placeholder}
                disabled={sending}
                onChange={(event) =>
                  setDraft(event.target.value.slice(0, WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    void handleSubmit();
                  }
                }}
              />
              <button
                type="submit"
                className="ak-send"
                disabled={sending || !draft.trim()}
                aria-label={sending ? labels.sending : labels.send}
              >
                <AkIconArrowUp />
              </button>
            </form>
            <p className="ak-credit">{labels.credit}</p>
          </div>
        </div>
      ) : null}

      <div
        className={`absolute bottom-0 right-0 z-50 flex h-full w-full items-center justify-center ${
          open ? "pointer-events-none opacity-0" : ""
        }`}
        aria-hidden={open}
      >
        <button
          type="button"
          className="ak-launcher"
          onClick={handleOpenToggle}
          aria-expanded={open}
          aria-label={labels.open}
          title={labels.title}
          tabIndex={open ? -1 : 0}
        >
          <img src={DESIGN_MARK_SRC} alt="" width={36} height={36} />
        </button>
      </div>
    </div>
  );
}
