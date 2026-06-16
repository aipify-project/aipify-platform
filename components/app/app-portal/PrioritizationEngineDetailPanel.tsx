"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePrioritizationDetail,
  type PrioritizationDetail,
  type PrioritizationEngineLabels,
  type PriorityStatus,
} from "@/lib/app-portal/prioritization-engine";

type Props = { itemId: string; labels: PrioritizationEngineLabels };

const STATUSES: PriorityStatus[] = ["under_evaluation", "recommended", "high_priority", "medium_priority", "low_priority", "deferred", "completed"];

function ScoreSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium">{value}/5</span>
      </label>
      <input type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full" />
    </div>
  );
}

export function PrioritizationEngineDetailPanel({ itemId, labels }: Props) {
  const [detail, setDetail] = useState<PrioritizationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [scored, setScored] = useState(false);
  const [priorityStatus, setPriorityStatus] = useState<PriorityStatus>("under_evaluation");
  const [alignment, setAlignment] = useState(3);
  const [impact, setImpact] = useState(3);
  const [urgency, setUrgency] = useState(3);
  const [effort, setEffort] = useState(3);
  const [capacity, setCapacity] = useState(3);
  const [dependencies, setDependencies] = useState("");
  const [capacityNotes, setCapacityNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [scoreNotes, setScoreNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/prioritization/${itemId}`);
    if (res.ok) {
      const parsed = parsePrioritizationDetail(await res.json());
      setDetail(parsed);
      const i = parsed.item;
      if (i) {
        setPriorityStatus(i.priority_status);
        setAlignment(i.strategic_alignment_score);
        setImpact(i.impact_score);
        setUrgency(i.urgency_score);
        setEffort(i.effort_estimate);
        setCapacity(i.capacity_requirement);
        setDependencies(i.dependencies ?? "");
        setCapacityNotes(i.capacity_considerations ?? "");
        setNotes(i.notes ?? "");
      }
    }
    setLoading(false);
  }, [itemId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function saveItem() {
    await fetch(`/api/aipify/prioritization/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priority_status: priorityStatus,
        dependencies,
        capacity_considerations: capacityNotes,
        notes,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function submitScore() {
    await fetch(`/api/aipify/prioritization/${itemId}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priority_status: priorityStatus,
        strategic_alignment_score: alignment,
        impact_score: impact,
        urgency_score: urgency,
        effort_estimate: effort,
        capacity_requirement: capacity,
        notes: scoreNotes,
      }),
    });
    setScored(true);
    setTimeout(() => setScored(false), 2500);
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

  if (!detail?.found || !detail.item) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/prioritization" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const i = detail.item;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/prioritization" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{i.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[i.category]} · {labels.priorityStatuses[i.priority_status]}
          {i.matrix_quadrant ? ` · ${labels.quadrants[i.matrix_quadrant]}` : ""}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{i.description_full ?? i.description}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{i.owner_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.sponsor}</dt><dd className="font-medium">{i.executive_sponsor_name}</dd></div>
          {i.due_date ? <div><dt className="text-slate-500">{labels.card.dueDate}</dt><dd>{i.due_date}</dd></div> : null}
          {i.composite_score != null ? <div><dt className="text-slate-500">{labels.card.composite}</dt><dd className="font-medium">{i.composite_score}</dd></div> : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold">{labels.detail.scoringBreakdown}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{labels.detail.strategicAlignment}</p><p className="text-lg font-semibold">{i.strategic_alignment_score}/5</p></div>
          <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{labels.detail.impact}</p><p className="text-lg font-semibold">{i.impact_score}/5</p></div>
          <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{labels.detail.urgency}</p><p className="text-lg font-semibold">{i.urgency_score}/5</p></div>
          <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{labels.detail.effort}</p><p className="text-lg font-semibold">{i.effort_estimate}/5</p></div>
          <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{labels.detail.capacity}</p><p className="text-lg font-semibold">{i.capacity_requirement}/5</p></div>
          {i.matrix_quadrant ? (
            <div className="rounded-lg bg-indigo-50 p-3"><p className="text-xs text-slate-500">{labels.card.quadrant}</p><p className="text-sm font-semibold">{labels.quadrants[i.matrix_quadrant]}</p></div>
          ) : null}
        </div>
        {detail.can_manage ? (
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <ScoreSlider label={labels.detail.strategicAlignment} value={alignment} onChange={setAlignment} />
            <ScoreSlider label={labels.detail.impact} value={impact} onChange={setImpact} />
            <ScoreSlider label={labels.detail.urgency} value={urgency} onChange={setUrgency} />
            <ScoreSlider label={labels.detail.effort} value={effort} onChange={setEffort} />
            <ScoreSlider label={labels.detail.capacity} value={capacity} onChange={setCapacity} />
            <select value={priorityStatus} onChange={(e) => setPriorityStatus(e.target.value as PriorityStatus)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{labels.priorityStatuses[s]}</option>)}
            </select>
            <textarea value={scoreNotes} onChange={(e) => setScoreNotes(e.target.value)} placeholder={labels.detail.notes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void submitScore()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.score}</button>
            {scored ? <p className="text-sm text-emerald-700">{labels.detail.scored}</p> : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold">{labels.detail.capacityConsiderations}</h2>
        {detail.can_manage ? (
          <>
            <textarea value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder={labels.detail.dependencies} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={capacityNotes} onChange={(e) => setCapacityNotes(e.target.value)} placeholder={labels.detail.capacityConsiderations} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={labels.detail.notes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void saveItem()} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium">{labels.detail.save}</button>
            {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
          </>
        ) : (
          <>
            {i.dependencies ? <p className="text-sm"><span className="font-medium">{labels.detail.dependencies}:</span> {i.dependencies}</p> : null}
            {i.capacity_considerations ? <p className="text-sm"><span className="font-medium">{labels.detail.capacityConsiderations}:</span> {i.capacity_considerations}</p> : null}
          </>
        )}
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

      {(detail.related_strategic_initiatives?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedStrategicInitiatives}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_strategic_initiatives!.map((s) => (
              <li key={s.id}><Link href={`/app/operations/strategy/${s.id}`} className="text-indigo-700 hover:underline">{s.title}</Link></li>
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

      {(detail.recommendation_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.recommendationHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.recommendation_history!.map((h) => (
              <li key={h.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <span>
                  {labels.detail.strategicAlignment} {h.strategic_alignment_score}/5 · {labels.detail.impact} {h.impact_score}/5
                  {h.matrix_quadrant ? ` · ${labels.quadrants[h.matrix_quadrant]}` : ""}
                </span>
                <span className="text-xs text-slate-500">{h.performed_by} · {new Date(h.created_at).toLocaleDateString()}</span>
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
