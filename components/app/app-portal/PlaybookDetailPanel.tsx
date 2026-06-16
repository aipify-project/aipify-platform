"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePlaybookDetail,
  type PlaybookDetail,
  type PlaybookStep,
  type PlaybooksLabels,
} from "@/lib/app-portal/playbooks";

type Props = { playbookId: string; labels: PlaybooksLabels };

export function PlaybookDetailPanel({ playbookId, labels }: Props) {
  const [detail, setDetail] = useState<PlaybookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [saved, setSaved] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDescription, setNewStepDescription] = useState("");
  const [newStepRole, setNewStepRole] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/playbooks/${playbookId}`);
    if (res.ok) {
      const parsed = parsePlaybookDetail(await res.json());
      setDetail(parsed);
      if (parsed.playbook?.notes) setNotes(parsed.playbook.notes);
    }
    setLoading(false);
  }, [playbookId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function saveReview() {
    await fetch(`/api/aipify/playbooks/${playbookId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes,
        last_reviewed_date: new Date().toISOString().slice(0, 10),
        change_summary: changeSummary || "Review completed",
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function addStep() {
    if (!newStepTitle.trim() || !detail?.steps) return;
    const steps: PlaybookStep[] = [
      ...detail.steps,
      {
        id: "",
        step_order: detail.steps.length + 1,
        title: newStepTitle,
        description: newStepDescription,
        responsible_role: newStepRole,
        requires_approval: false,
        related_resources: [],
        checklist_items: [],
      },
    ];
    await fetch(`/api/aipify/playbooks/${playbookId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        steps: steps.map((s) => ({
          title: s.title,
          description: s.description,
          responsible_role: s.responsible_role,
          requires_approval: s.requires_approval,
          related_resources: s.related_resources,
          checklist_items: s.checklist_items,
        })),
        change_summary: changeSummary || "Steps updated",
      }),
    });
    setNewStepTitle("");
    setNewStepDescription("");
    setNewStepRole("");
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

  if (!detail?.found || !detail.playbook) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/playbooks" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const p = detail.playbook;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/playbooks" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{p.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[p.category]} · {labels.statuses[p.status]} · {labels.card.version} v{p.version_number}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{p.description_full ?? p.description}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{p.owner_name}</dd></div>
          {p.last_reviewed_date ? <div><dt className="text-slate-500">{labels.card.lastReviewed}</dt><dd>{p.last_reviewed_date}</dd></div> : null}
          {p.review_frequency ? <div><dt className="text-slate-500">{labels.form.reviewFrequency}</dt><dd>{labels.frequencies[p.review_frequency!]}</dd></div> : null}
        </dl>
        {(p.related_modules?.length ?? 0) > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500">{labels.detail.relatedModules}</p>
            <p className="mt-1 text-sm text-slate-700">{p.related_modules!.join(", ")}</p>
          </div>
        ) : null}
        {(p.related_knowledge_articles?.length ?? 0) > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500">{labels.detail.relatedArticles}</p>
            <p className="mt-1 text-sm text-slate-700">{p.related_knowledge_articles!.join(", ")}</p>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.steps}</h2>
        {(detail.steps?.length ?? 0) === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{labels.form.stepDescription}</p>
        ) : (
          <ol className="mt-4 space-y-4">
            {detail.steps!.map((step, idx) => (
              <li key={step.id || idx} className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <p className="font-medium text-slate-900">{step.step_order}. {step.title || labels.form.stepTitle}</p>
                {step.description ? <p className="mt-1 text-sm text-slate-700">{step.description}</p> : null}
                {step.responsible_role ? <p className="mt-2 text-xs text-slate-500">{labels.form.responsibleRole}: {step.responsible_role}</p> : null}
                {step.requires_approval ? <p className="mt-1 text-xs text-amber-700">{labels.form.requiresApproval}</p> : null}
                {(step.checklist_items?.length ?? 0) > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-slate-600">
                    {step.checklist_items.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                ) : null}
                {(step.related_resources?.length ?? 0) > 0 ? (
                  <p className="mt-2 text-xs text-slate-500">{labels.detail.resources}: {step.related_resources.join(", ")}</p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
        {detail.can_manage ? (
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <input value={newStepTitle} onChange={(e) => setNewStepTitle(e.target.value)} placeholder={labels.form.stepTitle} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={newStepDescription} onChange={(e) => setNewStepDescription(e.target.value)} placeholder={labels.form.stepDescription} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input value={newStepRole} onChange={(e) => setNewStepRole(e.target.value)} placeholder={labels.form.responsibleRole} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void addStep()} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.form.addStep}</button>
          </div>
        ) : null}
      </section>

      {(detail.version_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.versionHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.version_history!.map((v) => (
              <li key={v.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="font-medium">v{v.version_number} — {v.change_summary}</span>
                <span className="text-slate-500">{v.updated_by} · {new Date(v.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.contributors?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.contributors}</h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm text-slate-700">
            {detail.contributors!.map((c) => <li key={c.user_id} className="rounded-full bg-slate-100 px-3 py-1">{c.name}</li>)}
          </ul>
        </section>
      ) : null}

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <input value={changeSummary} onChange={(e) => setChangeSummary(e.target.value)} placeholder={labels.detail.changeSummary} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder={labels.form.notes} />
          <button type="button" onClick={() => void saveReview()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
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
