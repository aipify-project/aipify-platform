"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseScenarioDetail,
  type ScenarioDetail,
  type ScenarioPlanningLabels,
} from "@/lib/app-portal/scenario-planning";

type Props = { scenarioId: string; labels: ScenarioPlanningLabels };

export function ScenarioPlanningDetailPanel({ scenarioId, labels }: Props) {
  const [data, setData] = useState<ScenarioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/aipify/scenario-planning/${scenarioId}`);
    if (res.ok) {
      setData(parseScenarioDetail(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [scenarioId, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function runSimulation() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/scenario-planning/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "simulate", scenario_id: scenarioId }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.detail.simulateSuccess);
      void load();
    }
  }

  async function submitReview() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/scenario-planning/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "review", scenario_id: scenarioId, review_notes: reviewNotes }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.detail.reviewSuccess);
      void load();
    }
  }

  if (loading && !data) {
    return <p className="text-sm text-slate-600">{labels.loading}</p>;
  }

  if (error || !data?.found) {
    return (
      <div className="space-y-4">
        <Link href="/app/intelligence/scenario-planning" className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
        <p className="text-slate-600">{error || labels.accessDenied}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/intelligence/scenario-planning" className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-2 text-slate-600">{data.summary}</p>
        {data.isolation_note ? <p className="mt-3 text-sm text-slate-500">{labels.detail.isolationNote}</p> : null}
      </div>

      {data.assumptions?.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.card.assumptions}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {data.assumptions.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </section>
      ) : null}

      {data.variables?.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.card.variables}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {data.variables.map((v) => <li key={v}>{v}</li>)}
          </ul>
        </section>
      ) : null}

      {data.projected_outcomes?.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.card.projectedOutcomes}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {data.projected_outcomes.map((o) => <li key={o}>{o}</li>)}
          </ul>
        </section>
      ) : null}

      {data.can_simulate ? (
        <button type="button" disabled={busy} onClick={() => void runSimulation()} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {labels.dashboard.runSimulation}
        </button>
      ) : null}

      {(data.simulations?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{labels.detail.simulations}</h2>
          {data.simulations!.map((sim) => (
            <article key={sim.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-medium text-slate-900">{sim.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{sim.summary}</p>
              <p className="mt-3 text-sm font-medium text-slate-800">{labels.detail.outcomeSummary}</p>
              <p className="mt-1 text-sm text-slate-700">{sim.outcome_summary}</p>
              {(sim.risk_notes?.length ?? 0) > 0 ? (
                <>
                  <p className="mt-3 text-sm font-medium text-slate-800">{labels.detail.riskNotes}</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {sim.risk_notes!.map((n) => <li key={n}>{n}</li>)}
                  </ul>
                </>
              ) : null}
              {(sim.opportunity_notes?.length ?? 0) > 0 ? (
                <>
                  <p className="mt-3 text-sm font-medium text-slate-800">{labels.detail.opportunityNotes}</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {sim.opportunity_notes!.map((n) => <li key={n}>{n}</li>)}
                  </ul>
                </>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {data.can_review ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.markReviewed}</h2>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder={labels.detail.reviewNotes}
            className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            rows={3}
          />
          <button type="button" disabled={busy} onClick={() => void submitReview()} className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {labels.detail.submitReview}
          </button>
        </section>
      ) : null}

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
