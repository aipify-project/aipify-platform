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
import { createConversationId } from "@/lib/app/companion/conversations";
import {
  patchCompanionUiSession,
  readCompanionUiSession,
} from "@/lib/app/companion/session-state";
import { useCompanionChatScroll } from "@/lib/app/companion/use-companion-chat-scroll";
import { useCompanionPersistentChat } from "@/lib/app/companion/chat-queue/use-companion-persistent-chat";
import { SUPPORT_ASSISTANT_CONTEXT_STORAGE_KEY } from "@/lib/app-portal/support-assistant";
import type { CompanionChatMessage, CompanionConversationPreview, CompanionExperienceLabels } from "@/lib/app/companion/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
import { CompanionIcon } from "./CompanionIcon";
import { CompanionQuickActions } from "./CompanionQuickActions";
import { CompanionChat } from "./CompanionChat";
import { CompanionChatScrollViewport } from "./CompanionChatScrollViewport";
import { CompanionAttachmentComposer } from "./CompanionAttachmentComposer";
import { CompanionContextStrip } from "./CompanionContextStrip";
import { CompanionQueueBar } from "./CompanionQueueBar";
import type { CompanionChatAttachmentSummary } from "@/lib/app/companion/types";

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
  /** When false the drawer is hidden but kept mounted — skip focus-only side effects. */
  panelVisible?: boolean;
};

