"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommitmentDetail,
  type CommitmentDetail,
  type CommitmentStatus,
  type CommitmentTrackingLabels,
} from "@/lib/app-portal/commitment-tracking";

type Props = { commitmentId: string; labels: CommitmentTrackingLabels };

const STATUSES: CommitmentStatus[] = ["proposed", "accepted", "in_progress", "at_risk", "fulfilled", "cancelled", "archived"];

export function CommitmentTrackingDetailPanel({ commitmentId, labels }: Props) {
  const [detail, setDetail] = useState<CommitmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [status, setStatus] = useState<CommitmentStatus>("proposed");
  const [progressPercent, setProgressPercent] = useState(0);
  const [fulfillmentCriteria, setFulfillmentCriteria] = useState("");
  const [milestones, setMilestones] = useState("");
  const [delays, setDelays] = useState("");
  const [obstacles, setObstacles] = useState("");
  const [progressUpdate, setProgressUpdate] = useState("");
  const [evidence, setEvidence] = useState("");
  const [lessons, setLessons] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/commitments/${commitmentId}`);
    if (res.ok) {
      const parsed = parseCommitmentDetail(await res.json());
      setDetail(parsed);
      const c = parsed.commitment;
      if (c) {
        setStatus(c.status);
        setProgressPercent(c.progress_percent);
        setFulfillmentCriteria(c.fulfillment_criteria ?? "");
        setMilestones(c.milestones_achieved ?? "");
        setDelays(c.delays_encountered ?? "");
        setObstacles(c.obstacles_identified ?? "");
        setEvidence(c.completion_evidence ?? "");
        setLessons(c.lessons_learned ?? "");
        setNotes(c.notes ?? "");
      }
    }
    setLoading(false);
  }, [commitmentId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function saveCommitment() {
    await fetch(`/api/aipify/commitments/${commitmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, fulfillment_criteria: fulfillmentCriteria, notes }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function recordProgress() {
    await fetch(`/api/aipify/commitments/${commitmentId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        progress_percent: progressPercent,
        status,
        milestones_achieved: milestones,
        delays_encountered: delays,
        obstacles_identified: obstacles,
        progress_update: progressUpdate,
        completion_evidence: evidence,
        lessons_learned: lessons,
      }),
    });
    setRecorded(true);
    setTimeout(() => setRecorded(false), 2500);
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

  if (!detail?.found || !detail.commitment) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/commitments" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const c = detail.commitment;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/commitments" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{c.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.types[c.commitment_type]} · {labels.statuses[c.status]} · {labels.priorities[c.priority]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{c.description_full ?? c.description}</p>
        <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${c.progress_percent}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-600">{labels.card.progress}: {c.progress_percent}%</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.ownership}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{c.owner_name}</dd></div>
          {c.recipient ? <div><dt className="text-slate-500">{labels.card.recipient}</dt><dd>{c.recipient}</dd></div> : null}
          {c.commitment_date ? <div><dt className="text-slate-500">{labels.filters.dueFrom}</dt><dd>{c.commitment_date}</dd></div> : null}
          {c.due_date ? <div><dt className="text-slate-500">{labels.card.dueDate}</dt><dd>{c.due_date}</dd></div> : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.fulfillmentCriteria}</h2>
        <p className="mt-2 text-sm text-slate-700">{c.fulfillment_criteria_full ?? c.fulfillment_criteria ?? "—"}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold">{labels.detail.fulfillmentTracking}</h2>
        {detail.can_manage ? (
          <>
            <input type="range" min={0} max={100} value={progressPercent} onChange={(e) => setProgressPercent(Number(e.target.value))} className="w-full" aria-label={labels.card.progress} />
            <select value={status} onChange={(e) => setStatus(e.target.value as CommitmentStatus)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
            </select>
            <textarea value={fulfillmentCriteria} onChange={(e) => setFulfillmentCriteria(e.target.value)} placeholder={labels.detail.fulfillmentCriteria} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={milestones} onChange={(e) => setMilestones(e.target.value)} placeholder={labels.detail.milestonesAchieved} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={delays} onChange={(e) => setDelays(e.target.value)} placeholder={labels.detail.delaysEncountered} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={obstacles} onChange={(e) => setObstacles(e.target.value)} placeholder={labels.detail.obstaclesIdentified} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={progressUpdate} onChange={(e) => setProgressUpdate(e.target.value)} placeholder={labels.detail.progressUpdate} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder={labels.detail.completionEvidence} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={lessons} onChange={(e) => setLessons(e.target.value)} placeholder={labels.detail.lessonsLearned} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={labels.detail.notes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void recordProgress()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.recordProgress}</button>
              <button type="button" onClick={() => void saveCommitment()} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium">{labels.detail.save}</button>
            </div>
            {recorded ? <p className="text-sm text-emerald-700">{labels.detail.progressRecorded}</p> : null}
            {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
          </>
        ) : (
          <>
            {c.milestones_achieved ? <p className="text-sm"><span className="font-medium">{labels.detail.milestonesAchieved}:</span> {c.milestones_achieved}</p> : null}
            {c.lessons_learned ? <p className="text-sm"><span className="font-medium">{labels.detail.lessonsLearned}:</span> {c.lessons_learned}</p> : null}
          </>
        )}
      </section>

      {(detail.progress_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.progressHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.progress_history!.map((h) => (
              <li key={h.id} className="border-b border-slate-100 pb-2">
                <p>{h.progress_update || `${labels.card.progress}: ${h.progress_percent ?? 0}%`}</p>
                <p className="text-xs text-slate-500">{h.performed_by} · {new Date(h.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.related_goals?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedGoals}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_goals!.map((g) => (
              <li key={g.id}><Link href={`/app/operations/goals/${g.id}`} className="text-indigo-700 hover:underline">{g.title}</Link></li>
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

      {(detail.related_communications?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedCommunications}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_communications!.map((cm) => (
              <li key={cm.id}><Link href={`/app/organization/communications/${cm.id}`} className="text-indigo-700 hover:underline">{cm.title}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.audit_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.audit}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.audit_history!.map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{a.description}</span>
                <span className="text-xs text-slate-500">{a.performed_by} · {new Date(a.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-sm font-medium text-slate-900">{labels.detail.recommendations}</p>
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
