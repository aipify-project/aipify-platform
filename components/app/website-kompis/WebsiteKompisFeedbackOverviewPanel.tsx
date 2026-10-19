"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ClipboardCheck,
  MessageCircle,
  MessageSquareText,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { WebsiteKompisFeedbackEditor } from "@/components/app/website-kompis/WebsiteKompisFeedbackEditor";
import { WebsiteKompisPublishedFaqList } from "@/components/app/website-kompis/WebsiteKompisPublishedFaqList";
import type { WebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import {
  FEEDBACK_REVIEW_BADGE_CLASS,
  FEEDBACK_REVIEW_PAGE_SIZE,
  filterFeedbackOpsRows,
  partitionFeedbackWorkspace,
  resolveFeedbackOpsStatus,
  selectKnowledgeGapCandidates,
  takeFeedbackPage,
  type FeedbackOpsCommentFilter,
  type FeedbackOpsRow,
  type FeedbackOpsVoteFilter,
} from "@/lib/website-kompis-feedback/operations-model";

type OverviewPayload = {
  ok?: boolean;
  persistenceReady?: boolean;
  totals?: {
    answers: number;
    helpful: number;
    notHelpful: number;
    withComment: number;
  };
  recent?: FeedbackOpsRow[];
  error?: string;
};

type ViewId = "review" | "published" | "history";

const STATUS_TONE: Record<string, string> = {
  emerald: "bg-[#E8F7F0] text-[var(--app-text)] ring-[#B7E4CF]",
  amber: "bg-[#FFF4E5] text-[var(--app-text)] ring-[#F5D4A3]",
  purple: "bg-[var(--app-primary-soft)] text-[var(--app-text)] ring-[var(--app-border-accent)]",
  slate: "bg-[var(--app-soft-surface)] text-[var(--app-text)] ring-[var(--app-border)]",
  review: FEEDBACK_REVIEW_BADGE_CLASS,
};

function formatWhen(value: string, locale: string): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "—";
  try {
    return new Intl.DateTimeFormat(locale || undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(parsed));
  } catch {
    return "—";
  }
}

