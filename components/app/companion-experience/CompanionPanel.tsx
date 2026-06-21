"use client";

import Link from "next/link";
import {
  COMPANION_CAPABILITY_IDS,
  COMPANION_CONVERSATIONS_STORAGE_KEY,
  COMPANION_EXPERIENCE_ROUTE,
  COMPANION_QUICK_ACTION_IDS,
  resolveCompanionPageLabelKey,
  resolveCompanionSuggestions,
  resolveQuickActionHref,
  type CompanionQuickActionId,
} from "@/lib/app/companion";
import {
  parseSupportAssistantSearch,
  SUPPORT_ASSISTANT_CONTEXT_STORAGE_KEY,
  type SupportAssistantArticle,
} from "@/lib/app-portal/support-assistant";
import type { CompanionChatMessage, CompanionConversationPreview, CompanionExperienceLabels } from "@/lib/app/companion/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { CompanionIcon } from "./CompanionIcon";
import { CompanionQuickActions } from "./CompanionQuickActions";
import { CompanionChat } from "./CompanionChat";

const QUICK_ACTION_ICONS: Record<CompanionQuickActionId, string> = {
  orgStatus: "◉",
  recentEvents: "◎",
  integrations: "⬡",
  supportCases: "✉",
  customerSuccess: "★",
  knowledgeFaq: "?",
  securityAccess: "⛨",
  whatNow: "→",
};

type CompanionPanelProps = {
  labels: CompanionExperienceLabels;
  locale: string;
  pathname: string;
  mode: "drawer" | "fullpage";
  onClose?: () => void;
};

