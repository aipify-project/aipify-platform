"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseStrategyDetail,
  type StrategyDetail,
  type StrategyExecutionLabels,
  type StrategyStatus,
} from "@/lib/app-portal/strategy-execution";

type Props = { initiativeId: string; labels: StrategyExecutionLabels };

const STATUSES: StrategyStatus[] = ["planning", "active", "on_track", "needs_attention", "delayed", "completed", "archived"];

export function StrategyExecutionDetailPanel({ initiativeId, labels }: Props) {
  const [detail, setDetail] = useState<StrategyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<StrategyStatus>("planning");
  const [progressPercent, setProgressPercent] = useState(0);
  const [successDefinition, setSuccessDefinition] = useState("");
  const [notes, setNotes] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneTarget, setMilestoneTarget] = useState("");
  const [milestoneNotes, setMilestoneNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/strategy/${initiativeId}`);
    if (res.ok) {
      const parsed = parseStrategyDetail(await res.json());
      setDetail(parsed);
      const i = parsed.initiative;
      if (i) {
        setStatus(i.status);
        setProgressPercent(i.progress_percent);
        setSuccessDefinition(i.success_definition ?? "");
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
    await fetch(`/api/aipify/strategy/${initiativeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        progress_percent: progressPercent,
        success_definition: successDefinition,
        notes,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function addMilestone() {
    if (!milestoneTitle.trim()) return;
    await fetch(`/api/aipify/strategy/${initiativeId}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: milestoneTitle,
        target_date: milestoneTarget || undefined,
        notes: milestoneNotes,
      }),
    });
    setMilestoneTitle("");
    setMilestoneTarget("");
    setMilestoneNotes("");
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
        <Link href="/app/operations/strategy" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const i = detail.initiative;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/strategy" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{i.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[i.category]} · {labels.statuses[i.status]} · {labels.importanceLevels[i.strategic_importance]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{i.description_full ?? i.description}</p>
        {i.success_definition ? (
          <p className="mt-3 text-sm text-slate-600">
            <span className="font-medium">{labels.detail.successDefinition}:</span> {i.success_definition_full ?? i.success_definition}
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.ownership}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{i.initiative_owner_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.sponsor}</dt><dd className="font-medium">{i.executive_sponsor_name}</dd></div>
          {i.start_date ? <div><dt className="text-slate-500">{labels.filters.targetFrom}</dt><dd>{i.start_date}</dd></div> : null}
          {i.target_date ? <div><dt className="text-slate-500">{labels.card.targetDate}</dt><dd>{i.target_date}</dd></div> : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold">{labels.detail.progressTracking}</h2>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${i.progress_percent}%` }} />
        </div>
        <p className="text-sm text-slate-600">{labels.card.progress}: {i.progress_percent}%</p>
        {detail.can_manage ? (
          <>
            <input type="range" min={0} max={100} value={progressPercent} onChange={(e) => setProgressPercent(Number(e.target.value))} className="w-full" aria-label={labels.card.progress} />
            <select value={status} onChange={(e) => setStatus(e.target.value as StrategyStatus)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
            </select>
            <textarea value={successDefinition} onChange={(e) => setSuccessDefinition(e.target.value)} placeholder={labels.detail.successDefinition} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={labels.form.notes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void saveInitiative()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
            {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
          </>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.milestoneTimeline}</h2>
        {(detail.milestone_timeline?.length ?? 0) > 0 ? (
          <ul className="mt-3 space-y-3 text-sm">
            {detail.milestone_timeline!.map((m) => (
              <li key={m.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <p className="font-medium text-slate-900">{m.title}</p>
                  <p className="text-xs text-slate-500">{labels.card.owner}: {m.owner_name}</p>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <p>{labels.milestoneStatuses[m.status]}</p>
                  {m.target_date ? <p>{m.target_date}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">—</p>
        )}
        {detail.can_manage ? (
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <p className="text-sm font-medium">{labels.detail.addMilestone}</p>
            <input value={milestoneTitle} onChange={(e) => setMilestoneTitle(e.target.value)} placeholder={labels.detail.milestoneTitle} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input type="date" value={milestoneTarget} onChange={(e) => setMilestoneTarget(e.target.value)} aria-label={labels.detail.milestoneTarget} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={milestoneNotes} onChange={(e) => setMilestoneNotes(e.target.value)} placeholder={labels.detail.milestoneNotes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void addMilestone()} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900">{labels.detail.milestoneSubmit}</button>
          </div>
        ) : null}
      </section>

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

      {(detail.related_risks?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedRisks}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_risks!.map((r) => (
              <li key={r.id}><Link href={`/app/operations/risks/${r.id}`} className="text-indigo-700 hover:underline">{r.title}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.execution_insights?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.executionInsights}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {detail.execution_insights!.map((ins) => (
              <li key={ins.id}>{labels.insights[ins.key as keyof typeof labels.insights] ?? ins.key}</li>
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
