"use client";

import Link from "next/link";
import {
  COMPANION_CAPABILITY_IDS,
  COMPANION_EXPERIENCE_ROUTE,
  COMPANION_QUICK_ACTION_IDS,
  resolveCompanionPageLabelKey,
  resolveCompanionSuggestions,
  resolveQuickActionHref,
  type CompanionQuickActionId,
} from "@/lib/app/companion";
import {
  buildConversationPreview,
  createConversationId,
  deleteRecentConversation,
  loadRecentConversations,
  saveRecentConversation,
} from "@/lib/app/companion/conversations";
import {
  parseSupportAssistantSearch,
  SUPPORT_ASSISTANT_CONTEXT_STORAGE_KEY,
  type SupportAssistantArticle,
} from "@/lib/app-portal/support-assistant";
import type { CompanionChatMessage, CompanionConversationPreview, CompanionExperienceLabels } from "@/lib/app/companion/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
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
  initialQuery?: string;
};

function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ComposerForm({
  query,
  setQuery,
  loading,
  labels,
  onSubmit,
  compact,
}: {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  labels: CompanionExperienceLabels;
  onSubmit: (question: string) => void;
  compact?: boolean;
}) {
  return (
    <form
      className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row"}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(query);
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={labels.inputPlaceholder}
        className={
          compact
            ? "min-h-12 flex-1 rounded-xl border border-aipify-border bg-white px-4 py-3 text-base text-aipify-text placeholder:text-aipify-text-muted focus:border-aipify-companion focus:outline-none focus:ring-2 focus:ring-violet-200"
            : "min-h-12 flex-1 rounded-xl border border-aipify-border bg-white px-4 py-3 text-base text-aipify-text placeholder:text-aipify-text-muted focus:border-aipify-companion focus:outline-none focus:ring-2 focus:ring-violet-200"
        }
        aria-label={labels.inputPlaceholder}
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className={
          compact
            ? "inline-flex min-h-12 shrink-0 items-center rounded-xl bg-aipify-companion px-5 text-base font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            : "inline-flex min-h-12 items-center justify-center rounded-xl bg-aipify-companion px-5 py-2.5 text-base font-medium text-white hover:bg-violet-700 disabled:opacity-60"
        }
      >
        {labels.askAipifyButton}
      </button>
    </form>
  );
}

