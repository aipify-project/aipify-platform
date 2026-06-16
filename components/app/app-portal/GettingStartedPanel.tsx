"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  parseOnboarding,
  type OnboardingLabels,
  type OnboardingResponse,
  type OnboardingStatus,
  type OnboardingTask,
} from "@/lib/app-portal/onboarding";

type Props = { labels: OnboardingLabels };

const TASK_STATUS_STYLE: Record<OnboardingStatus, string> = {
  not_started: "border-slate-200 bg-white text-slate-700",
  in_progress: "border-amber-200 bg-amber-50/50 text-amber-950",
  completed: "border-emerald-200 bg-emerald-50/50 text-emerald-900",
  optional: "border-slate-100 bg-slate-50 text-slate-600",
};

const CATEGORY_ORDER = ["organization", "team", "security", "integrations", "business_packs", "knowledge_support"];

export function GettingStartedPanel({ labels }: Props) {
  const [data, setData] = useState<OnboardingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/aipify/onboarding");
    if (res.ok) {
      setData(parseOnboarding(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? "Access denied");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  const patch = useCallback(async (body: Record<string, string>) => {
    setBusy(true);
    const res = await fetch("/api/aipify/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setData(parseOnboarding(await res.json()));
    }
    setBusy(false);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, OnboardingTask[]>();
    for (const task of data?.checklist ?? []) {
      const list = map.get(task.category) ?? [];
      list.push(task);
      map.set(task.category, list);
    }
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({ category: c, tasks: map.get(c)! }));
  }, [data?.checklist]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <p className="text-sm text-slate-600">{error}</p>
        <Link href="/app" className="text-sm text-indigo-700 hover:underline">← APP Dashboard</Link>
      </div>
    );
  }

  const ov = data?.overview;
  const showEmpty = !data?.started;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {showEmpty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void patch({ action: "start" })}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {labels.emptyCta}
          </button>
        </section>
      ) : null}

      {!showEmpty && ov ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.overview}</h2>
          <div className="mt-4 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-xs text-slate-500">{labels.overview.progress}</p>
              <p className="text-3xl font-semibold text-slate-900">{ov.progress_percent}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{labels.overview.status}</p>
              <p className="text-lg font-medium text-slate-900">{labels.statuses[ov.status]}</p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${ov.progress_percent}%` }} />
          </div>
          <p className="mt-4 text-xs text-slate-500">{labels.overview.advisory}</p>
        </section>
      ) : null}

      {(data?.milestones?.length ?? 0) > 0 ? (
        <section className="space-y-3">
          {data!.milestones!.map((m) => (
            <div key={m.key} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 text-sm text-emerald-950">
              <p className="font-medium">{labels.milestones[m.key as keyof typeof labels.milestones] ?? m.key}</p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void patch({ action: "dismiss_milestone", milestone_key: m.key })}
                className="mt-2 text-xs text-emerald-800 underline hover:no-underline"
              >
                {labels.actions.dismissMilestone}
              </button>
            </div>
          ))}
        </section>
      ) : null}

      {!showEmpty && grouped.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.checklist}</h2>
          <div className="mt-6 space-y-8">
            {grouped.map(({ category, tasks }) => (
              <div key={category}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {labels.categories[category as keyof typeof labels.categories] ?? category}
                </h3>
                <ul className="mt-3 space-y-2">
                  {tasks.map((task) => (
                    <li key={task.key} className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${TASK_STATUS_STYLE[task.status]}`}>
                      <span>{labels.tasks[task.key as keyof typeof labels.tasks] ?? task.key}</span>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs font-medium">{labels.taskStatuses[task.status]}</span>
                        {task.status !== "completed" && task.optional ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void patch({ action: "update_task", task_key: task.key, status: "completed" })}
                            className="text-xs text-indigo-700 underline hover:no-underline"
                          >
                            {labels.actions.markComplete}
                          </button>
                        ) : null}
                        {task.status !== "completed" && !task.auto_detected && !task.optional && ["security_access", "team_permissions", "pack_review", "knowledge_explore", "support_assistant", "support_contact"].includes(task.key) ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void patch({ action: "update_task", task_key: task.key, status: "completed" })}
                            className="text-xs text-indigo-700 underline hover:no-underline"
                          >
                            {labels.actions.markComplete}
                          </button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.recommendations}</h2>
          <ul className="mt-4 space-y-3">
            {data!.recommendations!.map((rec) => (
              <li key={rec.id} className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3 text-sm text-slate-800">
                {labels.recommendations[rec.key as keyof typeof labels.recommendations] ?? rec.key}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data?.adoption_insights ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.adoption}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
              <dt className="text-xs text-slate-500">{labels.adoption.featuresExplored}</dt>
              <dd className="text-lg font-semibold text-slate-900">{data.adoption_insights.features_explored}</dd>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
              <dt className="text-xs text-slate-500">{labels.adoption.featuresNotDiscovered}</dt>
              <dd className="text-sm font-medium text-slate-900">
                {data.adoption_insights.features_not_discovered.length > 0
                  ? data.adoption_insights.features_not_discovered.map((k) => labels.tasks[k as keyof typeof labels.tasks] ?? k).join(", ")
                  : "—"}
              </dd>
            </div>
            {(data.adoption_insights.suggested_business_packs.length ?? 0) > 0 ? (
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 sm:col-span-2">
                <dt className="text-xs text-slate-500">{labels.adoption.suggestedPacks}</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.adoption_insights.suggested_business_packs.map((p) => (
                    <span key={p} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-900">{p}</span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {(data?.completed_milestones?.length ?? 0) > 0 && !showEmpty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.completed}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {data!.completed_milestones!.slice(0, 8).map((t) => (
              <li key={t.key} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-900">
                {labels.tasks[t.key as keyof typeof labels.tasks] ?? t.key}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.requiredSteps}</dt><dd className="mt-1 text-slate-600">{labels.faq.requiredStepsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.revisit}</dt><dd className="mt-1 text-slate-600">{labels.faq.revisitAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}
