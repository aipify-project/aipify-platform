"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import {
  mapSupportHistoryStatusToSemantic,
  mapSupportPriorityToSeverity,
  SUPPORT_HISTORY_LANDING_HREF,
  type SupportHistoryLabels,
} from "@/lib/app-portal/support-history";
import {
  parseSupportRequestDetail,
  type SupportRequestDetail,
  type SupportRequestStatus,
  type SupportRequestsLabels,
} from "@/lib/app-portal/support-requests";

type Props = {
  requestId: string;
  labels: SupportRequestsLabels;
  historyLabels?: SupportHistoryLabels;
};

const ACTIVE_STATUSES: SupportRequestStatus[] = [
  "open", "in_review", "waiting_for_customer", "waiting_for_aipify", "resolved", "closed", "reopened", "archived",
];

export function SupportRequestDetailPanel({ requestId, labels, historyLabels }: Props) {
  const [detail, setDetail] = useState<SupportRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SupportRequestStatus>("open");
  const [saved, setSaved] = useState(false);
  const [showReopen, setShowReopen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [reopenBusy, setReopenBusy] = useState(false);
  const [reopenSuccess, setReopenSuccess] = useState(false);

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

  async function reopenCase() {
    if (!reopenReason.trim() || !historyLabels) return;
    setReopenBusy(true);
    const res = await fetch(`/api/aipify/support-requests/${requestId}/reopen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reopenReason.trim() }),
    });
    setReopenBusy(false);
    if (res.ok) {
      setReopenSuccess(true);
      setShowReopen(false);
      setReopenReason("");
      void load();
      setTimeout(() => setReopenSuccess(false), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (!detail?.found || !detail.request) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/support/requests" className="text-sm text-violet-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const req = detail.request;
  const isHistorical = detail.is_historical === true;
  const backHref = isHistorical ? SUPPORT_HISTORY_LANDING_HREF : "/app/support/requests";
  const backLabel = isHistorical && historyLabels ? historyLabels.detail.backToHistory : labels.back;
  const statusSemantic = mapSupportHistoryStatusToSemantic(req.status);
  const statusLabel =
    historyLabels?.statuses[req.status] ??
    labels.statuses[req.status as keyof typeof labels.statuses] ??
    req.status;
  const attachments = Array.isArray(req.attachments) ? req.attachments : [];
  const hasAttachments = attachments.length > 0;

  return (
    <div className="space-y-6">
      <Link href={backHref} className="text-sm font-medium text-violet-700 hover:underline">← {backLabel}</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{req.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <SemanticBadge type={statusSemantic.type} value={statusSemantic.value} label={statusLabel} />
            <SemanticBadge
              type="severity"
              value={mapSupportPriorityToSeverity(req.priority)}
              label={labels.priorities[req.priority]}
            />
          </div>
        </div>
        {detail.can_reopen && historyLabels ? (
          <button
            type="button"
            onClick={() => setShowReopen(true)}
            className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100"
          >
            {historyLabels.detail.reopen}
          </button>
        ) : null}
      </div>

      {detail.resolution && historyLabels ? (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h2 className="font-semibold text-slate-900">{historyLabels.detail.resolution}</h2>
          <p className="mt-2 text-sm text-slate-700">{historyLabels.detail.resolutionSummary}</p>
          {detail.resolution.summary ? (
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{detail.resolution.summary}</p>
          ) : null}
          {detail.resolution.resolved_at ? (
            <p className="mt-2 text-xs text-slate-500">{new Date(detail.resolution.resolved_at).toLocaleString()}</p>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.description}</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{req.description_full ?? req.description}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.createdBy}</dt><dd className="font-medium">{req.created_by}</dd></div>
          <div><dt className="text-slate-500">{labels.card.assignee}</dt><dd>{req.assigned_support_owner}</dd></div>
          <div><dt className="text-slate-500">{labels.card.created}</dt><dd>{new Date(req.created_at).toLocaleString()}</dd></div>
          <div><dt className="text-slate-500">{labels.card.updated}</dt><dd>{new Date(req.updated_at).toLocaleString()}</dd></div>
          {req.resolved_at ? (
            <div><dt className="text-slate-500">{historyLabels?.card.resolved ?? "Resolved"}</dt><dd>{new Date(req.resolved_at).toLocaleString()}</dd></div>
          ) : null}
          {req.related_module ? (
            <div className="sm:col-span-2"><dt className="text-slate-500">{labels.card.module}</dt><dd>{req.related_module}</dd></div>
          ) : null}
        </dl>
      </section>

      {!isHistorical && detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <label className="text-sm font-medium text-slate-700">{labels.card.status}</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as SupportRequestStatus)} className="block w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {ACTIVE_STATUSES.filter((s) => !["archived"].includes(s)).map((s) => (
              <option key={s} value={s}>{historyLabels?.statuses[s] ?? labels.statuses[s as keyof typeof labels.statuses] ?? s}</option>
            ))}
          </select>
          <button type="button" onClick={() => void saveStatus()} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">{labels.detail.save}</button>
          {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
        </section>
      ) : null}

      {(detail.status_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{labels.detail.statusHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.status_history!.map((s, i) => (
              <li key={`${s.at}-${i}`} className="border-l-2 border-violet-200 pl-3">
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-700">{labels.detail.attachments}</h2>
        {hasAttachments ? (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {attachments.map((attachment, index) => {
              const row = attachment as Record<string, unknown>;
              const name = typeof row.name === "string" ? row.name : `Attachment ${index + 1}`;
              return <li key={`${name}-${index}`}>{name}</li>;
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">{labels.detail.attachmentsPlaceholder}</p>
        )}
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
            <li key={e.id} className="border-l-2 border-violet-200 pl-4">
              <p className="font-medium">{e.description}</p>
              <p className="text-xs text-slate-500">{e.performed_by} · {new Date(e.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      {reopenSuccess && historyLabels ? (
        <p className="text-sm text-emerald-700">{historyLabels.detail.reopenSuccess}</p>
      ) : null}

      {showReopen && historyLabels ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="reopen-title">
            <h2 id="reopen-title" className="text-lg font-semibold text-slate-900">{historyLabels.detail.reopenTitle}</h2>
            <label className="mt-4 block text-sm">
              <span className="font-medium text-slate-700">{historyLabels.detail.reopenReason}</span>
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder={historyLabels.detail.reopenReasonPlaceholder}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setShowReopen(false)} className="rounded-lg px-4 py-2 text-sm text-slate-600">
                {historyLabels.detail.reopenCancel}
              </button>
              <button
                type="button"
                disabled={reopenBusy || !reopenReason.trim()}
                onClick={() => void reopenCase()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {historyLabels.detail.reopenConfirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
