"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AppVisualClasses } from "@/lib/design/app-visual-system";
import type { WebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import {
  filterFeedbackOpsRows,
  nextActionsForFeedbackRow,
  resolveFeedbackOpsStatus,
  selectKnowledgeGapCandidates,
  type FeedbackOpsCommentFilter,
  type FeedbackOpsRow,
  type FeedbackOpsVoteFilter,
} from "@/lib/website-kompis-feedback/operations-model";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

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
  reuseNote?: string;
  error?: string;
};

type WebsiteKompisFeedbackOverviewPanelProps = {
  labels: WebsiteKompisFeedbackLabels;
  /** Job 61 — inside AppHubShell: no narrow frame or duplicate page header. */
  embedded?: boolean;
};

const STATUS_TONE: Record<string, string> = {
  emerald: "bg-[#E8F7F0] text-[var(--app-positive)] ring-[#B7E4CF]",
  amber: "bg-[#FFF4E5] text-[var(--app-pending)] ring-[#F5D4A3]",
  purple: "bg-[var(--app-primary-soft)] text-[var(--app-primary)] ring-[var(--app-border-accent)]",
  slate: "bg-[var(--app-soft-surface)] text-[var(--app-text-muted)] ring-[var(--app-border)]",
};

function formatWhen(value: string): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
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
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_TONE[status.tone]}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          status.tone === "emerald"
            ? "bg-[var(--app-positive)]"
            : status.tone === "amber"
              ? "bg-[var(--app-pending)]"
              : status.tone === "purple"
                ? "bg-[var(--app-primary)]"
                : "bg-[var(--app-neutral)]"
        }`}
        aria-hidden="true"
      />
      {labels.status[status.key]}
    </span>
  );
}

export function WebsiteKompisFeedbackOverviewPanel({
  labels,
  embedded = false,
}: WebsiteKompisFeedbackOverviewPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const voteFilter = (searchParams.get("vote") as FeedbackOpsVoteFilter) || "all";
  const commentFilter = (searchParams.get("comment") as FeedbackOpsCommentFilter) || "all";
  const query = searchParams.get("q") ?? "";
  const localeFilter = searchParams.get("locale") ?? "";
  const pageFilter = searchParams.get("page") ?? "";

  const setFilterParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

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
      const payload = (await response.json()) as OverviewPayload;
      setData(payload);
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

  const recent = data?.recent ?? [];
  const filtered = useMemo(
    () =>
      filterFeedbackOpsRows(recent, {
        vote: ["all", "helpful", "not_helpful"].includes(voteFilter) ? voteFilter : "all",
        comment: ["all", "with_comment", "without_comment"].includes(commentFilter)
          ? commentFilter
          : "all",
        query,
        locale: localeFilter,
        page: pageFilter,
      }),
    [commentFilter, localeFilter, pageFilter, query, recent, voteFilter],
  );

  const reviewQueue = useMemo(() => selectKnowledgeGapCandidates(filtered), [filtered]);
  const selected = filtered.find((row) => row.id === selectedId) ?? null;

  if (loading) {
    return <AipifyLoadingState />;
  }

  if (error) {
    return (
      <div className={embedded ? "w-full space-y-4" : "mx-auto max-w-5xl space-y-4 px-4 py-8"}>
        <PlatformEmptyState
          title={labels.accessDenied === error ? labels.accessDenied : labels.errorGeneric}
          message={error}
          primaryAction={{ label: labels.retry, onClick: () => void load() }}
        />
      </div>
    );
  }

  const persistenceReady = data?.persistenceReady === true;
  const totals = data?.totals ?? {
    answers: 0,
    helpful: 0,
    notHelpful: 0,
    withComment: 0,
  };

  return (
    <div className={embedded ? "w-full space-y-6" : "mx-auto max-w-5xl space-y-6 px-4 py-8"}>
      {!persistenceReady ? (
        <div className="rounded-xl border border-[var(--app-border-accent)] bg-[var(--app-primary-soft)] px-4 py-3 text-sm text-[var(--app-text)]">
          <p className="font-medium">{labels.persistenceUnavailableTitle}</p>
          <p className="mt-1 text-[var(--app-text-muted)]">{labels.persistenceUnavailableBody}</p>
        </div>
      ) : null}

      <div className={`${AppVisualClasses.card} space-y-2 text-sm`}>
        <p className="text-[var(--app-text)]">{labels.reuseOffNote}</p>
        <p className="text-[var(--app-text-muted)]">{labels.helpfulNotTruth}</p>
        <p className="text-[var(--app-text-muted)]">{labels.negativeNotAutoChange}</p>
        <p className="text-[var(--app-text-muted)]">{labels.scopeNote}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: labels.totals.answers, value: totals.answers, tone: "slate" as const },
          { label: labels.totals.helpful, value: totals.helpful, tone: "emerald" as const },
          { label: labels.totals.notHelpful, value: totals.notHelpful, tone: "amber" as const },
          { label: labels.totals.withComment, value: totals.withComment, tone: "purple" as const },
          {
            label: labels.totals.needsReview,
            value: totals.notHelpful,
            tone: "amber" as const,
          },
        ].map((item) => (
          <div key={item.label} className={AppVisualClasses.card}>
            <p className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--app-text)]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`${FOUNDATION_NAV_BINDINGS.kompisWebQa}?vote=not_helpful`}
          className="inline-flex rounded-[var(--app-radius-md)] bg-[image:var(--app-primary-gradient)] px-3 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.actions.reviewNegative}
        </Link>
        <Link
          href={FOUNDATION_NAV_BINDINGS.kompisWebFaq}
          className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.actions.openFaq}
        </Link>
        <Link
          href={FOUNDATION_NAV_BINDINGS.kompisWebConnection}
          className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.actions.checkConnection}
        </Link>
      </div>

      <div className={`${AppVisualClasses.card} space-y-2`}>
        <h2 className="text-base font-semibold text-[var(--app-text)]">{labels.unansweredGapTitle}</h2>
        <p className="text-sm text-[var(--app-text-muted)]">{labels.unansweredGapBody}</p>
        <p className="text-sm text-[var(--app-text-muted)]">{labels.securityRejectNote}</p>
      </div>

      <section className={`${AppVisualClasses.card} space-y-3`} aria-labelledby="wk-feedback-filters">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="wk-feedback-filters" className="text-base font-semibold text-[var(--app-text)]">
            {labels.filtersHeading}
          </h2>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] rounded"
          >
            {labels.clearFilters}
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="text-sm">
            <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterVote}</span>
            <select
              value={voteFilter}
              onChange={(e) => setFilterParam("vote", e.target.value)}
              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2"
            >
              <option value="all">{labels.filterAll}</option>
              <option value="helpful">{labels.votes.helpful}</option>
              <option value="not_helpful">{labels.votes.notHelpful}</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterComment}</span>
            <select
              value={commentFilter}
              onChange={(e) => setFilterParam("comment", e.target.value)}
              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2"
            >
              <option value="all">{labels.filterAll}</option>
              <option value="with_comment">{labels.filterWithComment}</option>
              <option value="without_comment">{labels.filterWithoutComment}</option>
            </select>
          </label>
          <label className="text-sm xl:col-span-1">
            <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterQuery}</span>
            <input
              value={query}
              onChange={(e) => setFilterParam("q", e.target.value)}
              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterLocale}</span>
            <input
              value={localeFilter}
              onChange={(e) => setFilterParam("locale", e.target.value)}
              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-[var(--app-text-muted)]">{labels.filterPage}</span>
            <input
              value={pageFilter}
              onChange={(e) => setFilterParam("page", e.target.value)}
              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2"
            />
          </label>
        </div>
      </section>

      {reviewQueue.length > 0 ? (
        <section className="space-y-3" aria-labelledby="wk-review-queue">
          <div>
            <h2 id="wk-review-queue" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.sectionReviewQueue}
            </h2>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.sectionReviewQueueHint}</p>
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {reviewQueue.slice(0, 6).map((row) => {
              const suggest = nextActionsForFeedbackRow(row).find((a) => a.key === "suggestFaqDraft");
              return (
                <li key={row.id} className={AppVisualClasses.card}>
                  <div className="flex items-start justify-between gap-2">
                    <StatusBadge labels={labels} row={row} />
                    <span className="text-xs text-[var(--app-text-muted)]">{formatWhen(row.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-[var(--app-text)]">{row.questionPreview || "—"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--app-text-muted)]">
                    {row.comment?.trim() || row.answerPreview || "—"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedId(row.id)}
                      className="rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                    >
                      {labels.openDetail}
                    </button>
                    {suggest?.href ? (
                      <Link
                        href={suggest.href}
                        className="rounded-lg bg-[var(--app-primary-soft)] px-3 py-1.5 text-sm font-medium text-[var(--app-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                      >
                        {labels.actions.suggestFaqDraft}
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3" aria-labelledby="wk-feedback-table">
        <h2 id="wk-feedback-table" className="text-lg font-semibold text-[var(--app-text)]">
          {labels.sectionTable}
        </h2>
        {recent.length === 0 ? (
          <PlatformEmptyState
            title={labels.emptyTitle}
            message={labels.emptyDescription}
            primaryAction={{ label: labels.retry, onClick: () => void load() }}
          />
        ) : filtered.length === 0 ? (
          <PlatformEmptyState
            title={labels.noResultsTitle}
            message={labels.noResultsDescription}
            primaryAction={{ label: labels.clearFilters, onClick: clearFilters }}
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)]">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--app-border)] bg-[var(--app-soft-surface)] text-xs uppercase tracking-wide text-[var(--app-text-muted)]">
                <tr>
                  <th className="px-3 py-2 font-medium">{labels.columns.status}</th>
                  <th className="px-3 py-2 font-medium">{labels.columns.question}</th>
                  <th className="px-3 py-2 font-medium">{labels.columns.answer}</th>
                  <th className="px-3 py-2 font-medium">{labels.columns.comment}</th>
                  <th className="px-3 py-2 font-medium">{labels.columns.page}</th>
                  <th className="px-3 py-2 font-medium">{labels.columns.locale}</th>
                  <th className="px-3 py-2 font-medium">{labels.columns.when}</th>
                  <th className="px-3 py-2 font-medium">{labels.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--app-border)]/70 align-top">
                    <td className="px-3 py-3 whitespace-nowrap">
                      <StatusBadge labels={labels} row={row} />
                    </td>
                    <td className="px-3 py-3 max-w-[220px] text-[var(--app-text)]">
                      {row.questionPreview || "—"}
                    </td>
                    <td className="px-3 py-3 max-w-[240px] text-[var(--app-text-muted)]">
                      {row.answerPreview || "—"}
                    </td>
                    <td className="px-3 py-3 max-w-[180px] text-[var(--app-text-muted)]">
                      {row.comment?.trim() || "—"}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-[var(--app-text-muted)]">
                      {row.pagePathname || "—"}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-[var(--app-text-muted)]">
                      {row.locale || "—"}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-[var(--app-text-muted)]">
                      {formatWhen(row.createdAt)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedId(row.id)}
                        className="text-sm font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] rounded"
                      >
                        {labels.openDetail}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected ? (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={labels.detailTitle}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label={labels.detailClose}
            onClick={() => setSelectedId(null)}
          />
          <div className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card-hover)] sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--app-text)]">{labels.detailTitle}</h2>
                <div className="mt-2">
                  <StatusBadge labels={labels} row={selected} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-lg px-2 py-1 text-sm text-[var(--app-text-muted)] hover:bg-[var(--app-soft-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              >
                {labels.detailClose}
              </button>
            </div>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-[var(--app-text-muted)]">{labels.columns.question}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-[var(--app-text)]">
                  {selected.questionPreview || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--app-text-muted)]">{labels.columns.answer}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-[var(--app-text)]">
                  {selected.answerPreview || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--app-text-muted)]">{labels.columns.comment}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-[var(--app-text)]">
                  {selected.comment?.trim() || "—"}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="font-medium text-[var(--app-text-muted)]">{labels.columns.page}</dt>
                  <dd className="mt-1 text-[var(--app-text)]">{selected.pagePathname || "—"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[var(--app-text-muted)]">{labels.columns.locale}</dt>
                  <dd className="mt-1 text-[var(--app-text)]">{selected.locale || "—"}</dd>
                </div>
              </div>
              <div>
                <dt className="font-medium text-[var(--app-text-muted)]">{labels.columns.when}</dt>
                <dd className="mt-1 text-[var(--app-text)]">{formatWhen(selected.createdAt)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-[var(--app-text-muted)]">{labels.sourcesUnavailable}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {nextActionsForFeedbackRow(selected).map((action) =>
                action.href ? (
                  <Link
                    key={action.key}
                    href={action.href}
                    className="rounded-lg bg-[var(--app-primary-soft)] px-3 py-2 text-sm font-medium text-[var(--app-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                  >
                    {labels.actions[action.key]}
                  </Link>
                ) : null,
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