export function CompanionPanel({
  labels,
  locale,
  pathname,
  mode,
  onClose,
  initialQuery,
  panelVisible = true,
}: CompanionPanelProps) {
  const profileCtx = useOptionalDashboardProfile();
  const organizationKey = profileCtx?.profile?.company.id ?? null;

  const [query, setQuery] = useState(() => {
    if (initialQuery?.trim()) return initialQuery;
    return readCompanionUiSession(organizationKey)?.draftText ?? "";
  });
  const [recentConversations, setRecentConversations] = useState<CompanionConversationPreview[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showSecondarySections, setShowSecondarySections] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    return readCompanionUiSession(organizationKey)?.activeConversationId ?? createConversationId();
  });
  const initialQuerySubmittedRef = useRef(false);

  const {
    messages,
    setMessages,
    queue,
    loading,
    hydrated,
    restoreFailed,
    syncError,
    setSyncError,
    enqueueQuestion,
    cancelQueueItem,
    retryQueueItem,
    loadServerConversations,
  } = useCompanionPersistentChat({
    conversationId: activeConversationId,
    locale,
    pathname,
    panelVisible,
    organizationKey,
  });

  const contentSignature = useMemo(
    () => `${messages.length}:${loading}:${messages.map((message) => message.id).join(",")}`,
    [messages, loading],
  );

  const {
    scrollContainerRef,
    chatEndRef,
    showJumpToLatest,
    handleScroll,
    jumpToLatestMessage,
    notifyUserSentMessage,
    resetForNewConversation,
    prepareConversationChange,
    viewportContentClassName,
  } = useCompanionChatScroll({
    messageCount: messages.length,
    contentSignature,
    conversationId: activeConversationId,
    loading,
    visible: panelVisible,
    session: {
      organizationKey,
      pathname,
      persistScroll: true,
    },
  });

  const orgName = profileCtx?.profile?.company.name ?? labels.orgNameFallback;
  const userRole = profileCtx?.profile?.user.role ?? "staff";
  const roleName = labels.roles[userRole] ?? labels.roleFallback;
  const canConfirmOrg = userRole === "owner" || userRole === "admin";
  const pageLabelKey = resolveCompanionPageLabelKey(pathname);
  const pageLabel = labels.contextPages[pageLabelKey] ?? labels.contextPages.default;
  const routeSuggestions = useMemo(() => resolveCompanionSuggestions(pathname), [pathname]);
  const isActiveConversation = messages.length > 0 || loading || queue.length > 0;
  const restoreNotice =
    restoreFailed && hydrated && messages.length === 0 ? labels.queue.restoreError : null;
  const error = syncError;

  const refreshRecentConversations = useCallback(async () => {
    const list = await loadServerConversations();
    setRecentConversations(
      list.map((entry) => ({
        id: entry.id,
        title: entry.title ?? entry.preview ?? labels.newConversation,
        preview: entry.preview ?? "",
        pinned: false,
        updatedAt: entry.updated_at ? new Date(entry.updated_at).getTime() : Date.now(),
      })),
    );
  }, [loadServerConversations, labels.newConversation]);

  useEffect(() => {
    void refreshRecentConversations();
  }, [refreshRecentConversations, organizationKey, messages.length]);

  useEffect(() => {
    patchCompanionUiSession(
      {
        activeConversationId,
        organizationKey,
        pathname,
      },
      organizationKey,
    );
  }, [activeConversationId, organizationKey, pathname]);

  useEffect(() => {
    if (initialQuery?.trim()) return;
    const timeoutId = window.setTimeout(() => {
      patchCompanionUiSession(
        {
          draftText: query,
          organizationKey,
          pathname,
        },
        organizationKey,
      );
    }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [query, organizationKey, pathname, initialQuery]);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setShowSuggestions(false);
    }
  }, [initialQuery]);

  const submitQuestion = useCallback(
    async (input: {
      question: string;
      attachmentIds?: string[];
      activeArtifactId?: string | null;
      attachmentSummaries?: CompanionChatAttachmentSummary[];
    }) => {
      const trimmed = input.question.trim();
      const hasAttachments = (input.attachmentIds?.length ?? 0) > 0;
      if (!trimmed && !hasAttachments) return;

      setSyncError(false);
      setShowSuggestions(false);
      notifyUserSentMessage();
      setQuery("");
      patchCompanionUiSession({ draftText: "", organizationKey, pathname }, organizationKey);

      const lastSnapshot = [...messages]
        .reverse()
        .find((message) => message.role === "aipify" && message.platformSnapshotCard);

      const ok = await enqueueQuestion({
        question: trimmed || (hasAttachments ? labels.attachments.activeBadge : ""),
        attachmentIds: input.attachmentIds,
        activeArtifactId: input.activeArtifactId,
        attachmentSummaries: input.attachmentSummaries,
        title: trimmed || labels.attachments.stagedTitle,
        platformActiveModules: lastSnapshot?.platformSnapshotCard?.activeModules,
      });

      if (!ok) {
        setSyncError(true);
      } else {
        void refreshRecentConversations();
      }
    },
    [
      messages,
      labels.attachments.stagedTitle,
      enqueueQuestion,
      notifyUserSentMessage,
      organizationKey,
      pathname,
      refreshRecentConversations,
      setSyncError,
    ],
  );

  useEffect(() => {
    const trimmed = initialQuery?.trim();
    if (!trimmed || initialQuerySubmittedRef.current || !hydrated) return;
    initialQuerySubmittedRef.current = true;
    void submitQuestion({ question: trimmed });
  }, [initialQuery, submitQuestion, hydrated]);

  function startNewConversation() {
    setMessages([]);
    setQuery("");
    setShowSuggestions(true);
    setShowSecondarySections(false);
    setSyncError(false);
    resetForNewConversation();
    const nextId = createConversationId();
    setActiveConversationId(nextId);
    patchCompanionUiSession(
      {
        activeConversationId: nextId,
        draftText: "",
        scrollTop: 0,
        organizationKey,
        pathname,
      },
      organizationKey,
    );
    initialQuerySubmittedRef.current = false;
  }

  function loadConversation(conv: CompanionConversationPreview) {
    prepareConversationChange(conv.id);
    setActiveConversationId(conv.id);
    setShowSuggestions(false);
    setSyncError(false);
    if (conv.messages && conv.messages.length > 0) {
      setMessages(conv.messages);
    }
  }

  function handleDeleteConversation(conversationId: string) {
    setRecentConversations((prev) => prev.filter((entry) => entry.id !== conversationId));
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
            void submitQuestion({ question: action.title });
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
              <li key={s.id} className="min-w-[min(100%,12rem)] flex-1 sm:flex-none">
                <button
                  type="button"
                  onClick={() => void submitQuestion({ question: s.text })}
                  className="w-full rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-left text-sm text-violet-900 hover:border-aipify-companion hover:bg-violet-100"
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
            <CompanionIcon
              size={isActiveConversation ? 36 : 48}
              availabilityRing
              ariaLabel={labels.ariaCompanionAvailable}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className={`font-semibold text-aipify-text ${
                    isActiveConversation ? "text-base" : "text-xl"
                  }`}
                >
                  {labels.title}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  <span aria-hidden="true">✓</span>
                  <span>{labels.companionAvailable}</span>
                </span>
              </div>
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
                    {labels.roleHeading}
                  </dt>
                  <dd className="font-medium text-aipify-text">{roleName}</dd>
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
              <CompanionAttachmentComposer
                query={query}
                setQuery={setQuery}
                loading={false}
                labels={labels}
                conversationId={activeConversationId}
                onSubmit={(payload) =>
                  void submitQuestion({
                    question: payload.question,
                    attachmentIds: payload.attachmentIds,
                    activeArtifactId: payload.activeArtifactId,
                    attachmentSummaries: payload.attachmentSummaries,
                  })
                }
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <CompanionChatScrollViewport
          scrollContainerRef={scrollContainerRef}
          chatEndRef={chatEndRef}
          onScroll={handleScroll}
          containerClassName={`flex min-h-0 flex-1 flex-col overflow-y-auto ${
            isActiveConversation ? "px-4 py-6 sm:px-6" : "px-4 py-4 sm:px-6 lg:flex-row"
          }`}
          viewportClassName={`flex min-h-0 flex-1 flex-col ${
            isActiveConversation ? "min-h-full justify-end" : ""
          } ${viewportContentClassName}`}
          showJumpToLatest={showJumpToLatest}
          onJumpToLatest={jumpToLatestMessage}
          scrollToLatestLabel={labels.scrollToLatest}
          scrollToLatestAriaLabel={labels.scrollToLatestAria}
          beforeViewport={
            restoreNotice ? (
              <div
                className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950"
                role="status"
              >
                {restoreNotice}
              </div>
            ) : null
          }
        >
          {messages.length === 0 && !loading ? (
            <div className="rounded-xl border border-dashed border-aipify-border bg-white p-6 text-center">
              <CompanionIcon size={56} availabilityRing ariaLabel={labels.ariaCompanionAvailable} className="mx-auto" />
              <h2 className="mt-4 text-lg font-semibold text-aipify-text">{labels.emptyWelcomeTitle}</h2>
              <p className="mt-2 text-sm text-aipify-text-secondary">{labels.emptyWelcomeBody}</p>
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="font-medium text-red-900">{labels.errorTitle}</p>
              <p className="mt-1 text-sm text-red-700">{labels.queue.syncError}</p>
              <button
                type="button"
                onClick={() => setSyncError(false)}
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

          {!isActiveConversation ? secondarySections : null}
        </CompanionChatScrollViewport>
      </div>

      {isActiveConversation ? (
        <>
          <CompanionContextStrip
            labels={labels}
            orgName={orgName}
            roleName={roleName}
            locale={locale}
            pageLabel={pageLabel}
            expanded={showSecondarySections}
            onToggle={() => setShowSecondarySections((v) => !v)}
          >
            {secondarySections}
          </CompanionContextStrip>
          <CompanionQueueBar
            queue={queue}
            labels={labels}
            onCancel={(queueId) => void cancelQueueItem(queueId)}
            onRetry={(queueId) => void retryQueueItem(queueId)}
          />
          <div className="shrink-0 border-t border-aipify-border bg-white p-3 sm:px-6 sm:py-4">
            <CompanionAttachmentComposer
              query={query}
              setQuery={setQuery}
              loading={false}
              labels={labels}
              conversationId={activeConversationId}
              compact
              onSubmit={(payload) =>
                void submitQuestion({
                  question: payload.question,
                  attachmentIds: payload.attachmentIds,
                  activeArtifactId: payload.activeArtifactId,
                  attachmentSummaries: payload.attachmentSummaries,
                })
              }
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