function StatusBadge({
  labels,
  row,
}: {
  labels: WebsiteKompisFeedbackLabels;
  row: FeedbackOpsRow;
}) {
  const status = resolveFeedbackOpsStatus(row);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_TONE[status.tone]}`}>
      {labels.status[status.key]}
    </span>
  );
}

export function WebsiteKompisFeedbackOverviewPanel({
  labels,
  embedded = false,
  locale = "en",
}: {
  labels: WebsiteKompisFeedbackLabels;
  embedded?: boolean;
  locale?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [visible, setVisible] = useState(FEEDBACK_REVIEW_PAGE_SIZE);

  const viewParam = searchParams.get("view");
  const view: ViewId =
    viewParam === "history" || viewParam === "published" || viewParam === "review"
      ? viewParam
      : "review";
  const voteFilter = (searchParams.get("vote") as FeedbackOpsVoteFilter) || "all";
  const commentFilter = (searchParams.get("comment") as FeedbackOpsCommentFilter) || "all";
  const query = searchParams.get("q") ?? "";
  const localeFilter = searchParams.get("locale") ?? "";
  const pageFilter = searchParams.get("page") ?? "";
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";

  const setFilterParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      setVisible(FEEDBACK_REVIEW_PAGE_SIZE);
    },
    [pathname, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams();
    if (view !== "review") next.set("view", view);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setVisible(FEEDBACK_REVIEW_PAGE_SIZE);
  }, [pathname, router, view]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/website-kompis/feedback?limit=100");
      if (response.status === 401 || response.status === 403) {
        setError(labels.accessDenied);
        setData(null);
        return;
      }
      if (!response.ok) {
        setError(labels.errorGeneric);
        setData(null);
        return;
      }
      setData((await response.json()) as OverviewPayload);
    } catch {
      setError(labels.errorGeneric);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [labels.accessDenied, labels.errorGeneric]);

  useEffect(() => {
    void load();
  }, [load]);

  const recent = useMemo(() => data?.recent ?? [], [data]);
  const filtered = useMemo(
    () =>
      filterFeedbackOpsRows(recent, {
        vote: ["all", "helpful", "not_helpful"].includes(voteFilter) ? voteFilter : "all",
        comment: ["all", "with_comment", "without_comment"].includes(commentFilter) ? commentFilter : "all",
        query,
        locale: localeFilter,
        page: pageFilter,
        dateFrom,
        dateTo,
      }),
    [commentFilter, dateFrom, dateTo, localeFilter, pageFilter, query, recent, voteFilter],
  );
  const partitioned = useMemo(() => partitionFeedbackWorkspace(filtered), [filtered]);
  const reviewQueue = useMemo(() => selectKnowledgeGapCandidates(filtered), [filtered]);
  const activeRows = view === "history" ? partitioned.history : reviewQueue;
  const page = takeFeedbackPage(activeRows, visible);
  const selected = recent.find((row) => row.id === selectedId) ?? null;
  const locales = useMemo(
    () => Array.from(new Set(recent.map((row) => row.locale).filter((value): value is string => Boolean(value)))),
    [recent],
  );
  const languageNames = labels.quality.languages as Record<string, string>;

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-busy="true">
        <span className="sr-only">{labels.loading}</span>
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-24 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-soft-surface)] motion-safe:animate-pulse motion-reduce:animate-none"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <PlatformEmptyState
        title={error === labels.accessDenied ? labels.accessDenied : labels.errorGeneric}
        message={error}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const persistenceReady = data?.persistenceReady === true;
  const totals = data?.totals ?? { answers: 0, helpful: 0, notHelpful: 0, withComment: 0 };
  const tiles = [
    { label: labels.totals.answers, value: totals.answers, icon: MessageCircle, chip: "bg-[var(--app-primary-soft)] text-[var(--app-primary)]" },
    { label: labels.totals.helpful, value: totals.helpful, icon: ThumbsUp, chip: "bg-[#E8F7F0] text-[#146C43]" },
    { label: labels.totals.notHelpful, value: totals.notHelpful, icon: ThumbsDown, chip: "bg-[#FDECEC] text-[#9F1239]" },
    { label: labels.totals.withComment, value: totals.withComment, icon: MessageSquareText, chip: "bg-[var(--app-primary-soft)] text-[var(--app-primary)]" },
    { label: labels.totals.needsReview, value: totals.notHelpful, icon: ClipboardCheck, chip: FEEDBACK_REVIEW_BADGE_CLASS },
  ];
  const tabs: Array<{ id: ViewId; label: string; count: number | null }> = [
    { id: "review", label: labels.quality.tabs.review, count: reviewQueue.length },
    { id: "published", label: labels.quality.tabs.published, count: null },
    { id: "history", label: labels.quality.tabs.history, count: partitioned.history.length },
  ];

  return (
    <div className={embedded ? "w-full space-y-5" : "mx-auto w-full max-w-[1560px] space-y-5"}>
      {!persistenceReady ? (
        <div className="rounded-2xl border border-[var(--app-border-accent)] bg-[var(--app-primary-soft)] px-4 py-3 text-sm text-[var(--app-text)]">
          <p className="font-medium">{labels.persistenceUnavailableTitle}</p>
          <p className="mt-1 text-[var(--app-text-muted)]">{labels.persistenceUnavailableBody}</p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {tiles.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-4 shadow-[var(--app-shadow-card)]">
              <div className="flex items-center gap-2">
                <span className={`inline-flex size-8 items-center justify-center rounded-full ${item.chip}`}>
                  <Icon aria-hidden className="size-4" strokeWidth={2} />
                </span>
                <p className="text-sm text-[var(--app-text-muted)]">{item.label}</p>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--app-text)]">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div role="tablist" aria-label={labels.title} className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const selectedTab = view === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`feedback-tab-${tab.id}`}
              aria-selected={selectedTab}
              aria-controls={`feedback-panel-${tab.id}`}
              onClick={() => setFilterParam("view", tab.id === "review" ? "" : tab.id)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                event.preventDefault();
                const index = tabs.findIndex((item) => item.id === tab.id);
                const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
                if (next) setFilterParam("view", next.id === "review" ? "" : next.id);
              }}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] ${
                selectedTab
                  ? "bg-[var(--app-primary)] text-white"
                  : "border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)]"
              }`}
            >
              {tab.label}
              {tab.count != null ? <span className="text-xs opacity-80">{tab.count}</span> : null}
            </button>
          );
        })}
      </div>

      {view !== "published" ? (
        <section className="space-y-3 rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-4 shadow-[var(--app-shadow-card)]" aria-labelledby="wk-feedback-filters">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="wk-feedback-filters" className="text-base font-semibold text-[var(--app-text)]">
              {labels.filtersHeading}
            </h2>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded text-sm font-medium text-[var(--app-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            >
              {labels.clearFilters}
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm">
              <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterQuery}</span>
              <input
                value={query}
                onChange={(event) => setFilterParam("q", event.target.value)}
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterVote}</span>
              <select
                value={voteFilter}
                onChange={(event) => setFilterParam("vote", event.target.value)}
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              >
                <option value="all">{labels.filterAll}</option>
                <option value="helpful">{labels.votes.helpful}</option>
                <option value="not_helpful">{labels.votes.notHelpful}</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterLocale}</span>
              <select
                value={localeFilter}
                onChange={(event) => setFilterParam("locale", event.target.value)}
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              >
                <option value="">{labels.filterAll}</option>
                {locales.map((code) => (
                  <option key={code} value={code}>
                    {languageNames[code] ?? code}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterPage}</span>
              <input
                value={pageFilter}
                onChange={(event) => setFilterParam("page", event.target.value)}
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterFrom}</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setFilterParam("from", event.target.value)}
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterTo}</span>
              <input
                type="date"
                value={dateTo}
                onChange={(event) => setFilterParam("to", event.target.value)}
                className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              />
            </label>
          </div>
        </section>
      ) : null}

      <div role="tabpanel" id={`feedback-panel-${view}`} aria-labelledby={`feedback-tab-${view}`} className="space-y-4">
        {view === "published" ? (
          <WebsiteKompisPublishedFaqList labels={labels} query={query} localeFilter={localeFilter} />
        ) : null}

        {view === "review" || view === "history" ? (
          <section className="space-y-3" aria-labelledby="wk-review-queue">
            <div>
              <h2 id="wk-review-queue" className="text-lg font-semibold text-[var(--app-text)]">
                {view === "history" ? labels.quality.tabs.history : labels.sectionReviewQueue}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[var(--app-text-muted)]">
                {view === "history" ? labels.scopeNote : labels.sectionReviewQueueHint}
              </p>
              {view === "review" && totals.notHelpful > reviewQueue.length ? (
                <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.quality.windowGap}</p>
              ) : null}
            </div>
            {recent.length === 0 ? (
              <PlatformEmptyState
                title={labels.emptyTitle}
                message={labels.emptyDescription}
                primaryAction={{ label: labels.retry, onClick: () => void load() }}
              />
            ) : page.items.length === 0 ? (
              <PlatformEmptyState
                title={view === "history" ? labels.quality.historyEmpty : labels.quality.reviewEmpty}
                message={labels.noResultsDescription}
                primaryAction={{ label: labels.clearFilters, onClick: clearFilters }}
              />
            ) : (
              <ul className="grid gap-3 lg:grid-cols-2">
                {page.items.map((row) => (
                  <li key={row.id} className="flex flex-col rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)]">
                    <div className="flex items-start justify-between gap-3">
                      <StatusBadge labels={labels} row={row} />
                      <span className="text-xs text-[var(--app-text-muted)]">{formatWhen(row.createdAt, locale)}</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-[var(--app-text)]">{row.questionPreview || "—"}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--app-text-muted)]">{row.answerPreview || "—"}</p>
                    {row.comment?.trim() ? (
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--app-text)]">{row.comment.trim()}</p>
                    ) : null}
                    <p className="mt-3 text-xs text-[var(--app-text-muted)]">
                      {[row.pagePathname, row.locale ? languageNames[row.locale] ?? row.locale : null]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        data-feedback-edit={row.id}
                        onClick={() => setSelectedId(row.id)}
                        className="inline-flex min-h-11 items-center rounded-xl border border-[var(--app-border)] px-3 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                      >
                        {labels.openDetail}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {page.hasMore ? (
              <button
                type="button"
                onClick={() => setVisible((current) => current + FEEDBACK_REVIEW_PAGE_SIZE)}
                className="inline-flex min-h-11 items-center rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              >
                {labels.quality.showMore}
              </button>
            ) : null}
          </section>
        ) : null}
      </div>

      {toast ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">
          {toast}
        </p>
      ) : null}

      {selected ? (
        <WebsiteKompisFeedbackEditor
          row={selected}
          labels={labels}
          onClose={() => setSelectedId(null)}
          onPublished={() => {
            setSelectedId(null);
            setToast(labels.quality.publishedOk);
            setFilterParam("view", "published");
          }}
        />
      ) : null}
    </div>
  );
}
