"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGoalDetail,
  type GoalDetail,
  type GoalStatus,
  type OrganizationalGoalsLabels,
  type ProgressUpdateType,
} from "@/lib/app-portal/organizational-goals";

type Props = { goalId: string; labels: OrganizationalGoalsLabels };

const STATUSES: GoalStatus[] = ["draft", "active", "at_risk", "on_track", "achieved", "cancelled"];
const UPDATE_TYPES: ProgressUpdateType[] = [
  "milestone_achieved", "progress_change", "challenge", "lesson_learned", "support_needed",
];

export function OrganizationalGoalDetailPanel({ goalId, labels }: Props) {
  const [detail, setDetail] = useState<GoalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<GoalStatus>("active");
  const [progressPercent, setProgressPercent] = useState(0);
  const [saved, setSaved] = useState(false);
  const [updateType, setUpdateType] = useState<ProgressUpdateType>("progress_change");
  const [updateNotes, setUpdateNotes] = useState("");
  const [updateProgress, setUpdateProgress] = useState<number | "">("");
  const [milestoneTitle, setMilestoneTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/goals/${goalId}`);
    if (res.ok) {
      const parsed = parseGoalDetail(await res.json());
      setDetail(parsed);
      if (parsed.goal) {
        setStatus(parsed.goal.status);
        setProgressPercent(parsed.goal.progress_percent);
      }
    }
    setLoading(false);
  }, [goalId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function saveGoal() {
    await fetch(`/api/aipify/goals/${goalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, progress_percent: progressPercent }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function recordProgress() {
    await fetch(`/api/aipify/goals/${goalId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        update_type: updateType,
        progress_percent: updateProgress === "" ? undefined : updateProgress,
        milestone_title: milestoneTitle || undefined,
        notes: updateNotes,
      }),
    });
    setUpdateNotes("");
    setMilestoneTitle("");
    setUpdateProgress("");
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

  if (!detail?.found || !detail.goal) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/goals" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const g = detail.goal;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/goals" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{g.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{labels.goalTypes[g.goal_type]} · {labels.priorities[g.priority]} · {labels.statuses[g.status]}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{g.description}</p>
        <p className="mt-4 text-xs text-slate-500">{labels.card.owner}: {g.owner_name}</p>
        {g.target_date ? <p className="text-xs text-slate-500">{labels.card.targetDate}: {g.target_date}</p> : null}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${g.progress_percent}%` }} />
        </div>
        <p className="mt-1 text-sm text-slate-600">{labels.card.progress}: {g.progress_percent}%</p>
      </section>

      {g.success_criteria ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.successCriteria}</h2>
          <p className="mt-2 text-sm text-slate-700">{g.success_criteria_full ?? g.success_criteria}</p>
        </section>
      ) : null}

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <select value={status} onChange={(e) => setStatus(e.target.value as GoalStatus)} className="block w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
          </select>
          <input type="number" min={0} max={100} value={progressPercent} onChange={(e) => setProgressPercent(Number(e.target.value))} className="block w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm" aria-label={labels.detail.progressPercent} />
          <button type="button" onClick={() => void saveGoal()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
          {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold">{labels.detail.progressUpdate}</h2>
        <select value={updateType} onChange={(e) => setUpdateType(e.target.value as ProgressUpdateType)} className="block w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm">
          {UPDATE_TYPES.map((t) => <option key={t} value={t}>{labels.progressTypes[t]}</option>)}
        </select>
        <input type="number" min={0} max={100} value={updateProgress} onChange={(e) => setUpdateProgress(e.target.value === "" ? "" : Number(e.target.value))} placeholder={labels.detail.progressPercent} className="block w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={milestoneTitle} onChange={(e) => setMilestoneTitle(e.target.value)} placeholder={labels.detail.milestoneTitle} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <textarea value={updateNotes} onChange={(e) => setUpdateNotes(e.target.value)} placeholder={labels.detail.notes} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <button type="button" onClick={() => void recordProgress()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.recordProgress}</button>
      </section>

      {(detail.progress_timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.progressTimeline}</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {detail.progress_timeline!.map((p) => (
              <li key={p.id} className="border-l-2 border-indigo-200 pl-4">
                <p className="font-medium">{labels.progressTypes[p.update_type]}</p>
                {p.milestone_title ? <p className="text-slate-700">{p.milestone_title}</p> : null}
                {p.notes ? <p className="text-slate-600">{p.notes}</p> : null}
                <p className="text-xs text-slate-500">{p.created_by} · {new Date(p.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.contributors?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.contributors}</h2>
          <ul className="mt-2 flex flex-wrap gap-2">{detail.contributors!.map((c) => <li key={c.user_id} className="rounded-full bg-slate-100 px-3 py-1 text-xs">{c.name}</li>)}</ul>
        </section>
      ) : null}

      <RelatedSection title={labels.detail.relatedFollowUps} items={detail.related_follow_ups} hrefPrefix="/app/operations/follow-ups" />
      <RelatedSection title={labels.detail.relatedDecisions} items={detail.related_decisions} hrefPrefix="/app/operations/decision-center" />

      {(detail.audit_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.auditHistory}</h2>
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
          <ul className="mt-2 list-inside list-disc text-sm">{detail.recommendations!.map((r) => <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>)}</ul>
        </section>
      ) : null}
    </div>
  );
}

function RelatedSection({ title, items, hrefPrefix }: { title: string; items?: Array<{ id: string; title: string; status: string }>; hrefPrefix: string }) {
  if (!items?.length) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id}><Link href={`${hrefPrefix}/${item.id}`} className="text-indigo-700 hover:underline">{item.title}</Link></li>
        ))}
      </ul>
    </section>
  );
}
