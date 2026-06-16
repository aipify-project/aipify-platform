"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseRiskDetail,
  type ImpactLevel,
  type Likelihood,
  type RiskDetail,
  type RisksLabels,
} from "@/lib/app-portal/risks";

type Props = { riskId: string; labels: RisksLabels };

const LIKELIHOODS: Likelihood[] = ["very_low", "low", "moderate", "high", "very_high"];
const IMPACTS: ImpactLevel[] = ["negligible", "minor", "moderate", "major", "critical"];

export function RiskDetailPanel({ riskId, labels }: Props) {
  const [detail, setDetail] = useState<RiskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [mitigationStrategy, setMitigationStrategy] = useState("");
  const [contingencyPlan, setContingencyPlan] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [actionTaken, setActionTaken] = useState("");
  const [effectivenessReview, setEffectivenessReview] = useState("");
  const [residualLikelihood, setResidualLikelihood] = useState<Likelihood>("moderate");
  const [residualImpact, setResidualImpact] = useState<ImpactLevel>("moderate");
  const [escalationRequired, setEscalationRequired] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/risks/${riskId}`);
    if (res.ok) {
      const parsed = parseRiskDetail(await res.json());
      setDetail(parsed);
      if (parsed.risk?.mitigation_strategy) setMitigationStrategy(parsed.risk.mitigation_strategy);
      if (parsed.risk?.contingency_plan) setContingencyPlan(parsed.risk.contingency_plan);
      if (parsed.risk?.notes) setNotes(parsed.risk.notes);
    }
    setLoading(false);
  }, [riskId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function save() {
    await fetch(`/api/aipify/risks/${riskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mitigation_strategy: mitigationStrategy,
        contingency_plan: contingencyPlan,
        notes,
        next_review_date: new Date().toISOString().slice(0, 10),
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function submitMitigation() {
    if (!actionTaken.trim()) return;
    await fetch(`/api/aipify/risks/${riskId}/mitigation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_taken: actionTaken,
        effectiveness_review: effectivenessReview,
        residual_likelihood: residualLikelihood,
        residual_impact: residualImpact,
        escalation_required: escalationRequired,
        next_review_date: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      }),
    });
    setActionTaken("");
    setEffectivenessReview("");
    void load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (!detail?.found || !detail.risk) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/risks" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const r = detail.risk;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/risks" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{r.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[r.category]} · {labels.statuses[r.status]} · {labels.overallLevels[r.overall_level]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{r.description_full ?? r.description}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{r.owner_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.likelihood}</dt><dd>{labels.likelihoods[r.likelihood]}</dd></div>
          <div><dt className="text-slate-500">{labels.card.impact}</dt><dd>{labels.impacts[r.impact]}</dd></div>
          <div><dt className="text-slate-500">{labels.card.level}</dt><dd className="font-medium">{labels.overallLevels[r.overall_level]}</dd></div>
          {r.next_review_date ? <div><dt className="text-slate-500">{labels.card.nextReview}</dt><dd>{r.next_review_date}</dd></div> : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.mitigation}</h2>
        <p className="mt-2 text-sm text-slate-700">{r.mitigation_strategy_full ?? r.mitigation_strategy ?? "—"}</p>
        <h2 className="mt-4 font-semibold">{labels.detail.contingency}</h2>
        <p className="mt-2 text-sm text-slate-700">{r.contingency_plan_full ?? r.contingency_plan ?? "—"}</p>
      </section>

      {(detail.mitigations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.mitigations}</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {detail.mitigations!.map((m) => (
              <li key={m.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <p className="font-medium text-slate-900">{m.action_taken}</p>
                {m.effectiveness_review ? <p className="mt-1 text-slate-600">{m.effectiveness_review}</p> : null}
                {m.residual_level ? <p className="mt-1 text-xs text-slate-500">{labels.detail.residualImpact}: {labels.overallLevels[m.residual_level!]}</p> : null}
                <p className="mt-1 text-xs text-slate-400">{m.performed_by}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="font-semibold">{labels.detail.addMitigation}</h2>
          <textarea value={actionTaken} onChange={(e) => setActionTaken(e.target.value)} placeholder={labels.detail.actionTaken} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={effectivenessReview} onChange={(e) => setEffectivenessReview(e.target.value)} placeholder={labels.detail.effectivenessReview} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={residualLikelihood} onChange={(e) => setResidualLikelihood(e.target.value as Likelihood)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {LIKELIHOODS.map((l) => <option key={l} value={l}>{labels.detail.residualLikelihood}: {labels.likelihoods[l]}</option>)}
            </select>
            <select value={residualImpact} onChange={(e) => setResidualImpact(e.target.value as ImpactLevel)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {IMPACTS.map((i) => <option key={i} value={i}>{labels.detail.residualImpact}: {labels.impacts[i]}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={escalationRequired} onChange={(e) => setEscalationRequired(e.target.checked)} />
            {labels.detail.escalationRequired}
          </label>
          <button type="button" onClick={() => void submitMitigation()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.submitMitigation}</button>
        </section>
      ) : null}

      {(detail.related_follow_ups?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedFollowUps}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_follow_ups!.map((f) => (
              <li key={f.id}><Link href={`/app/operations/follow-ups/${f.id}`} className="text-indigo-700 hover:underline">{f.title}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.related_decisions?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedDecisions}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_decisions!.map((d) => (
              <li key={d.id}><Link href={`/app/operations/decision-center/${d.id}`} className="text-indigo-700 hover:underline">{d.title}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.contributors?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.contributors}</h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {detail.contributors!.map((c) => <li key={c.user_id} className="rounded-full bg-slate-100 px-3 py-1">{c.name}</li>)}
          </ul>
        </section>
      ) : null}

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <textarea value={mitigationStrategy} onChange={(e) => setMitigationStrategy(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder={labels.form.mitigationStrategy} />
          <textarea value={contingencyPlan} onChange={(e) => setContingencyPlan(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder={labels.form.contingencyPlan} />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder={labels.form.notes} />
          <button type="button" onClick={() => void save()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
          {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
        </section>
      ) : null}

      {(detail.audit_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.audit}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {detail.audit_history!.map((a) => (
              <li key={a.id}>{a.description} — <span className="text-slate-500">{a.performed_by}</span></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.detail.recommendations}</h2>
          <ul className="mt-2 list-inside list-disc text-sm">
            {detail.recommendations!.map((rec) => <li key={rec.id}>{labels.recommendations[rec.key as keyof typeof labels.recommendations] ?? rec.key}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
