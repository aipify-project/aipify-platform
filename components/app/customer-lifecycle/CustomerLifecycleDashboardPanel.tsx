"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseCustomerLifecycleDashboard,
  type CustomerLifecycleDashboard,
  type CustomerRecommendation,
} from "@/lib/aipify/customer-lifecycle";

type CustomerLifecycleDashboardPanelProps = {
  labels: Record<string, string>;
};

function bandClass(band?: string) {
  switch (band) {
    case "thriving":
      return "text-emerald-700";
    case "healthy":
      return "text-teal-700";
    case "support_opportunity":
      return "text-amber-700";
    case "at_risk":
      return "text-orange-700";
    case "critical":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

function stageActive(stage: string, current?: string) {
  return stage === current;
}

function RecommendationCard({
  rec,
  labels,
  acting,
  onAction,
}: {
  rec: CustomerRecommendation;
  labels: Record<string, string>;
  acting: string | null;
  onAction: (id: string, action: "accept" | "dismiss") => void;
}) {
  const busy = acting === rec.id;
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="text-xs capitalize text-gray-500">{rec.category?.replace(/_/g, " ")}</span>
        <span className="text-xs font-medium capitalize text-gray-600">{rec.priority}</span>
      </div>
      <p className="mt-1 font-medium text-gray-900">{rec.recommendation}</p>
      {rec.rationale ? <p className="mt-1 text-xs text-gray-500">{rec.rationale}</p> : null}
      {rec.status === "pending" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(rec.id, "accept")}
            className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {labels.accept}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(rec.id, "dismiss")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {labels.dismiss}
          </button>
        </div>
      ) : null}
    </article>
  );
}

export function CustomerLifecycleDashboardPanel({ labels }: CustomerLifecycleDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CustomerLifecycleDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/customer-lifecycle/dashboard");
    if (res.ok) setDashboard(parseCustomerLifecycleDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/customer-lifecycle/briefings/generate", { method: "POST" });
    await load();
  };

  const onRecommendationAction = async (id: string, action: "accept" | "dismiss") => {
    setActing(id);
    await fetch(`/api/aipify/customer-lifecycle/recommendations/${id}/${action}`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold text-sky-900">{labels.successScore}</h2>
        <p className={`mt-2 text-4xl font-bold ${bandClass(dashboard.health_band)}`}>
          {dashboard.success_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium ${bandClass(dashboard.health_band)}`}>
          {dashboard.health_band_label}
        </p>
        <p className="mt-2 text-sm text-sky-800">
          {labels.currentStage}: <span className="font-medium">{dashboard.lifecycle_stage_label}</span>
        </p>
        <p className="mt-1 text-xs text-sky-700">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-sky-600">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      {dashboard.lifecycle_stages && dashboard.lifecycle_stages.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.lifecycleStages}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.lifecycle_stages.map((s) => (
              <span
                key={s.key}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  stageActive(s.key, dashboard.lifecycle_stage)
                    ? "bg-sky-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                title={s.purpose}
              >
                {s.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.score_components ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.scoreComponents}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(dashboard.score_components).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(value)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.quick_wins.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-emerald-800">{labels.quickWins}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.quick_wins.map((w) => (
              <li key={w.id} className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                {w.description}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.milestones.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.milestones}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.milestones.map((m) => (
              <li key={m.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {m.description}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.signals ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {Array.isArray(dashboard.signals.positive) && dashboard.signals.positive.length > 0 ? (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
              <h3 className="text-sm font-semibold text-emerald-800">{labels.positiveSignals}</h3>
              <ul className="mt-2 space-y-1">
                {dashboard.signals.positive.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-900">{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {Array.isArray(dashboard.signals.risk) && dashboard.signals.risk.length > 0 ? (
            <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
              <h3 className="text-sm font-semibold text-amber-800">{labels.riskSignals}</h3>
              <ul className="mt-2 space-y-1">
                {dashboard.signals.risk.map((s, i) => (
                  <li key={i} className="text-sm text-amber-900">{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h2>
        {dashboard.recommendations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noRecommendations}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {dashboard.recommendations.map((r) => (
              <RecommendationCard
                key={r.id}
                rec={r}
                labels={labels}
                acting={acting}
                onAction={onRecommendationAction}
              />
            ))}
          </div>
        )}
      </section>

      {dashboard.playbooks.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.playbooks}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.playbooks.map((p) => {
              const content = p.content as { focus?: string; steps?: string[] } | undefined;
              return (
                <div key={p.id} className="rounded-lg border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">{p.playbook_name}</p>
                  <p className="text-xs capitalize text-gray-500">{p.audience?.replace(/_/g, " ")}</p>
                  {content?.focus ? <p className="mt-2 text-sm text-gray-600">{content.focus}</p> : null}
                  {content?.steps ? (
                    <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
                      {content.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.briefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
