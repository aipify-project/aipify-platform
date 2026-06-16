"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSuccessCenter,
  type HealthStatus,
  type SuccessCenterLabels,
  type SuccessCenterResponse,
} from "@/lib/app-portal/success-center";

type Props = { labels: SuccessCenterLabels };

const STATUS_STYLE: Record<HealthStatus, string> = {
  excellent: "border-emerald-200 bg-emerald-50/60 text-emerald-900",
  healthy: "border-sky-200 bg-sky-50/60 text-sky-900",
  attention_needed: "border-amber-200 bg-amber-50/60 text-amber-950",
  at_risk: "border-rose-200 bg-rose-50/60 text-rose-950",
};

export function SuccessCenterPanel({ labels }: Props) {
  const [data, setData] = useState<SuccessCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/aipify/success-center");
    if (res.ok) {
      setData(parseSuccessCenter(await res.json()));
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

      {ov ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.overview}</h2>
          <div className={`mt-4 rounded-xl border p-4 ${STATUS_STYLE[ov.health_status]}`}>
            <p className="text-sm font-medium">{labels.overview.healthStatus}: {labels.healthStatuses[ov.health_status]}</p>
            <p className="mt-1 text-3xl font-semibold">{ov.customer_health_score}</p>
            <p className="mt-1 text-sm">{labels.overview.healthScore}</p>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreCard label={labels.overview.adoptionScore} value={ov.adoption_score} />
            <ScoreCard label={labels.overview.engagementScore} value={ov.team_engagement_score} />
            <ScoreCard label={labels.overview.utilizationScore} value={ov.feature_utilization_score} />
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs text-slate-500">{labels.overview.riskLevel}</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">{labels.riskLevels[ov.risk_level]}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-slate-500">{labels.overview.advisory}</p>
        </section>
      ) : null}

      {(data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.recommendations}</h2>
          <ul className="mt-4 space-y-3">
            {data!.recommendations!.map((rec) => (
              <li key={rec.id} className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3 text-sm text-slate-800">
                {labels.recommendations[rec.key as keyof SuccessCenterLabels["recommendations"]] ?? rec.key}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data?.timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.timeline}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data!.timeline!.map((e) => (
              <li key={e.id} className="border-l-2 border-indigo-200 pl-4">
                <p className="font-medium text-slate-900">{e.title}</p>
                <p className="text-slate-600">{e.description}</p>
                <p className="text-xs text-slate-500">{new Date(e.occurred_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data?.growth_opportunities?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.growth}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {data!.growth_opportunities!.filter((g) => g.available).map((g) => (
              <li key={g.key} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-900">
                {labels.growth[g.key as keyof SuccessCenterLabels["growth"]] ?? g.key}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data?.adoption_insights?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.adoption}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {data!.adoption_insights!.map((a) => (
              <div key={a.key} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                <dt className="text-xs text-slate-500">{labels.adoption[a.label_key as keyof SuccessCenterLabels["adoption"]] ?? a.label_key}</dt>
                <dd className="text-lg font-semibold text-slate-900">{a.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {(data?.health_factors?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.factors}</h2>
          <dl className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
            {data!.health_factors!.map((f) => (
              <div key={f.key} className="flex justify-between rounded-lg border border-slate-100 px-3 py-2">
                <dt className="text-slate-600">{labels.factors[f.key as keyof SuccessCenterLabels["factors"]] ?? f.key}</dt>
                <dd className="font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.healthScore}</dt><dd className="mt-1 text-slate-600">{labels.faq.healthScoreAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.predictRisk}</dt><dd className="mt-1 text-slate-600">{labels.faq.predictRiskAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
