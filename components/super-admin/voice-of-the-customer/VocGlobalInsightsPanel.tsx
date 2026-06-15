"use client";

import { useCallback, useEffect, useState } from "react";
import { parseVocGlobalInsights, type VocGlobalInsights, type VocGlobalInsightsLabels } from "@/lib/voice-of-the-customer";

type VocGlobalInsightsPanelProps = {
  labels: VocGlobalInsightsLabels;
};

export function VocGlobalInsightsPanel({ labels }: VocGlobalInsightsPanelProps) {
  const [data, setData] = useState<VocGlobalInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/voice-of-the-customer/global-insights");
    if (res.ok) setData(parseVocGlobalInsights(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!data) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">
          {data.principle}
        </p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.insights}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              {labels.insights.totalFeedback}
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-gray-900">
              {data.insights.total_feedback}
            </dd>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              {labels.insights.onboardingRequests}
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-gray-900">
              {data.insights.onboarding_requests}
            </dd>
          </div>
        </dl>
        <p className="mt-4 rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          {data.insights.recommendation}
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.themes}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {data.insights.feature_request_themes.length === 0 ? (
            <li className="text-gray-500">—</li>
          ) : (
            data.insights.feature_request_themes.map((theme) => (
              <li
                key={theme.title}
                className="flex justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <span>{theme.title}</span>
                <span className="text-gray-500">
                  {labels.table.count}: {theme.count}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.initiatives}</h2>
        <ul className="mt-4 space-y-3">
          {data.initiatives.map((initiative) => (
            <li key={initiative.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{initiative.title}</p>
              <p className="mt-1 text-gray-600">{initiative.summary}</p>
              <p className="mt-2 text-indigo-800">{initiative.recommendation}</p>
              <p className="mt-2 text-xs text-gray-500">
                {labels.table.feedbackCount}: {initiative.feedback_count} · {labels.table.phase}:{" "}
                {initiative.linked_phase || "—"}
              </p>
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await fetch("/api/voice-of-the-customer/global-insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: "Customer-driven product initiative",
                  summary: "Initiative created from global VoC insights.",
                  recommendation: data.insights.recommendation,
                  feedback_count: data.insights.onboarding_requests,
                  initiative_type: "cursor_phase",
                }),
              });
              await load();
            } finally {
              setBusy(false);
            }
          }}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {busy ? labels.actions.applying : labels.actions.createInitiative}
        </button>
      </section>
    </div>
  );
}
