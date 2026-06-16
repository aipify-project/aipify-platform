"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseLearningDetail,
  type LearningDetail,
  type LearningImprovementLabels,
  type LearningStatus,
} from "@/lib/app-portal/learning-improvement";

type Props = { recordId: string; labels: LearningImprovementLabels };

const STATUSES: LearningStatus[] = ["identified", "under_review", "approved", "in_progress", "implemented", "archived"];

export function LearningImprovementDetailPanel({ recordId, labels }: Props) {
  const [detail, setDetail] = useState<LearningDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<LearningStatus>("identified");
  const [actionTitle, setActionTitle] = useState("");
  const [rootCauses, setRootCauses] = useState("");
  const [recommendedActions, setRecommendedActions] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [expectedOutcomes, setExpectedOutcomes] = useState("");
  const [lessonsApplied, setLessonsApplied] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/learning/${recordId}`);
    if (res.ok) {
      const parsed = parseLearningDetail(await res.json());
      setDetail(parsed);
      if (parsed.record?.notes) setNotes(parsed.record.notes);
      if (parsed.record?.status) setStatus(parsed.record.status);
    }
    setLoading(false);
  }, [recordId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function saveRecord() {
    await fetch(`/api/aipify/learning/${recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes,
        status,
        date_implemented: status === "implemented" ? new Date().toISOString().slice(0, 10) : undefined,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function addAction() {
    if (!actionTitle.trim()) return;
    await fetch(`/api/aipify/learning/${recordId}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: actionTitle,
        root_causes: rootCauses,
        recommended_actions: recommendedActions,
        success_criteria: successCriteria,
        expected_outcomes: expectedOutcomes,
        lessons_applied_elsewhere: lessonsApplied,
      }),
    });
    setActionTitle("");
    setRootCauses("");
    setRecommendedActions("");
    setSuccessCriteria("");
    setExpectedOutcomes("");
    setLessonsApplied("");
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

  if (!detail?.found || !detail.record) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/learning" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const r = detail.record;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/learning" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{r.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[r.category]} · {labels.statuses[r.status]} · {labels.impact[r.impact_level]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{r.description_full ?? r.description}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.dateIdentified}</dt><dd>{r.date_identified}</dd></div>
          {r.date_implemented ? <div><dt className="text-slate-500">{labels.card.dateImplemented}</dt><dd>{r.date_implemented}</dd></div> : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.ownership}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.submittedBy}</dt><dd className="font-medium">{r.submitted_by_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{r.owner_name}</dd></div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.actions}</h2>
        {(detail.actions?.length ?? 0) === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{labels.detail.addAction}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {detail.actions!.map((a) => (
              <li key={a.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-sm">
                <p className="font-medium text-slate-900">{a.title}</p>
                {a.root_causes ? <p className="mt-2 text-slate-700"><span className="text-slate-500">{labels.detail.rootCauses}:</span> {a.root_causes}</p> : null}
                {a.recommended_actions ? <p className="mt-1 text-slate-700"><span className="text-slate-500">{labels.detail.recommendedActions}:</span> {a.recommended_actions}</p> : null}
                {a.success_criteria ? <p className="mt-1 text-xs text-slate-600">{labels.detail.successCriteria}: {a.success_criteria}</p> : null}
                {a.expected_outcomes ? <p className="mt-1 text-xs text-slate-600">{labels.detail.expectedOutcomes}: {a.expected_outcomes}</p> : null}
                {a.lessons_applied_elsewhere ? <p className="mt-1 text-xs text-indigo-800">{labels.detail.lessonsApplied}: {a.lessons_applied_elsewhere}</p> : null}
              </li>
            ))}
          </ul>
        )}
        {detail.can_manage ? (
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <input value={actionTitle} onChange={(e) => setActionTitle(e.target.value)} placeholder={labels.detail.actionTitle} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={rootCauses} onChange={(e) => setRootCauses(e.target.value)} placeholder={labels.detail.rootCauses} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={recommendedActions} onChange={(e) => setRecommendedActions(e.target.value)} placeholder={labels.detail.recommendedActions} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={successCriteria} onChange={(e) => setSuccessCriteria(e.target.value)} placeholder={labels.detail.successCriteria} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={expectedOutcomes} onChange={(e) => setExpectedOutcomes(e.target.value)} placeholder={labels.detail.expectedOutcomes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={lessonsApplied} onChange={(e) => setLessonsApplied(e.target.value)} placeholder={labels.detail.lessonsApplied} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void addAction()} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.detail.addAction}</button>
          </div>
        ) : null}
      </section>

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

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <select value={status} onChange={(e) => setStatus(e.target.value as LearningStatus)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
          </select>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={labels.form.notes} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <button type="button" onClick={() => void saveRecord()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
          {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
        </section>
      ) : null}

      {(detail.activity_timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.activity}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.activity_timeline!.map((a) => (
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
            {detail.recommendations!.map((rec) => (
              <li key={rec.id}>{labels.recommendations[rec.key as keyof typeof labels.recommendations] ?? rec.key}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
