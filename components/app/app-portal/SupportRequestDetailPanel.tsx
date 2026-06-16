"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSupportRequestDetail,
  type SupportRequestDetail,
  type SupportRequestStatus,
  type SupportRequestsLabels,
} from "@/lib/app-portal/support-requests";

type Props = { requestId: string; labels: SupportRequestsLabels };

const STATUSES: SupportRequestStatus[] = [
  "open", "in_review", "waiting_for_customer", "waiting_for_aipify", "resolved", "closed",
];

export function SupportRequestDetailPanel({ requestId, labels }: Props) {
  const [detail, setDetail] = useState<SupportRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SupportRequestStatus>("open");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/support-requests/${requestId}`);
    if (res.ok) {
      const parsed = parseSupportRequestDetail(await res.json());
      setDetail(parsed);
      if (parsed.request) setStatus(parsed.request.status);
    }
    setLoading(false);
  }, [requestId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detail fetch on mount
    void load();
  }, [load]);

  async function saveStatus() {
    await fetch(`/api/aipify/support-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
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

  if (!detail?.found || !detail.request) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/support/requests" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const req = detail.request;

  return (
    <div className="space-y-6">
      <Link href="/app/support/requests" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{req.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[req.category]} · {labels.priorities[req.priority]} · {labels.statuses[req.status]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.description}</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{req.description_full ?? req.description}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.createdBy}</dt><dd className="font-medium">{req.created_by}</dd></div>
          <div><dt className="text-slate-500">{labels.card.assignee}</dt><dd>{req.assigned_support_owner}</dd></div>
          <div><dt className="text-slate-500">{labels.card.created}</dt><dd>{new Date(req.created_at).toLocaleString()}</dd></div>
          <div><dt className="text-slate-500">{labels.card.updated}</dt><dd>{new Date(req.updated_at).toLocaleString()}</dd></div>
          {req.related_module ? (
            <div className="sm:col-span-2"><dt className="text-slate-500">{labels.card.module}</dt><dd>{req.related_module}</dd></div>
          ) : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <label className="text-sm font-medium text-slate-700">{labels.card.status}</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as SupportRequestStatus)} className="block w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm">
          {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <button type="button" onClick={() => void saveStatus()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.detail.save}</button>
        {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
      </section>

      {(detail.status_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{labels.detail.statusHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.status_history!.map((s, i) => (
              <li key={`${s.at}-${i}`} className="border-l-2 border-indigo-200 pl-3">
                <span className="font-medium">{s.status}</span>
                <span className="text-slate-500"> · {new Date(s.at).toLocaleString()}</span>
                {s.description ? <p className="text-slate-600">{s.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-5">
        <h2 className="font-semibold text-slate-700">{labels.detail.comments}</h2>
        <p className="mt-2 text-sm text-slate-500">{labels.detail.commentsPlaceholder}</p>
      </section>

      {detail.can_manage ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-5">
          <h2 className="font-semibold text-slate-700">{labels.detail.internalNotes}</h2>
          <p className="mt-2 text-sm text-slate-500">{labels.detail.internalNotesPlaceholder}</p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-5">
        <h2 className="font-semibold text-slate-700">{labels.detail.attachments}</h2>
        <p className="mt-2 text-sm text-slate-500">{labels.detail.attachmentsPlaceholder}</p>
      </section>

      {(detail.related_activity?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{labels.detail.relatedActivity}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {detail.related_activity!.map((e) => (
              <li key={e.id}>{e.description} — {e.performed_by}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">{labels.detail.auditHistory}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {(detail.audit_history ?? []).map((e) => (
            <li key={e.id} className="border-l-2 border-indigo-200 pl-4">
              <p className="font-medium">{e.description}</p>
              <p className="text-xs text-slate-500">{e.performed_by} · {new Date(e.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
