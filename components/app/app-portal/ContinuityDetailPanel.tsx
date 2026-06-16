"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseContinuityDetail,
  type ContinuityDetail,
  type ContinuityLabels,
  type ExerciseType,
} from "@/lib/app-portal/continuity";

type Props = { planId: string; labels: ContinuityLabels };

const EXERCISE_TYPES: ExerciseType[] = ["tabletop", "simulation"];

export function ContinuityDetailPanel({ planId, labels }: Props) {
  const [detail, setDetail] = useState<ContinuityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [recoveryObjectives, setRecoveryObjectives] = useState("");
  const [dependencies, setDependencies] = useState("");
  const [alternativeProcedures, setAlternativeProcedures] = useState("");
  const [escalationPaths, setEscalationPaths] = useState("");
  const [minimumRequirements, setMinimumRequirements] = useState("");
  const [notes, setNotes] = useState("");
  const [exerciseTitle, setExerciseTitle] = useState("");
  const [exerciseType, setExerciseType] = useState<ExerciseType>("tabletop");
  const [exerciseDate, setExerciseDate] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [improvementActions, setImprovementActions] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/continuity/${planId}`);
    if (res.ok) {
      const parsed = parseContinuityDetail(await res.json());
      setDetail(parsed);
      const p = parsed.plan;
      if (p) {
        setRecoveryObjectives(p.recovery_objectives ?? "");
        setDependencies((p.critical_dependencies ?? []).join("\n"));
        setAlternativeProcedures(p.alternative_procedures ?? "");
        setEscalationPaths(p.escalation_paths ?? "");
        setMinimumRequirements(p.minimum_operational_requirements ?? "");
        setNotes(p.notes ?? "");
      }
    }
    setLoading(false);
  }, [planId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function saveRecovery() {
    await fetch(`/api/aipify/continuity/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recovery_objectives: recoveryObjectives,
        critical_dependencies: dependencies.split("\n").map((s) => s.trim()).filter(Boolean),
        alternative_procedures: alternativeProcedures,
        escalation_paths: escalationPaths,
        minimum_operational_requirements: minimumRequirements,
        notes,
        last_reviewed_date: new Date().toISOString().slice(0, 10),
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function addExercise() {
    if (!exerciseTitle.trim()) return;
    await fetch(`/api/aipify/continuity/${planId}/exercise`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: exerciseTitle,
        exercise_type: exerciseType,
        exercise_date: exerciseDate || undefined,
        lessons_learned: lessonsLearned,
        improvement_actions: improvementActions,
      }),
    });
    setExerciseTitle("");
    setExerciseDate("");
    setLessonsLearned("");
    setImprovementActions("");
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

  if (!detail?.found || !detail.plan) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/continuity" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const p = detail.plan;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/continuity" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{p.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[p.category]} · {labels.statuses[p.status]} · {labels.criticality[p.criticality_level]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{p.description_full ?? p.description}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {p.last_reviewed_date ? <div><dt className="text-slate-500">{labels.card.nextReview}</dt><dd>{p.next_review_date ?? p.last_reviewed_date}</dd></div> : null}
          <div><dt className="text-slate-500">{labels.form.reviewFrequency}</dt><dd>{labels.frequencies[p.review_frequency]}</dd></div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.ownership}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{p.owner_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.backupOwner}</dt><dd className="font-medium">{p.backup_owner_name}</dd></div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold">{labels.detail.recovery}</h2>
        {detail.can_manage ? (
          <>
            <textarea value={recoveryObjectives} onChange={(e) => setRecoveryObjectives(e.target.value)} placeholder={labels.form.recoveryObjectives} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={dependencies} onChange={(e) => setDependencies(e.target.value)} placeholder={labels.detail.dependencies} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={alternativeProcedures} onChange={(e) => setAlternativeProcedures(e.target.value)} placeholder={labels.detail.alternativeProcedures} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={escalationPaths} onChange={(e) => setEscalationPaths(e.target.value)} placeholder={labels.detail.escalationPaths} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={minimumRequirements} onChange={(e) => setMinimumRequirements(e.target.value)} placeholder={labels.detail.minimumRequirements} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={labels.form.notes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void saveRecovery()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
            {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
          </>
        ) : (
          <>
            {p.recovery_objectives ? <p className="text-sm text-slate-700">{p.recovery_objectives}</p> : null}
            {(p.critical_dependencies?.length ?? 0) > 0 ? (
              <div><p className="text-xs font-medium text-slate-500">{labels.detail.dependencies}</p><ul className="mt-1 list-inside list-disc text-sm">{p.critical_dependencies!.map((d, i) => <li key={i}>{d}</li>)}</ul></div>
            ) : null}
            {p.alternative_procedures ? <div><p className="text-xs font-medium text-slate-500">{labels.detail.alternativeProcedures}</p><p className="mt-1 text-sm">{p.alternative_procedures}</p></div> : null}
            {p.escalation_paths ? <div><p className="text-xs font-medium text-slate-500">{labels.detail.escalationPaths}</p><p className="mt-1 text-sm">{p.escalation_paths}</p></div> : null}
            {p.minimum_operational_requirements ? <div><p className="text-xs font-medium text-slate-500">{labels.detail.minimumRequirements}</p><p className="mt-1 text-sm">{p.minimum_operational_requirements}</p></div> : null}
          </>
        )}
      </section>

      {(detail.related_playbooks?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedPlaybooks}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_playbooks!.map((pb) => (
              <li key={pb.id}><Link href={`/app/operations/playbooks/${pb.id}`} className="text-indigo-700 hover:underline">{pb.title}</Link></li>
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

      {(detail.related_external_relationships?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedRelationships}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_external_relationships!.map((r) => (
              <li key={r.id}><Link href={`/app/organization/external-relationships/${r.id}`} className="text-indigo-700 hover:underline">{r.name}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.exercises}</h2>
        {(detail.exercises?.length ?? 0) === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{labels.detail.addExercise}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {detail.exercises!.map((ex) => (
              <li key={ex.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-sm">
                <p className="font-medium">{ex.title} · {labels.exerciseTypes[ex.exercise_type]}</p>
                {ex.exercise_date ? <p className="mt-1 text-xs text-slate-500">{ex.exercise_date}</p> : null}
                {ex.lessons_learned ? <p className="mt-2 text-slate-700">{ex.lessons_learned}</p> : null}
                {ex.improvement_actions ? <p className="mt-1 text-xs text-indigo-800">{ex.improvement_actions}</p> : null}
              </li>
            ))}
          </ul>
        )}
        {detail.can_manage ? (
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <input value={exerciseTitle} onChange={(e) => setExerciseTitle(e.target.value)} placeholder={labels.detail.exerciseTitle} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <select value={exerciseType} onChange={(e) => setExerciseType(e.target.value as ExerciseType)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {EXERCISE_TYPES.map((t) => <option key={t} value={t}>{labels.exerciseTypes[t]}</option>)}
            </select>
            <input type="date" value={exerciseDate} onChange={(e) => setExerciseDate(e.target.value)} aria-label={labels.detail.exerciseDate} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={lessonsLearned} onChange={(e) => setLessonsLearned(e.target.value)} placeholder={labels.detail.lessonsLearned} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={improvementActions} onChange={(e) => setImprovementActions(e.target.value)} placeholder={labels.detail.improvementActions} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void addExercise()} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.detail.addExercise}</button>
          </div>
        ) : null}
      </section>

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
            {detail.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
