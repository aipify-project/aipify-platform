"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import type { WebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";

type OverviewPayload = {
  ok?: boolean;
  persistenceReady?: boolean;
  totals?: {
    answers: number;
    helpful: number;
    notHelpful: number;
    withComment: number;
  };
  recent?: Array<{
    id: string;
    vote: "helpful" | "not_helpful";
    comment: string | null;
    questionPreview: string;
    answerPreview: string;
    pagePathname: string | null;
    locale: string | null;
    createdAt: string;
  }>;
  reuseNote?: string;
  error?: string;
};

type WebsiteKompisFeedbackOverviewPanelProps = {
  labels: WebsiteKompisFeedbackLabels;
  /** Job 61 — inside AppHubShell: no narrow frame or duplicate page header. */
  embedded?: boolean;
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

export function WebsiteKompisFeedbackOverviewPanel({
  labels,
  embedded = false,
}: WebsiteKompisFeedbackOverviewPanelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OverviewPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/website-kompis/feedback?limit=40");
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
  const recent = data?.recent ?? [];

  return (
    <div className={embedded ? "w-full space-y-6" : "mx-auto max-w-5xl space-y-6 px-4 py-8"}>
      {!embedded ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              <Link href="/app/website-kompis/faq" className="text-violet-700 hover:underline">
                {labels.backToFaq}
              </Link>
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">{labels.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">{labels.subtitle}</p>
          </div>
        </div>
      ) : null}

      {!persistenceReady ? (
        <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          <p className="font-medium">{labels.persistenceUnavailableTitle}</p>
          <p className="mt-1">{labels.persistenceUnavailableBody}</p>
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <p>{labels.reuseOffNote}</p>
        <p className="mt-1 text-slate-600">{labels.helpfulNotTruth}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.totals.answers, value: totals.answers },
          { label: labels.totals.helpful, value: totals.helpful },
          { label: labels.totals.notHelpful, value: totals.notHelpful },
          { label: labels.totals.withComment, value: totals.withComment },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      {recent.length === 0 ? (
        <PlatformEmptyState
          title={labels.emptyTitle}
          message={labels.emptyDescription}
          primaryAction={{ label: labels.retry, onClick: () => void load() }}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">{labels.columns.vote}</th>
                <th className="px-3 py-2 font-medium">{labels.columns.question}</th>
                <th className="px-3 py-2 font-medium">{labels.columns.answer}</th>
                <th className="px-3 py-2 font-medium">{labels.columns.comment}</th>
                <th className="px-3 py-2 font-medium">{labels.columns.page}</th>
                <th className="px-3 py-2 font-medium">{labels.columns.when}</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 align-top">
                  <td className="px-3 py-3 whitespace-nowrap">
                    {row.vote === "helpful"
                      ? labels.votes.helpful
                      : labels.votes.notHelpful}
                  </td>
                  <td className="px-3 py-3 max-w-[220px] text-slate-800">
                    {row.questionPreview || "—"}
                  </td>
                  <td className="px-3 py-3 max-w-[260px] text-slate-700">
                    {row.answerPreview || "—"}
                  </td>
                  <td className="px-3 py-3 max-w-[200px] text-slate-600">
                    {row.comment?.trim() || "—"}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-600">
                    {row.pagePathname || "—"}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-600">
                    {formatWhen(row.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
