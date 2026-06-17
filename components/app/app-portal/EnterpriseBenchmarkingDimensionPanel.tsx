"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  MATURITY_LEVELS,
  parseBenchmarkDimensionDetail,
  type BenchmarkDimensionDetail,
  type EnterpriseBenchmarkingLabels,
} from "@/lib/app-portal/enterprise-benchmarking";

type Props = { labels: EnterpriseBenchmarkingLabels; dimensionKey: string };

export function EnterpriseBenchmarkingDimensionPanel({ labels, dimensionKey }: Props) {
  const [data, setData] = useState<BenchmarkDimensionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assessNotes, setAssessNotes] = useState("");
  const [assessLevel, setAssessLevel] = useState("3");
  const [assessMessage, setAssessMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/aipify/benchmarking/${dimensionKey}`);
    if (res.ok) {
      setData(parseBenchmarkDimensionDetail(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [dimensionKey, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function submitAssessment() {
    setBusy(true);
    setAssessMessage("");
    const res = await fetch("/api/aipify/benchmarking/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dimension_key: dimensionKey, assessment_notes: assessNotes, maturity_level: Number(assessLevel) }),
    });
    setBusy(false);
    if (res.ok) {
      setAssessNotes("");
      setAssessMessage(labels.assessment.success);
      void load();
    }
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error || !data?.found) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/app/intelligence/benchmarking" className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
        <p className="text-slate-600">{error || labels.accessDenied}</p>
      </div>
    );
  }

  const name = labels.dimensions[dimensionKey as keyof typeof labels.dimensions] ?? data.name;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link href="/app/intelligence/benchmarking" className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{name}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {labels.detail.currentLevel}: {labels.maturityLevels[data.maturity_level_label as keyof typeof labels.maturityLevels] ?? data.maturity_level_label} ({data.maturity_score}%)
        </p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2">
        <ListSection title={labels.detail.strengths} items={data.strengths ?? []} />
        <ListSection title={labels.detail.opportunities} items={data.improvement_opportunities ?? []} />
        <ListSection title={labels.detail.recommendedActions} items={data.recommended_actions ?? []} />
        <ListSection title={labels.detail.relatedCapabilities} items={data.related_capabilities ?? []} />
        <ListSection title={labels.detail.learningResources} items={data.learning_resources ?? []} />
      </section>

      {data.can_assess ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 text-sm">
          <p className="font-medium">{labels.detail.completeAssessment}</p>
          <p className="mt-2 text-slate-600">{labels.assessment.governanceNote}</p>
          <select value={assessLevel} onChange={(e) => setAssessLevel(e.target.value)} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2">
            {MATURITY_LEVELS.map((l) => <option key={l} value={String(l)}>{labels.maturityLevels[String(l)]}</option>)}
          </select>
          <textarea value={assessNotes} onChange={(e) => setAssessNotes(e.target.value)} placeholder={labels.assessment.notes} rows={3} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
          <button type="button" disabled={busy} onClick={() => void submitAssessment()} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.assessment.submit}</button>
        </section>
      ) : null}

      {assessMessage ? <p className="text-sm text-emerald-700">{assessMessage}</p> : null}
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}