export function CompanionPanel({
  labels,
  locale,
  pathname,
  mode,
  onClose,
  initialQuery,
}: CompanionPanelProps) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [messages, setMessages] = useState<CompanionChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [recentConversations, setRecentConversations] = useState<CompanionConversationPreview[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showSecondarySections, setShowSecondarySections] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string>(() => createConversationId());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialQuerySubmittedRef = useRef(false);

  const profileCtx = useOptionalDashboardProfile();
  const orgName = profileCtx?.profile?.company.name ?? labels.orgNameFallback;
  const roleDisplay = profileCtx?.profile
    ? labels.roleLabel.replace("{role}", profileCtx.profile.user.role)
    : labels.roleFallback;
  const userRole = profileCtx?.profile?.user.role ?? "staff";
  const canConfirmOrg = userRole === "owner" || userRole === "admin";
  const pageLabelKey = resolveCompanionPageLabelKey(pathname);
  const pageLabel = labels.contextPages[pageLabelKey] ?? labels.contextPages.default;
  const routeSuggestions = useMemo(() => resolveCompanionSuggestions(pathname), [pathname]);
  const isActiveConversation = messages.length > 0 || loading;

  useEffect(() => {
    setRecentConversations(loadRecentConversations());
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setShowSuggestions(false);
    }
  }, [initialQuery]);

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
        const params = new URLSearchParams({ q: trimmed, locale });
        const res = await fetch(`/api/aipify/support-assistant/search?${params}`);
        if (!res.ok) throw new Error("search failed");
        const parsed = parseSupportAssistantSearch(await res.json());
        const answer = parsed.answer;
        const article = parsed.articles[0];

        const reply = answer
          ? buildPlatformAnswerReply(answer, labels, trimmed)
          : article
            ? buildArticleReply(article, labels, trimmed)
            : buildFallbackReply(labels, trimmed);

        setMessages((prev) => {
          const nextMessages = [...prev, reply];
          const firstUser = nextMessages.find((m) => m.role === "user");
          saveRecentConversation(
            buildConversationPreview({
              id: activeConversationId,
              title: firstUser?.content ?? trimmed,
              preview: answer?.directAnswer ?? article?.summary ?? labels.noResults,
              locale,
              messages: nextMessages,
            }),
          );
          setRecentConversations(loadRecentConversations());
          return nextMessages;
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [loading, labels, locale, activeConversationId]
  );

  useEffect(() => {
    const trimmed = initialQuery?.trim();
    if (!trimmed || initialQuerySubmittedRef.current) return;
    initialQuerySubmittedRef.current = true;
    void askQuestion(trimmed);
  }, [initialQuery, askQuestion]);

  function buildPlatformAnswerReply(
    platformAnswer: NonNullable<ReturnType<typeof parseSupportAssistantSearch>["answer"]>,
    lbls: CompanionExperienceLabels,
    question: string,
  ): CompanionChatMessage {
    const ctas =
      platformAnswer.actions.length > 0
        ? platformAnswer.actions.map((action) => ({
            label: action.label,
            href: action.href,
          }))
        : [{ label: lbls.viewSuggestions, href: "/app/support/knowledge" }];

    return {
      id: createMessageId(),
      role: "aipify",
      content: platformAnswer.directAnswer,
      directAnswer: platformAnswer.directAnswer,
      explanation: platformAnswer.explanation,
      question,
      steps: platformAnswer.steps,
      ctas,
      sources: platformAnswer.sources,
      sourceId: platformAnswer.sourceId,
      confidence: platformAnswer.confidence,
      showSupportEscalation: platformAnswer.showSupportEscalation ?? platformAnswer.confidence === "low",
      timestamp: Date.now(),
    };
  }

  function buildFallbackReply(lbls: CompanionExperienceLabels, question: string): CompanionChatMessage {
    return {
      id: createMessageId(),
      role: "aipify" as const,
      content: lbls.noResults,
      directAnswer: lbls.noResults,
      question,
      timestamp: Date.now(),
      showSupportEscalation: true,
      ctas: [
        { label: lbls.createSupportRequest, href: "/app/support/requests?from=companion" },
        { label: lbls.contextPages.support, href: "/app/support/knowledge" },
        { label: lbls.openCompanion, href: "/app/companion" },
      ],
    };
  }

  function buildArticleReply(
    article: SupportAssistantArticle,
    lbls: CompanionExperienceLabels,
    question: string,
  ): CompanionChatMessage {
    const ctas = [{ label: lbls.createSupportRequest, href: "/app/support/requests?from=companion" }];
    if (article.related_module) {
      ctas.unshift({ label: lbls.viewSuggestions, href: `/app/support/knowledge` });
    }
    return {
      id: createMessageId(),
      role: "aipify",
      content: article.summary,
      directAnswer: article.summary,
      question,
      steps: article.steps,
      ctas,
      showSupportEscalation: true,
      timestamp: Date.now(),
    };
  }

  function startNewConversation() {
    setMessages([]);
    setQuery("");
    setShowSuggestions(true);
    setShowSecondarySections(false);
    setError(false);
    setActiveConversationId(createConversationId());
    initialQuerySubmittedRef.current = false;
  }

  function loadConversation(conv: CompanionConversationPreview) {
    if (conv.messages && conv.messages.length > 0) {
      setMessages(conv.messages);
      setActiveConversationId(conv.id);
      setShowSuggestions(false);
      setError(false);
      return;
    }
    void askQuestion(conv.title);
  }

  function handleDeleteConversation(conversationId: string) {
    setRecentConversations(deleteRecentConversation(conversationId));
    if (conversationId === activeConversationId) {
      startNewConversation();
    }
  }

  function handleMessageFeedback(
    messageId: string,
    feedback: Exclude<CompanionChatMessage["feedback"], null | undefined>,
  ) {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? {
              ...message,
              feedback,
              showSupportEscalation:
                feedback === "not_helpful" || message.showSupportEscalation,
            }
          : message,
      ),
    );
  }

  const shouldShowGlobalSupport =
    error ||
    messages.some(
      (message) =>
        message.role === "aipify" &&
        (message.showSupportEscalation ||
          message.confidence === "low" ||
          message.feedback === "not_helpful"),
    );

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

  const secondarySections = (
    <>
      {!isActiveConversation ? (
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
      ) : null}

      {showSuggestions && suggestedPrompts.length > 0 && !isActiveConversation ? (
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

      {recentConversations.length > 0 ? (
        <section className="mt-4 border-t border-aipify-border pt-4">
          <h2 className="text-sm font-semibold text-aipify-text">{labels.recentConversationsTitle}</h2>
          <ul className="mt-3 space-y-2">
            {recentConversations.map((conv) => (
              <li key={conv.id} className="flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => loadConversation(conv)}
                  className={`min-w-0 flex-1 rounded-lg border px-3 py-2 text-left hover:border-violet-200 hover:bg-violet-50 ${
                    conv.id === activeConversationId
                      ? "border-violet-300 bg-violet-50"
                      : "border-aipify-border"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-aipify-text">{conv.title}</p>
                    {conv.id === activeConversationId ? (
                      <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-violet-800">
                        {labels.recentActive}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-aipify-text-muted">{conv.preview}</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteConversation(conv.id)}
                  className="shrink-0 rounded-lg border border-aipify-border px-2 text-xs text-aipify-text-muted hover:bg-aipify-surface-muted"
                  aria-label={labels.recentDelete}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-4 border-t border-aipify-border pt-4">
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

      {shouldShowGlobalSupport ? (
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/40 p-3">
          <p className="text-xs text-amber-950">{labels.supportEscalationHint}</p>
          <button
            type="button"
            onClick={() => void escalateFromChat()}
            className="mt-2 text-xs font-medium text-aipify-companion hover:underline"
          >
            {labels.createSupportRequest}
          </button>
        </div>
      ) : null}
    </>
  );

  return (
    <div
      className={`flex h-full flex-col bg-aipify-canvas ${
        mode === "fullpage" ? "min-h-[calc(100vh-4rem)]" : ""
      }`}
      role="region"
      aria-label={labels.ariaCompanionPanel}
    >
      <div
        className={`shrink-0 border-b border-aipify-border bg-white ${
          isActiveConversation ? "px-4 py-3 sm:px-6" : "px-4 py-5 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <CompanionIcon size={isActiveConversation ? 36 : 48} withRing={!isActiveConversation} />
            <div className="min-w-0">
              <h1
                className={`font-semibold text-aipify-text ${
                  isActiveConversation ? "text-base" : "text-xl"
                }`}
              >
                {labels.title}
              </h1>
              {isActiveConversation ? (
                <p className="mt-0.5 truncate text-xs text-aipify-text-secondary">
                  {labels.activePage.replace("{page}", pageLabel)}
                </p>
              ) : (
                <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={startNewConversation}
              className="rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-medium text-aipify-text hover:bg-aipify-surface-muted"
            >
              {labels.newConversation}
            </button>
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

        {!isActiveConversation ? (
          <>
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

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowSuggestions((v) => !v)}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-aipify-border bg-white px-4 py-2 text-sm font-medium text-aipify-companion hover:bg-violet-50"
              >
                {labels.viewSuggestions}
              </button>
            </div>

            <div className="mt-4">
              <ComposerForm
                query={query}
                setQuery={setQuery}
                loading={loading}
                labels={labels}
                onSubmit={(q) => void askQuestion(q)}
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${
            isActiveConversation ? "px-4 py-6 sm:px-6" : "px-4 py-4 sm:px-6 lg:flex-row"
          }`}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            {messages.length === 0 && !loading ? (
              <div className="rounded-xl border border-dashed border-aipify-border bg-white p-6 text-center">
                <CompanionIcon size={56} withRing className="mx-auto" />
                <h2 className="mt-4 text-lg font-semibold text-aipify-text">{labels.emptyWelcomeTitle}</h2>
                <p className="mt-2 text-sm text-aipify-text-secondary">{labels.emptyWelcomeBody}</p>
              </div>
            ) : null}

            {error ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
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

            <CompanionChat
              messages={messages}
              loading={loading}
              labels={labels}
              spacious={isActiveConversation}
              conversationId={activeConversationId}
              locale={locale}
              pathname={pathname}
              canConfirmOrg={canConfirmOrg}
              onMessageFeedback={handleMessageFeedback}
              onEscalate={() => void escalateFromChat()}
            />

            {isActiveConversation ? (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowSecondarySections((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-aipify-border bg-white px-4 py-3 text-left text-sm font-medium text-aipify-companion hover:bg-violet-50"
                  aria-expanded={showSecondarySections}
                >
                  <span>
                    {showSecondarySections
                      ? labels.secondarySectionsHide
                      : labels.secondarySectionsToggle}
                  </span>
                  <svg
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      showSecondarySections ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showSecondarySections ? (
                  <div className="mt-3 rounded-xl border border-aipify-border bg-white p-4">
                    {secondarySections}
                  </div>
                ) : null}
              </div>
            ) : (
              secondarySections
            )}

            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {isActiveConversation ? (
        <div className="shrink-0 border-t border-aipify-border bg-white p-4 sm:px-6">
          <ComposerForm
            query={query}
            setQuery={setQuery}
            loading={loading}
            labels={labels}
            onSubmit={(q) => void askQuestion(q)}
            compact
          />
        </div>
      ) : null}
    </div>
  );
}
