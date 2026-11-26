"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Inbox, PauseCircle } from "lucide-react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type { PartnersPortalMessagesLabels } from "@/lib/partners-portal/shell-labels";

type Props = { labels: PartnersPortalMessagesLabels };

type MessageRow = {
  id: string;
  thread_id: string;
  partner_id: string;
  direction: string;
  subject: string | null;
  body: string;
  delivery_status: string;
  created_at: string;
  read_at: string | null;
};

type Phase = "loading" | "ready" | "empty" | "gated" | "error";

/**
 * Partner inbox — Core RPC via /api/certified-sales-partner/messages.
 * Never renders sample or other sellers' messages.
 */
export function PartnersMessagesCenterPanel({ labels }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sendNotice, setSendNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setPhase("loading");
    try {
      const res = await fetch("/api/certified-sales-partner/messages", { cache: "no-store" });
      const body = (await res.json().catch(() => null)) as {
        found?: boolean;
        backend_ready?: boolean;
        error?: string;
        messages?: MessageRow[];
      } | null;

      if (res.status === 403 && body?.error === "partner_not_active") {
        setMessages([]);
        setPhase("gated");
        return;
      }
      if (res.status === 503 || body?.backend_ready === false) {
        setMessages([]);
        setPhase("gated");
        return;
      }
      if (!res.ok || !body || body.found === false) {
        setMessages([]);
        setPhase("error");
        return;
      }

      const rows = Array.isArray(body.messages) ? body.messages : [];
      setMessages(rows);
      setPhase(rows.length === 0 ? "empty" : "ready");

      for (const row of rows) {
        if (row.direction === "admin_to_partner" && !row.read_at && row.id) {
          void fetch("/api/certified-sales-partner/messages/read", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message_id: row.id }),
          });
        }
      }
    } catch {
      setMessages([]);
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function sendReply() {
    const text = reply.trim();
    if (!text || sending) return;
    setSending(true);
    setSendNotice(null);
    try {
      const latestAdmin = messages.find((m) => m.direction === "admin_to_partner");
      const res = await fetch("/api/certified-sales-partner/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: text,
          thread_id: latestAdmin?.thread_id ?? null,
          idempotency_key: `partner-reply-${Date.now()}`,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setSendNotice(labels.sendError);
        return;
      }
      if (body && body.found === false) {
        setSendNotice(labels.sendError);
        return;
      }
      setReply("");
      setSendNotice(labels.sendOk);
      await load();
    } catch {
      setSendNotice(labels.sendError);
    } finally {
      setSending(false);
    }
  }

  const showComposer = phase === "ready" || phase === "empty";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-aipify-text">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-aipify-text-secondary">{labels.subtitle}</p>
      </div>

      {phase === "loading" ? <AipifyLoader centered size="sm" /> : null}

      {phase === "gated" || phase === "error" ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-6 sm:p-8`} aria-labelledby="partners-messages-empty">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-aipify-companion/10 text-aipify-companion">
              <Inbox className="h-6 w-6" aria-hidden />
            </span>
            <div className="min-w-0 space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
                <PauseCircle className="h-4 w-4" aria-hidden />
                <span>
                  {labels.statusLabel}: {labels.statusNotActive}
                </span>
              </p>
              <h2 id="partners-messages-empty" className="text-lg font-semibold text-aipify-text">
                {phase === "error" ? labels.errorTitle : labels.notReadyTitle}
              </h2>
              <p className="max-w-2xl text-sm text-aipify-text-secondary">
                {phase === "error" ? labels.errorBody : labels.notReadyBody}
              </p>
              <p className="max-w-2xl text-sm text-aipify-text-secondary">{labels.nextStep}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => void load()}
                  className="inline-flex min-h-[44px] items-center rounded-xl border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-semibold text-aipify-text hover:border-aipify-companion/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
                >
                  {labels.retry}
                </button>
                <Link
                  href="/partners/account/notifications"
                  className="inline-flex min-h-[44px] items-center rounded-xl bg-aipify-companion px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
                >
                  {labels.notificationsCta}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {phase === "empty" ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-6 sm:p-8`}>
          <h2 className="text-lg font-semibold text-aipify-text">{labels.emptyTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-aipify-text-secondary">{labels.emptyBody}</p>
        </section>
      ) : null}

      {phase === "ready" ? (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={`${AipifyShellClasses.surfaceCard} p-5`}>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-aipify-text-secondary">
                <span>{m.direction === "admin_to_partner" ? labels.fromAdmin : labels.fromYou}</span>
                <span aria-hidden>·</span>
                <time dateTime={m.created_at}>{new Date(m.created_at).toLocaleString()}</time>
              </div>
              {m.subject ? <p className="mt-2 text-sm font-semibold text-aipify-text">{m.subject}</p> : null}
              <p className="mt-2 whitespace-pre-wrap text-sm text-aipify-text-secondary">{m.body}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {showComposer ? (
        <section className={`${AipifyShellClasses.surfaceCard} space-y-3 p-5`}>
          <h2 className="text-base font-semibold text-aipify-text">{labels.replyTitle}</h2>
          <label className="block text-sm">
            <span className="sr-only">{labels.replyPlaceholder}</span>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              maxLength={20000}
              placeholder={labels.replyPlaceholder}
              className="w-full rounded-xl border border-aipify-border bg-white px-3 py-2 text-aipify-text"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={sending || !reply.trim()}
              onClick={() => void sendReply()}
              className="inline-flex min-h-[44px] items-center rounded-xl bg-aipify-companion px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {sending ? labels.sending : labels.sendReply}
            </button>
            {sendNotice ? <p className="text-sm text-aipify-text-secondary">{sendNotice}</p> : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