function loadRecentConversations(): CompanionConversationPreview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPANION_CONVERSATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CompanionConversationPreview[];
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function saveRecentConversation(entry: CompanionConversationPreview) {
  const existing = loadRecentConversations().filter((c) => c.id !== entry.id);
  const next = [entry, ...existing].slice(0, 8);
  localStorage.setItem(COMPANION_CONVERSATIONS_STORAGE_KEY, JSON.stringify(next));
}

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CompanionPanel({
  labels,
  locale,
  pathname,
  mode,
  onClose,
}: CompanionPanelProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<CompanionChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [recentConversations, setRecentConversations] = useState<CompanionConversationPreview[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const profileCtx = useOptionalDashboardProfile();
  const orgName = profileCtx?.profile?.company.name ?? labels.orgNameFallback;
  const roleDisplay = profileCtx?.profile
    ? labels.roleLabel.replace("{role}", profileCtx.profile.user.role)
    : labels.roleFallback;
  const pageLabelKey = resolveCompanionPageLabelKey(pathname);
  const pageLabel = labels.contextPages[pageLabelKey] ?? labels.contextPages.default;
  const routeSuggestions = useMemo(() => resolveCompanionSuggestions(pathname), [pathname]);

  useEffect(() => {
    setRecentConversations(loadRecentConversations());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askQuestion = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || loading) return;

      setError(false);
      setShowSuggestions(false);
      const userMessage: CompanionChatMessage = {
        id: createMessageId(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setQuery("");
      setLoading(true);

      try {
        const params = new URLSearchParams({ q: trimmed });
        const res = await fetch(`/api/aipify/support-assistant/search?${params}`);
        if (!res.ok) throw new Error("search failed");
        const parsed = parseSupportAssistantSearch(await res.json());
        const article = parsed.articles[0];

        const reply = article
          ? buildArticleReply(article, labels)
          : {
              id: createMessageId(),
              role: "aipify" as const,
              content: labels.noResults,
              timestamp: Date.now(),
              ctas: [
                { label: labels.createSupportRequest, href: "/app/support/requests?from=companion" },
                { label: labels.contextPages.support, href: "/app/support/knowledge" },
              ],
            };

        setMessages((prev) => [...prev, reply]);
        saveRecentConversation({
          id: `conv-${Date.now()}`,
          title: trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed,
          preview: article?.summary ?? labels.noResults,
          pinned: false,
          updatedAt: Date.now(),
        });
        setRecentConversations(loadRecentConversations());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [loading, labels]
  );

  function buildArticleReply(
    article: SupportAssistantArticle,
    lbls: CompanionExperienceLabels
  ): CompanionChatMessage {
    const ctas = [
      { label: lbls.createSupportRequest, href: "/app/support/requests?from=companion" },
    ];
    if (article.related_module) {
      ctas.unshift({ label: lbls.viewSuggestions, href: `/app/support/knowledge` });
    }
    return {
      id: createMessageId(),
      role: "aipify",
      content: article.summary,
      steps: article.steps,
      ctas,
      timestamp: Date.now(),
    };
  }

  function startNewConversation() {
    setMessages([]);
    setQuery("");
    setShowSuggestions(true);
    setError(false);
  }

  async function escalateFromChat() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const res = await fetch("/api/aipify/support-assistant/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_asked: lastUser.content }),
    });
    if (res.ok) {
      const ctx = await res.json();
      sessionStorage.setItem(SUPPORT_ASSISTANT_CONTEXT_STORAGE_KEY, JSON.stringify(ctx));
      window.location.href = "/app/support/requests?from=companion";
    }
  }

  const suggestedPrompts = routeSuggestions.map((s) => ({
    id: s.id,
    text: labels.contextSuggestions[s.promptKey] ?? s.promptKey,
    quickActionId: s.quickActionId,
  }));

  return (
    <div
      className={`flex h-full flex-col bg-aipify-canvas ${
        mode === "fullpage" ? "min-h-[calc(100vh-4rem)]" : ""
      }`}
      role="region"
      aria-label={labels.ariaCompanionPanel}
    >
      {/* Hero */}
      <div className="shrink-0 border-b border-aipify-border bg-white px-4 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <CompanionIcon size={48} withRing />
            <div>
              <h1 className="text-xl font-semibold text-aipify-text">{labels.title}</h1>
              <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {mode === "drawer" ? (
              <>
                <Link
                  href={COMPANION_EXPERIENCE_ROUTE}
                  className="hidden rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-medium text-aipify-companion hover:bg-violet-50 sm:inline-flex"
                >
                  {labels.fullPageLink}
                </Link>
                {onClose ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-aipify-text-muted hover:bg-aipify-surface-muted"
                    aria-label={labels.closeDrawer}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        {/* Org context block */}
        <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
              ✓ {labels.verifiedContext}
            </span>
            <span className="text-aipify-text-muted">·</span>
            <span className="text-aipify-text-secondary">
              {labels.activePage.replace("{page}", pageLabel)}
            </span>
          </div>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                {labels.activeOrganization}
              </dt>
              <dd className="font-medium text-aipify-text">{orgName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                {labels.roleLabel.split("{role}")[0]?.trim() || labels.roleLabel}
              </dt>
              <dd className="font-medium text-aipify-text">{roleDisplay}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                {labels.languageLabel}
              </dt>
              <dd className="font-medium text-aipify-text">{locale.toUpperCase()}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                {labels.modeLabel}
              </dt>
              <dd className="font-medium text-aipify-text">{labels.modeAssisted}</dd>
            </div>
          </dl>
        </div>

        {/* Input area */}
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void askQuestion(query);
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.inputPlaceholder}
            className="min-h-12 flex-1 rounded-xl border border-aipify-border bg-white px-4 py-3 text-sm text-aipify-text placeholder:text-aipify-text-muted focus:border-aipify-companion focus:outline-none focus:ring-2 focus:ring-violet-200"
            aria-label={labels.inputPlaceholder}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-aipify-companion px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {labels.askAipifyButton}
            </button>
            <button
              type="button"
              onClick={startNewConversation}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-aipify-border bg-white px-4 py-2 text-sm font-medium text-aipify-text hover:bg-aipify-surface-muted"
            >
              {labels.newConversation}
            </button>
            <button
              type="button"
              onClick={() => setShowSuggestions((v) => !v)}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-aipify-border bg-white px-4 py-2 text-sm font-medium text-aipify-companion hover:bg-violet-50"
            >
              {labels.viewSuggestions}
            </button>
          </div>
        </form>
      </div>

      {/* Scrollable body */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6">
          {messages.length === 0 && !loading ? (
            <div className="rounded-xl border border-dashed border-aipify-border bg-white p-6 text-center">
              <CompanionIcon size={56} withRing className="mx-auto" />
              <h2 className="mt-4 text-lg font-semibold text-aipify-text">{labels.emptyWelcomeTitle}</h2>
              <p className="mt-2 text-sm text-aipify-text-secondary">{labels.emptyWelcomeBody}</p>
            </div>
          ) : null}

          <CompanionQuickActions
            labels={labels}
            icons={QUICK_ACTION_ICONS}
            onSelect={(id) => {
              const action = labels.quickActions[id];
              void askQuestion(action.title);
            }}
            onNavigate={(id) => {
              window.location.href = resolveQuickActionHref(id);
            }}
          />

          {showSuggestions && suggestedPrompts.length > 0 ? (
            <section className="mt-4">
              <h2 className="text-sm font-semibold text-aipify-text">{labels.suggestedQuestionsTitle}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {suggestedPrompts.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => void askQuestion(s.text)}
                      className="rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-900 hover:border-aipify-companion hover:bg-violet-100"
                    >
                      {s.text}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="font-medium text-red-900">{labels.errorTitle}</p>
              <p className="mt-1 text-sm text-red-700">{labels.errorBody}</p>
              <button
                type="button"
                onClick={() => setError(false)}
                className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                {labels.retry}
              </button>
            </div>
          ) : null}

          <CompanionChat messages={messages} loading={loading} labels={labels} />

          {messages.length > 0 ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-center">
              <p className="text-sm font-medium text-amber-950">{labels.stillNeedHelp}</p>
              <button
                type="button"
                onClick={() => void escalateFromChat()}
                className="mt-3 rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                {labels.createSupportRequest}
              </button>
            </div>
          ) : null}

          <div ref={chatEndRef} />
        </div>

        {/* Sidebar — recent + capabilities */}
        <aside className="shrink-0 border-t border-aipify-border bg-white lg:w-72 lg:border-l lg:border-t-0">
          {recentConversations.length > 0 ? (
            <section className="border-b border-aipify-border p-4">
              <h2 className="text-sm font-semibold text-aipify-text">{labels.recentConversationsTitle}</h2>
              <ul className="mt-3 space-y-2">
                {recentConversations.map((conv) => (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => void askQuestion(conv.title)}
                      className="w-full rounded-lg border border-aipify-border px-3 py-2 text-left hover:border-violet-200 hover:bg-violet-50"
                    >
                      <p className="text-sm font-medium text-aipify-text">{conv.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-aipify-text-muted">{conv.preview}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="p-4">
            <h2 className="text-sm font-semibold text-aipify-text">{labels.capabilitiesTitle}</h2>
            <ul className="mt-3 space-y-2">
              {COMPANION_CAPABILITY_IDS.map((id) => (
                <li key={id} className="flex items-start gap-2 text-sm text-aipify-text-secondary">
                  <CompanionIcon size={20} className="mt-0.5 shrink-0" />
                  <span>{labels.capabilities[id]}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* Sticky input for long chats */}
      {messages.length > 2 ? (
        <div className="shrink-0 border-t border-aipify-border bg-white p-3 sm:px-6">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void askQuestion(query);
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.inputPlaceholder}
              className="min-h-11 flex-1 rounded-xl border border-aipify-border px-3 py-2 text-sm focus:border-aipify-companion focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex min-h-11 items-center rounded-xl bg-aipify-companion px-4 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {labels.askAipifyButton}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
