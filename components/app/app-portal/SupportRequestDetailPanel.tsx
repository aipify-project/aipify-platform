"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import {
  SUPPORT_HISTORY_LANDING_HREF,
  type SupportHistoryLabels,
} from "@/lib/app-portal/support-history";
import {
  buildSupportConversation,
  formatSupportActivityAt,
  initialsFromName,
  parseSupportRequestDetail,
  supportPriorityTone,
  supportStatusTone,
  supportTicketReference,
  type SupportConversationEntry,
  type SupportRequestDetail,
  type SupportRequestsLabels,
} from "@/lib/app-portal/support-requests";

type Props = {
  requestId: string;
  labels: SupportRequestsLabels;
  locale: string;
  historyLabels?: SupportHistoryLabels;
};

export function SupportRequestDetailPanel({
  requestId,
  labels,
  locale,
  historyLabels,
}: Props) {
  const [detail, setDetail] = useState<SupportRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReopen, setShowReopen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [reopenBusy, setReopenBusy] = useState(false);
  const [reopenSuccess, setReopenSuccess] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replyBusy, setReplyBusy] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replyOk, setReplyOk] = useState(false);
  const [localEntries, setLocalEntries] = useState<SupportConversationEntry[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/support-requests/${requestId}`);
    if (res.ok) {
      setDetail(parseSupportRequestDetail(await res.json()));
      setLocalEntries([]);
    }
    setLoading(false);
  }, [requestId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detail fetch on mount
    void load();
  }, [load]);

  const conversation = useMemo(() => {
    if (!detail?.found) return localEntries;
    const base = buildSupportConversation(detail, {
      customerFallback: labels.customerSender,
      aipifyName: labels.aipifySender,
      systemName: labels.systemSender,
      openingMessage: labels.openingMessage,
      statusChanged: labels.statusChanged,
    });
    if (localEntries.length === 0) return base;
    const ids = new Set(base.map((e) => e.id));
    const merged = [...localEntries.filter((e) => !ids.has(e.id)), ...base];
    merged.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    return merged;
  }, [detail, localEntries, labels]);

  async function postReply() {
    if (!replyBody.trim() || replyBusy) return;
    setReplyBusy(true);
    setReplyError(null);
    const body = replyBody.trim();
    const res = await fetch(`/api/aipify/support-requests/${requestId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body,
        idempotency_key: `${requestId}:${Date.now()}`,
      }),
    });
    setReplyBusy(false);
    if (res.ok) {
      setReplyOk(true);
      setReplyBody("");
      setLocalEntries((prev) => [
        {
          id: `local-reply:${Date.now()}`,
          kind: "message",
          side: "customer",
          author_name: detail?.request?.created_by || labels.customerSender,
          body,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      void load();
      setTimeout(() => setReplyOk(false), 3000);
      return;
    }
    const payload = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    setReplyError(payload.message ?? payload.error ?? labels.detail.replyError);
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

  async function closeCase() {
    if (!detail?.can_manage) return;
    const res = await fetch(`/api/aipify/support-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" }),
    });
    if (res.ok) void load();
  }

  if (loading) {
    return (
      <div className={`${AppLayoutClasses.pageWidth} flex min-h-[30vh] flex-col items-center justify-center`}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" aria-hidden />
        <p className="sr-only">{labels.loading}</p>
      </div>
    );
  }

  if (!detail?.found || !detail.request) {
    return (
      <div className={`${AppLayoutClasses.pageWidth} space-y-4`}>
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/support/requests" className="text-sm text-violet-700 hover:underline">
          ← {labels.backToInbox}
        </Link>
      </div>
    );
  }

  const req = detail.request;
  const isHistorical = detail.is_historical === true;
  const backHref = isHistorical ? SUPPORT_HISTORY_LANDING_HREF : "/app/support/requests";
  const backLabel = isHistorical && historyLabels ? historyLabels.detail.backToHistory : labels.backToInbox;
  const statusTone = supportStatusTone(req.status);
  const priorityTone = supportPriorityTone(req.priority);
  const attachments = Array.isArray(req.attachments) ? req.attachments : [];
  const productLabel =
    req.related_module_label ||
    (req.related_module ? labels.categories[req.category] : null);
  const assignee =
    !req.assigned_support_owner || req.assigned_support_owner === "Unassigned"
      ? labels.detail.unassigned
      : req.assigned_support_owner;

  return (
    <div className={`${AppLayoutClasses.pageWidth} space-y-5`}>
      <Link href={backHref} className="text-sm font-medium text-violet-700 hover:underline">
        ← {backLabel}
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">{req.title}</h1>
            <ToneChip tone={statusTone} label={labels.statuses[req.status]} />
            <ToneChip tone={priorityTone === "urgent" || priorityTone === "high" ? "waiting" : "open"} label={labels.priorities[req.priority]} />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {labels.reference} {supportTicketReference(req.id)}
          </p>
          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
            <div>
              <dt className="inline">{labels.detail.metaCreated}: </dt>
              <dd className="inline">{formatSupportActivityAt(req.created_at, locale)}</dd>
            </div>
            <div>
              <dt className="inline">{labels.detail.metaUpdated}: </dt>
              <dd className="inline">{formatSupportActivityAt(req.updated_at, locale)}</dd>
            </div>
            {productLabel ? (
              <div>
                <dt className="inline">{labels.detail.metaProduct}: </dt>
                <dd className="inline">{productLabel}</dd>
              </div>
            ) : null}
            <div>
              <dt className="inline">{labels.detail.metaAssignee}: </dt>
              <dd className="inline">{assignee}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-wrap gap-2">
          {detail.can_manage && !isHistorical && req.status !== "closed" && req.status !== "resolved" ? (
            <button
              type="button"
              onClick={() => void closeCase()}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {labels.detail.closeCase}
            </button>
          ) : null}
          {detail.can_reopen && historyLabels ? (
            <button
              type="button"
              onClick={() => setShowReopen(true)}
              className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100"
            >
              {historyLabels.detail.reopen}
            </button>
          ) : null}
        </div>
      </header>

      {detail.resolution?.summary ? (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm text-slate-700">
          {detail.resolution.summary}
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-slate-900">{labels.detail.conversation}</h2>
        </div>
        <div className="space-y-3 px-4 py-4 sm:px-5">
          {conversation.length === 0 ? (
            <p className="text-sm text-slate-500">{labels.openingMessage}</p>
          ) : (
            conversation.map((entry) => (
              <ConversationBubble key={entry.id} entry={entry} locale={locale} labels={labels} />
            ))
          )}
        </div>

        {!isHistorical ? (
          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5">
            <label className="block text-sm font-medium text-slate-800" htmlFor="support-reply">
              {labels.detail.sendReply}
            </label>
            <p className="mt-1 text-xs text-slate-500">{labels.detail.replyHint}</p>
            <textarea
              id="support-reply"
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={4}
              maxLength={5000}
              placeholder={labels.detail.replyPlaceholder}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={replyBusy || !replyBody.trim()}
                onClick={() => void postReply()}
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {replyBusy ? labels.detail.replySending : labels.detail.sendReply}
              </button>
              {replyOk ? <p className="text-sm text-emerald-700">{labels.detail.replySent}</p> : null}
              {replyError ? <p className="text-sm text-rose-700" role="alert">{replyError}</p> : null}
            </div>
          </div>
        ) : null}
      </section>

      {attachments.length > 0 ? (
        <section className={AppLayoutClasses.card}>
          <h2 className="text-sm font-semibold text-slate-900">{labels.detail.attachments}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {attachments.map((attachment, index) => {
              const row = attachment as Record<string, unknown>;
              const name = typeof row.name === "string" ? row.name : `${labels.detail.attachments} ${index + 1}`;
              return <li key={`${name}-${index}`}>{name}</li>;
            })}
          </ul>
        </section>
      ) : null}

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

function ConversationBubble({
  entry,
  locale,
  labels,
}: {
  entry: SupportConversationEntry;
  locale: string;
  labels: SupportRequestsLabels;
}) {
  if (entry.kind === "status") {
    return (
      <div className="flex justify-center">
        <p className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          {entry.body} · {formatSupportActivityAt(entry.created_at, locale)}
        </p>
      </div>
    );
  }

  const isCustomer = entry.side === "customer";
  const isAipify = entry.side === "aipify";

  return (
    <div className={`flex gap-3 ${isCustomer ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isAipify ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-700"
        }`}
        aria-hidden
      >
        {initialsFromName(entry.author_name || (isAipify ? labels.aipifySender : labels.customerSender))}
      </div>
      <div className={`max-w-[min(100%,36rem)] ${isCustomer ? "text-right" : ""}`}>
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700">{entry.author_name}</span>
          <span>{formatSupportActivityAt(entry.created_at, locale)}</span>
        </div>
        <div
          className={`rounded-2xl px-4 py-3 text-left text-sm leading-relaxed text-slate-800 ${
            isAipify
              ? "bg-violet-50 ring-1 ring-violet-100"
              : isCustomer
                ? "bg-slate-100 ring-1 ring-slate-200"
                : "bg-white ring-1 ring-slate-200"
          }`}
        >
          <p className="whitespace-pre-wrap">{entry.body}</p>
        </div>
      </div>
    </div>
  );
}

function ToneChip({
  tone,
  label,
}: {
  tone: "open" | "waiting" | "resolved" | "closed" | "neutral";
  label: string;
}) {
  const cls =
    tone === "waiting"
      ? "bg-amber-50 text-amber-900 ring-amber-200"
      : tone === "resolved"
        ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
        : tone === "closed"
          ? "bg-slate-100 text-slate-700 ring-slate-300"
          : tone === "open"
            ? "bg-sky-50 text-sky-900 ring-sky-200"
            : "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
