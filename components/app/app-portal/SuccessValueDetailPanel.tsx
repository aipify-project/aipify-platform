"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSuccessDetail,
  type SuccessDetail,
  type SuccessStatus,
  type SuccessValueLabels,
} from "@/lib/app-portal/success-value";

type Props = { initiativeId: string; labels: SuccessValueLabels };

const STATUSES: SuccessStatus[] = ["planned", "in_progress", "measuring", "successful", "partially_successful", "did_not_meet_expectations", "archived"];

export function SuccessValueDetailPanel({ initiativeId, labels }: Props) {
  const [detail, setDetail] = useState<SuccessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<SuccessStatus>("planned");
  const [actualOutcomes, setActualOutcomes] = useState("");
  const [goalsAchieved, setGoalsAchieved] = useState("");
  const [goalsMissed, setGoalsMissed] = useState("");
  const [unexpectedBenefits, setUnexpectedBenefits] = useState("");
  const [unexpectedConsequences, setUnexpectedConsequences] = useState("");
  const [recommendedAdjustments, setRecommendedAdjustments] = useState("");
  const [replicationOpportunities, setReplicationOpportunities] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/success/${initiativeId}`);
    if (res.ok) {
      const parsed = parseSuccessDetail(await res.json());
      setDetail(parsed);
      const i = parsed.initiative;
      if (i) {
        setStatus(i.status);
        setActualOutcomes(i.actual_outcomes ?? "");
        setGoalsAchieved(i.goals_achieved ?? "");
        setGoalsMissed(i.goals_missed ?? "");
        setUnexpectedBenefits(i.unexpected_benefits ?? "");
        setUnexpectedConsequences(i.unexpected_consequences ?? "");
        setRecommendedAdjustments(i.recommended_adjustments ?? "");
        setReplicationOpportunities(i.replication_opportunities ?? "");
        setLessonsLearned(i.lessons_learned ?? "");
        setNotes(i.notes ?? "");
      }
    }
    setLoading(false);
  }, [initiativeId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function saveInitiative() {
    await fetch(`/api/aipify/success/${initiativeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        actual_outcomes: actualOutcomes,
        goals_achieved: goalsAchieved,
        goals_missed: goalsMissed,
        unexpected_benefits: unexpectedBenefits,
        unexpected_consequences: unexpectedConsequences,
        recommended_adjustments: recommendedAdjustments,
        replication_opportunities: replicationOpportunities,
        lessons_learned: lessonsLearned,
        notes,
        completion_date: status === "successful" || status === "partially_successful" ? new Date().toISOString().slice(0, 10) : undefined,
        review_date: new Date().toISOString().slice(0, 10),
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

  if (!detail?.found || !detail.initiative) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/success" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const i = detail.initiative;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/success" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{i.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[i.category]} · {labels.statuses[i.status]} · {labels.valueLevels[i.value_level]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{i.description_full ?? i.description}</p>
        {i.value_hypothesis ? <p className="mt-3 text-sm text-slate-600"><span className="font-medium">{labels.form.valueHypothesis}:</span> {i.value_hypothesis}</p> : null}
        {i.measurement_method ? <p className="mt-2 text-sm text-slate-600"><span className="font-medium">{labels.form.measurementMethod}:</span> {i.measurement_method}</p> : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.expectedVsActual}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">{labels.card.expected}</p>
            <p className="mt-2 text-slate-700">{i.expected_outcomes_full ?? i.expected_outcomes ?? "—"}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">{labels.card.actual}</p>
            <p className="mt-2 text-slate-700">{i.actual_outcomes_full ?? i.actual_outcomes ?? "—"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.ownership}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{i.initiative_owner_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.sponsor}</dt><dd className="font-medium">{i.executive_sponsor_name}</dd></div>
          {i.start_date ? <div><dt className="text-slate-500">{labels.filters.reviewFrom}</dt><dd>{i.start_date}</dd></div> : null}
          {i.completion_date ? <div><dt className="text-slate-500">{labels.filters.reviewTo}</dt><dd>{i.completion_date}</dd></div> : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold">{labels.detail.outcomeAnalysis}</h2>
        {detail.can_manage ? (
          <>
            <textarea value={actualOutcomes} onChange={(e) => setActualOutcomes(e.target.value)} placeholder={labels.card.actual} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={goalsAchieved} onChange={(e) => setGoalsAchieved(e.target.value)} placeholder={labels.detail.goalsAchieved} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={goalsMissed} onChange={(e) => setGoalsMissed(e.target.value)} placeholder={labels.detail.goalsMissed} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={unexpectedBenefits} onChange={(e) => setUnexpectedBenefits(e.target.value)} placeholder={labels.detail.unexpectedBenefits} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={unexpectedConsequences} onChange={(e) => setUnexpectedConsequences(e.target.value)} placeholder={labels.detail.unexpectedConsequences} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={recommendedAdjustments} onChange={(e) => setRecommendedAdjustments(e.target.value)} placeholder={labels.detail.recommendedAdjustments} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={replicationOpportunities} onChange={(e) => setReplicationOpportunities(e.target.value)} placeholder={labels.detail.replicationOpportunities} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={lessonsLearned} onChange={(e) => setLessonsLearned(e.target.value)} placeholder={labels.detail.lessonsLearned} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <select value={status} onChange={(e) => setStatus(e.target.value as SuccessStatus)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
            </select>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={labels.form.notes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void saveInitiative()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
            {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
          </>
        ) : (
          <>
            {i.goals_achieved ? <p className="text-sm"><span className="font-medium">{labels.detail.goalsAchieved}:</span> {i.goals_achieved}</p> : null}
            {i.goals_missed ? <p className="text-sm"><span className="font-medium">{labels.detail.goalsMissed}:</span> {i.goals_missed}</p> : null}
            {i.lessons_learned ? <p className="text-sm"><span className="font-medium">{labels.detail.lessonsLearned}:</span> {i.lessons_learned}</p> : null}
          </>
        )}
      </section>

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

      {(detail.review_timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.reviewTimeline}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.review_timeline!.map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{a.description}</span>
                <span className="text-slate-500">{a.performed_by} · {new Date(a.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.audit_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.audit}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.audit_history!.map((a) => (
              <li key={`audit-${a.id}`} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{a.description}</span>
                <span className="text-slate-500">{new Date(a.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.detail.recommendations}</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {detail.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
