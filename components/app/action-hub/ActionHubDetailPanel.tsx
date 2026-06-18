"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseActionItemDetail, type ActionItemDetail } from "@/lib/aipify/action-hub";
import { formatDate } from "@/lib/i18n/format-date";

type ActionHubDetailPanelProps = {
  actionId: string;
  locale: string;
  labels: Record<string, string>;
};

export function ActionHubDetailPanel({ actionId, locale, labels }: ActionHubDetailPanelProps) {
  const [detail, setDetail] = useState<ActionItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/action-hub/${actionId}`);
    if (res.ok) setDetail(parseActionItemDetail(await res.json()));
    setLoading(false);
  }, [actionId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(status: string) {
    setActing(true);
    await fetch(`/api/aipify/action-hub/${actionId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setActing(false);
  }

  async function sendFeedback(type: string) {
    await fetch(`/api/aipify/action-hub/${actionId}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback_type: type }),
    });
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!detail?.found || !detail.item) {
    return <div className="p-6 text-sm text-gray-600">{labels.notFound}</div>;
  }

  const item = detail.item;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <Link href="/app/actions" className="text-sm text-rose-700">
        {labels.back}
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {item.source_module} · {item.priority} · {item.status}
        </p>
        <p className="mt-4 text-gray-700">{item.description}</p>
        {item.rationale ? (
          <p className="mt-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-900">
            {labels.why}: {item.rationale}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {item.action_url ? (
          <Link
            href={item.action_url}
            className="rounded-lg border border-rose-200 px-4 py-2 text-sm text-rose-700"
          >
            {labels.goToSource}
          </Link>
        ) : null}
        {item.status !== "completed" && item.status !== "dismissed" ? (
          <>
            <button
              type="button"
              disabled={acting}
              onClick={() => void setStatus("in_progress")}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {labels.start}
            </button>
            <button
              type="button"
              disabled={acting}
              onClick={() => void setStatus("completed")}
              className="rounded-lg border border-green-200 px-4 py-2 text-sm text-green-800"
            >
              {labels.complete}
            </button>
            <button
              type="button"
              disabled={acting}
              onClick={() => void setStatus("dismissed")}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600"
            >
              {labels.dismiss}
            </button>
          </>
        ) : null}
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <h2 className="font-semibold">{labels.decisions}</h2>
        {(detail.decisions ?? []).length === 0 ? (
          <p className="mt-2 text-gray-500">{labels.noDecisions}</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {(detail.decisions ?? []).map((d) => (
              <li key={d.id} className="text-gray-600">
                {d.decision_type} — {formatDate(d.created_at, locale)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => void sendFeedback("helpful")} className="text-gray-600 hover:underline">
          {labels.helpful}
        </button>
        <button type="button" onClick={() => void sendFeedback("not_helpful")} className="text-gray-600 hover:underline">
          {labels.notHelpful}
        </button>
      </div>
    </div>
  );
}
