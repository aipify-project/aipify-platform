"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AipifyCompanionLauncherIcon } from "@/components/branding/AipifyCompanionLauncherIcon";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { CompanionLauncherIconEmbedConfig } from "@/lib/branding/companion-launcher-icon";
import type { PublicCompanionAskResponse } from "@/lib/marketing/public-companion-ask";
import {
  buildWebsiteKompisAskPayload,
  buildWebsiteKompisMetadataRequestPath,
  parseWebsiteKompisEmbedPageContextMessage,
  parseWebsiteKompisEmbedSessionMessage,
  WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REQUEST_MESSAGE_TYPE,
  WEBSITE_KOMPIS_EMBED_SESSION_HEADER,
  type WebsiteKompisEmbedLocale,
  type WebsiteKompisEmbedRecentContextMessage,
} from "@/lib/marketing/website-kompis-embed";
import type { WebsiteKompisPublicPageContext } from "@/lib/marketing/website-kompis-public-page-context";
import { shouldHideWebsiteKompisLauncherFromEmbedMetadata } from "@/lib/marketing/website-kompis-launcher-visibility";
import {
  resolveWebsiteKompisEmbedUiLabels,
  type WebsiteKompisEmbedUiLabels,
} from "@/lib/marketing/website-kompis-visitor-tone";
import {
  mapWebsiteCompanionApiResponse,
  validateWebsiteCompanionQuestion,
  WEBSITE_COMPANION_CHAT_MAX_QUESTION_LENGTH,
} from "@/lib/marketing/website-companion-chat";

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; text: string; failed?: false }
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
  const [metadata, setMetadata] = useState<CompanionLauncherIconEmbedConfig | null>(null);
  const [metadataState, setMetadataState] = useState<"loading" | "ready" | "error">("loading");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [pageContext, setPageContext] = useState<WebsiteKompisPublicPageContext | undefined>(
    undefined,
  );
  const embedSessionRef = useRef<string | null>(null);
  const [embedSessionReady, setEmbedSessionReady] = useState(false);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.source !== window.parent) {
        return;
      }

      const nextSession = parseWebsiteKompisEmbedSessionMessage(event.data);
      if (nextSession) {
        embedSessionRef.current = nextSession.embedSession;
        setEmbedSessionReady(true);
      }

      const nextPageContext = parseWebsiteKompisEmbedPageContextMessage(event.data);
      if (nextPageContext) {
        setPageContext(nextPageContext);
      }
    }

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REQUEST_MESSAGE_TYPE }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!embedSessionReady || !embedSessionRef.current) {
      return;
    }

    let cancelled = false;

    async function loadMetadata() {
      setMetadataState("loading");
      try {
        const response = await fetch(
          buildWebsiteKompisMetadataRequestPath({ installId, domain }),
          {
            headers: {
              [WEBSITE_KOMPIS_EMBED_SESSION_HEADER]: embedSessionRef.current ?? "",
            },
          },
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
  }, [domain, embedSessionReady, installId]);

  const hidden = shouldHideWebsiteKompisLauncherFromEmbedMetadata(metadata);
  const unavailable = metadataState === "error" || (metadataState === "ready" && hidden);
  const labels: WebsiteKompisEmbedUiLabels = resolveWebsiteKompisEmbedUiLabels({
    locale,
    welcomeMessageVariant: metadata?.welcomeMessageVariant,
  });

  const submitQuestion = useCallback(
    async (question: string, priorMessages: ChatMessage[]) => {
      const validation = validateWebsiteCompanionQuestion(question);
      if (!validation.valid || sending) return;

      const userMessage: ChatMessage = {
        id: createMessageId(),
        role: "user",
        text: validation.question,
      };

      setMessages((current) => [...current, userMessage]);
      setDraft("");
      setSending(true);

      try {
        const sessionHeaders: HeadersInit = { "Content-Type": "application/json" };
        if (embedSessionRef.current) {
          sessionHeaders[WEBSITE_KOMPIS_EMBED_SESSION_HEADER] = embedSessionRef.current;
        }

        const response = await fetch("/api/marketing/companion/ask", {
          method: "POST",
          headers: sessionHeaders,
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
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      if (sending || !draft.trim()) return;
      await submitQuestion(draft, messages);
    },
    [draft, messages, sending, submitQuestion],
  );

  if (metadataState === "loading" || !embedSessionReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <AipifyLoader size="sm" centered={false} label="" />
      </div>
    );
  }

  if (unavailable) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-4">
        <p className="rounded-lg border border-aipify-border bg-aipify-surface px-4 py-3 text-sm text-aipify-text-secondary">
          {labels.unavailable}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh w-full">
      {open ? (
        <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col overflow-hidden rounded-t-2xl border border-aipify-border bg-aipify-surface shadow-lg">
          <header className="flex items-center justify-between border-b border-aipify-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-aipify-text">{labels.title}</p>
              <p className="text-xs text-aipify-text-secondary">{labels.prompt}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-aipify-border px-3 py-1 text-xs font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted"
              aria-label={labels.close}
            >
              {labels.close}
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message) => {
              if ("failed" in message && message.failed) {
                return (
                  <div key={message.id} className="flex justify-start">
                    <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-aipify-border bg-aipify-surface px-3 py-3">
                      <p className="text-sm text-aipify-text-secondary">{labels.error}</p>
                      <button
                        type="button"
                        onClick={() => void submitQuestion(message.retryQuestion, messages.filter((m) => m.id !== message.id))}
                        className="mt-2 text-xs font-medium text-aipify-companion hover:underline"
                        disabled={sending}
                      >
                        {labels.send}
                      </button>
                    </div>
                  </div>
                );
              }

              const isUser = message.role === "user";
              return (
                <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[92%] rounded-2xl px-3 py-3 text-sm whitespace-pre-wrap ${
                      isUser
                        ? "rounded-br-md bg-aipify-companion text-white"
                        : "rounded-bl-md border border-aipify-border bg-aipify-surface text-aipify-text"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            })}

            {sending ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-aipify-border bg-aipify-surface px-3 py-3">
                  <AipifyLoader size="sm" centered={false} label="" />
                  <span className="sr-only">{labels.sending}</span>
                </div>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="border-t border-aipify-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <label htmlFor={inputId} className="sr-only">
              {labels.placeholder}
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
              placeholder={labels.placeholder}
              disabled={sending}
              className="w-full resize-none rounded-xl border border-aipify-border bg-aipify-surface px-3 py-2 text-sm text-aipify-text outline-none ring-aipify-focus placeholder:text-aipify-text-muted focus:ring-2 disabled:opacity-60"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="inline-flex min-h-10 items-center rounded-full bg-aipify-companion px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? labels.sending : labels.send}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="fixed bottom-4 right-4 z-50 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-aipify-border bg-aipify-surface shadow-lg transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-aipify-focus"
          aria-expanded={open}
          aria-label={open ? labels.close : labels.open}
          title={labels.title}
        >
          <AipifyCompanionLauncherIcon size={40} availabilityRing title={labels.title} ariaLabel={labels.title} />
        </button>
      </div>
    </div>
  );
}
