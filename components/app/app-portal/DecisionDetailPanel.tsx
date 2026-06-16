"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseDecisionDetail,
  type DecisionCenterLabels,
  type DecisionDetail,
  type DecisionStatus,
  type WouldRepeat,
} from "@/lib/app-portal/decision-center";

type Props = { decisionId: string; labels: DecisionCenterLabels };

const STATUSES: DecisionStatus[] = [
  "proposed", "under_review", "approved", "rejected", "implemented", "evaluated",
];
const REPEAT: WouldRepeat[] = ["yes", "partially", "no"];

export function DecisionDetailPanel({ decisionId, labels }: Props) {
  const [detail, setDetail] = useState<DecisionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<DecisionStatus>("proposed");
  const [outcomeRating, setOutcomeRating] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [unexpected, setUnexpected] = useState("");
  const [wouldRepeat, setWouldRepeat] = useState<WouldRepeat | "">("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/decision-center/${decisionId}`);
    if (res.ok) {
      const parsed = parseDecisionDetail(await res.json());
      setDetail(parsed);
      if (parsed.decision) {
        setStatus(parsed.decision.status);
        if (parsed.outcome_evaluation) {
          setOutcomeRating(parsed.outcome_evaluation.outcome_rating ? String(parsed.outcome_evaluation.outcome_rating) : "");
          setLessonsLearned(parsed.outcome_evaluation.lessons_learned ?? "");
          setUnexpected(parsed.outcome_evaluation.unexpected_consequences ?? "");
          setWouldRepeat(parsed.outcome_evaluation.would_repeat ?? "");
        }
      }
    }
    setLoading(false);
  }, [decisionId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveStatus() {
    await fetch(`/api/aipify/decision-center/${decisionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function saveEvaluation() {
    await fetch(`/api/aipify/decision-center/${decisionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outcome_rating: outcomeRating ? Number(outcomeRating) : undefined,
        lessons_learned: lessonsLearned,
        unexpected_consequences: unexpected,
        would_repeat: wouldRepeat || undefined,
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

  if (!detail?.found || !detail.decision) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/decision-center" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const d = detail.decision;
  const canManage = detail.can_manage === true;

  return (
    <div className="space-y-6">
      <Link href="/app/operations/decision-center" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{d.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[d.category]} · {labels.impactLevels[d.impact_level]} · {labels.statuses[d.status]}
        </p>
        <p className="mt-1 text-sm text-slate-500">{labels.card.owner}: {d.decision_owner}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.description}</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{d.description_full ?? d.description}</p>
        {d.expected_outcome ? (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-700">{labels.detail.expectedOutcome}</h3>
            <p className="mt-1 text-sm text-slate-600">{d.expected_outcome}</p>
          </div>
        ) : null}
      </section>

      {(d.contributors?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{labels.detail.contributors}</h2>
          <ul className="mt-2 text-sm">{d.contributors.map((c, i) => <li key={c.id ?? i}>{c.name ?? c.id}</li>)}</ul>
        </section>
      ) : null}

      {(d.supporting_evidence?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{labels.detail.supportingEvidence}</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {d.supporting_evidence.map((e, i) => (
              <li key={i}>
                {e.url ? <a href={e.url} className="text-indigo-700 hover:underline">{e.title ?? e.reference ?? e.url}</a> : (e.title ?? e.reference)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(d.related_business_packs?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{labels.detail.businessPacks}</h2>
          <ul className="mt-2 text-sm">{d.related_business_packs.map((p) => <li key={p}>{p}</li>)}</ul>
        </section>
      ) : null}

      {(detail.related_approvals?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{labels.detail.relatedApprovals}</h2>
          <ul className="mt-2 text-sm">{detail.related_approvals!.map((a) => <li key={a.id}>{a.title} — {a.status}</li>)}</ul>
        </section>
      ) : null}

      {(detail.linked_follow_ups?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{labels.detail.linkedFollowUps}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.linked_follow_ups!.map((f) => (
              <li key={f.id}>
                <Link href={`/app/operations/follow-ups/${f.id}`} className="text-indigo-700 hover:underline">{f.title}</Link>
                <span className="text-slate-500"> — {f.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {canManage ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label className="text-sm font-medium text-slate-700">{labels.card.status}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as DecisionStatus)} className="mt-1 block w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => void saveStatus()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.detail.save}</button>
        </section>
      ) : null}

      <section className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
        <h2 className="font-semibold">{labels.detail.outcomeEvaluation}</h2>
        {detail.outcome_evaluation && !canManage ? (
          <dl className="space-y-2 text-sm">
            {detail.outcome_evaluation.outcome_rating ? (
              <div><dt className="font-medium">{labels.detail.outcomeRating}</dt><dd>{detail.outcome_evaluation.outcome_rating}/5</dd></div>
            ) : null}
            {detail.outcome_evaluation.lessons_learned ? (
              <div><dt className="font-medium">{labels.detail.lessonsLearned}</dt><dd>{detail.outcome_evaluation.lessons_learned}</dd></div>
            ) : null}
            {detail.outcome_evaluation.unexpected_consequences ? (
              <div><dt className="font-medium">{labels.detail.unexpectedConsequences}</dt><dd>{detail.outcome_evaluation.unexpected_consequences}</dd></div>
            ) : null}
            {detail.outcome_evaluation.would_repeat ? (
              <div><dt className="font-medium">{labels.detail.wouldRepeat}</dt><dd>{labels.wouldRepeat[detail.outcome_evaluation.would_repeat]}</dd></div>
            ) : null}
          </dl>
        ) : canManage ? (
          <>
            <div>
              <label className="text-sm font-medium">{labels.detail.outcomeRating}</label>
              <select value={outcomeRating} onChange={(e) => setOutcomeRating(e.target.value)} className="mt-1 block w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={String(n)}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{labels.detail.lessonsLearned}</label>
              <textarea value={lessonsLearned} onChange={(e) => setLessonsLearned(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">{labels.detail.unexpectedConsequences}</label>
              <textarea value={unexpected} onChange={(e) => setUnexpected(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">{labels.detail.wouldRepeat}</label>
              <select value={wouldRepeat} onChange={(e) => setWouldRepeat(e.target.value as WouldRepeat | "")} className="mt-1 block w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="">—</option>
                {REPEAT.map((r) => <option key={r} value={r}>{labels.wouldRepeat[r]}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => void saveEvaluation()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.detail.evaluate}</button>
          </>
        ) : (
          <p className="text-sm text-slate-600">—</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">{labels.detail.timeline}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {(detail.timeline ?? []).map((e) => (
            <li key={e.id} className="border-l-2 border-indigo-200 pl-4">
              <p className="font-medium">{e.description}</p>
              <p className="text-xs text-slate-500">{e.performed_by} · {new Date(e.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">{labels.detail.auditHistory}</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {(detail.audit_history ?? []).map((e) => (
            <li key={`audit-${e.id}`}>{e.event_type}: {e.description}</li>
          ))}
        </ul>
      </section>

      {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
    </div>
  );
}
