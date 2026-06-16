"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCapabilityCenter,
  type CapabilityCategory,
  type CapabilityCenterLabels,
  type CapabilityCenterResponse,
  type MaturityLevelKey,
} from "@/lib/app-portal/capability-center";

type Props = { labels: CapabilityCenterLabels };

const LEVEL_STYLE: Record<MaturityLevelKey, string> = {
  emerging: "border-slate-200 bg-slate-50 text-slate-800",
  developing: "border-sky-200 bg-sky-50/60 text-sky-900",
  established: "border-indigo-200 bg-indigo-50/60 text-indigo-900",
  optimized: "border-emerald-200 bg-emerald-50/60 text-emerald-900",
  exemplary: "border-violet-200 bg-violet-50/60 text-violet-900",
};

const CATEGORY_KEYS = [
  "governance",
  "operations",
  "collaboration",
  "knowledge_management",
  "customer_success",
  "security",
  "integrations",
  "business_pack_adoption",
  "decision_processes",
  "organizational_memory",
];

export function CapabilityCenterPanel({ labels }: Props) {
  const [data, setData] = useState<CapabilityCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [assessCategory, setAssessCategory] = useState("");
  const [assessLevel, setAssessLevel] = useState(3);
  const [assessNotes, setAssessNotes] = useState("");
  const [assessSuccess, setAssessSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/aipify/capability-center");
    if (res.ok) {
      setData(parseCapabilityCenter(await res.json()));
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

  const submitAssessment = useCallback(async () => {
    if (!assessCategory) return;
    setBusy(true);
    setAssessSuccess(false);
    const res = await fetch("/api/aipify/capability-center/self-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_key: assessCategory, level: assessLevel, notes: assessNotes || undefined }),
    });
    if (res.ok) {
      setData(parseCapabilityCenter(await res.json()));
      setAssessSuccess(true);
      setAssessNotes("");
    }
    setBusy(false);
  }, [assessCategory, assessLevel, assessNotes]);

  const selected = data?.categories?.find((c) => c.key === selectedKey) ?? null;

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

  const dash = data?.dashboard;
  const showEmpty = !data?.has_activity;

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
        </section>
      ) : null}

      {!showEmpty && dash ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.dashboard}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label={labels.dashboard.overallScore} value={`${dash.overall_score}`} />
            <MetricCard label={labels.dashboard.overallLevel} value={labels.levels[dash.overall_level_key]} />
            <MetricCard label={labels.dashboard.trend} value={labels.trends[dash.trend]} />
            <MetricCard label={labels.dashboard.focusAreas} value={`${dash.focus_areas.length}`} />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-slate-700">{labels.dashboard.highest}</h3>
              <CategoryChipList categories={dash.highest_categories} labels={labels} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-700">{labels.dashboard.lowest}</h3>
              <CategoryChipList categories={dash.lowest_categories} labels={labels} />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">{labels.dashboard.advisory}</p>
        </section>
      ) : null}

      {(data?.categories?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.categories}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data!.categories!.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedKey(cat.key === selectedKey ? null : cat.key)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition hover:shadow-sm ${LEVEL_STYLE[cat.level_key]}`}
              >
                <p className="font-medium">{labels.categories[cat.key as keyof typeof labels.categories] ?? cat.key}</p>
                <p className="mt-1 text-xs">{labels.levelNumbers[cat.level]} · {labels.levels[cat.level_key]}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {selected ? (
        <CategoryDetail category={selected} labels={labels} />
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

      {data?.progress ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.progress}</h2>
          {(data.progress.history.length ?? 0) > 0 ? (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-700">{labels.progress.history}</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {data.progress.history.slice(0, 6).map((h) => (
                  <li key={h.recorded_at} className="flex justify-between rounded-lg border border-slate-100 px-3 py-2">
                    <span className="text-slate-600">{new Date(h.recorded_at).toLocaleDateString()}</span>
                    <span className="font-medium text-slate-900">{h.overall_score}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(data.progress.recent_milestones.length ?? 0) > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-700">{labels.progress.milestones}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {data.progress.recent_milestones.map((m) => (
                  <li key={m.key} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-900">
                    {labels.categories[m.key as keyof typeof labels.categories] ?? m.key}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {(data.progress.continued_focus.length ?? 0) > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-700">{labels.progress.continuedFocus}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {data.progress.continued_focus.map((f) => (
                  <li key={f.key} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-950">
                    {labels.categories[f.key as keyof typeof labels.categories] ?? f.key}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.sections.selfAssessment}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-slate-600">{labels.selfAssessment.category}</span>
            <select
              value={assessCategory}
              onChange={(e) => setAssessCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="">{labels.selfAssessment.selectCategory}</option>
              {CATEGORY_KEYS.map((k) => (
                <option key={k} value={k}>{labels.categories[k as keyof typeof labels.categories] ?? k}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">{labels.selfAssessment.level}</span>
            <select
              value={assessLevel}
              onChange={(e) => setAssessLevel(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{labels.levelNumbers[n]}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-4 block text-sm">
          <span className="text-slate-600">{labels.selfAssessment.notes}</span>
          <textarea
            value={assessNotes}
            onChange={(e) => setAssessNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <button
          type="button"
          disabled={busy || !assessCategory}
          onClick={() => void submitAssessment()}
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {labels.selfAssessment.submit}
        </button>
        {assessSuccess ? <p className="mt-2 text-sm text-emerald-700">{labels.selfAssessment.success}</p> : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.howDetermined}</dt><dd className="mt-1 text-slate-600">{labels.faq.howDeterminedAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.comparison}</dt><dd className="mt-1 text-slate-600">{labels.faq.comparisonAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function CategoryChipList({ categories, labels }: { categories: CapabilityCategory[]; labels: CapabilityCenterLabels }) {
  if (categories.length === 0) return <p className="mt-2 text-sm text-slate-500">—</p>;
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {categories.map((c) => (
        <li key={c.key} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
          {labels.categories[c.key as keyof typeof labels.categories] ?? c.key} · {labels.levels[c.level_key]}
        </li>
      ))}
    </ul>
  );
}

function CategoryDetail({ category, labels }: { category: CapabilityCategory; labels: CapabilityCenterLabels }) {
  const label = (map: Record<string, string>, key: string) => map[key as keyof typeof map] ?? key;
  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-6 shadow-sm">
      <h2 className="font-semibold text-slate-900">{labels.sections.detail}</h2>
      <p className="mt-2 text-lg font-medium text-slate-900">
        {labels.categories[category.key as keyof typeof labels.categories] ?? category.key}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {labels.levelNumbers[category.level]} · {labels.levels[category.level_key]}
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DetailList title={labels.detail.strengths} items={category.strengths.map((k) => label(labels.strengths, k))} />
        <DetailList title={labels.detail.improvements} items={category.improvements.map((k) => label(labels.improvements, k))} />
        <DetailList title={labels.detail.actions} items={category.recommended_actions.map((k) => label(labels.actions, k))} />
        <DetailList title={labels.detail.capabilities} items={category.aipify_capabilities.map((k) => label(labels.capabilities, k))} />
      </div>
      <DetailList title={labels.detail.resources} items={category.knowledge_resources.map((k) => label(labels.resources, k))} />
    </section>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
