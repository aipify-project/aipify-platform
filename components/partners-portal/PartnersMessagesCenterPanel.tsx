"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Inbox, MessageSquare, PauseCircle, Send } from "lucide-react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type { PartnersPortalMessagesLabels } from "@/lib/partners-portal/shell-labels";
import { AipifyAlert, AipifyCard, AipifyTabs } from "./design";

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
type Folder = "inbox" | "sent";

/**
 * Partner inbox — Core RPC via /api/certified-sales-partner/messages.
 * Never renders sample or other sellers' messages.
 */
export function PartnersMessagesCenterPanel({ labels }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [folder, setFolder] = useState<Folder>("inbox");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileThread, setMobileThread] = useState(false);
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sendNotice, setSendNotice] = useState<string | null>(null);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setPhase("loading");
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

      const unread = rows.filter(
        (row) => row.direction === "admin_to_partner" && !row.read_at && row.id,
      );
      if (unread.length > 0) {
        const now = new Date().toISOString();
        await Promise.all(
          unread.map(async (row) => {
            try {
              const mark = await fetch("/api/certified-sales-partner/messages/read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message_id: row.id }),
              });
              if (mark.ok) {
                setMessages((prev) =>
                  prev.map((m) => (m.id === row.id ? { ...m, read_at: m.read_at ?? now } : m)),
                );
              }
            } catch {
              // Keep unread locally; next load retries mark-read.
            }
          }),
        );
      }
    } catch {
      setMessages([]);
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages
      .filter((m) =>
        folder === "inbox" ? m.direction === "admin_to_partner" : m.direction === "partner_to_admin",
      )
      .filter((m) => {
        if (!q) return true;
        const hay = `${m.subject ?? ""} ${m.body}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  }, [messages, folder, query]);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !filtered.some((m) => m.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? null);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((m) => m.id === selectedId) ?? null;
  const threadMessages = useMemo(() => {
    if (!selected) return [];
    const tid = selected.thread_id || selected.id;
    return messages
      .filter((m) => (m.thread_id || m.id) === tid)
      .sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
  }, [messages, selected]);

  async function sendReply() {
    const text = reply.trim();
    if (!text || sending) return;
    setSending(true);
    setSendNotice(null);
    try {
      const latestAdmin =
        [...threadMessages].reverse().find((m) => m.direction === "admin_to_partner") ??
        messages.find((m) => m.direction === "admin_to_partner");
      const res = await fetch("/api/certified-sales-partner/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: text,
          thread_id: latestAdmin?.thread_id ?? selected?.thread_id ?? null,
          idempotency_key: `partner-reply-${Date.now()}`,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || (body && body.found === false)) {
        setSendNotice(labels.sendError);
        return;
      }
      setReply("");
      setSendNotice(labels.sendOk);
      await load({ silent: true });
    } catch {
      setSendNotice(labels.sendError);
    } finally {
      setSending(false);
    }
  }

  const showComposer = phase === "ready" || phase === "empty";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#1E293B]">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#64748B]">{labels.subtitle}</p>
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
        <AipifyAlert tone="info" title={labels.emptyTitle}>
          {labels.emptyBody}
        </AipifyAlert>
      ) : null}

      {phase === "ready" ? (
        <div className="space-y-4">
          <AipifyTabs
            ariaLabel={labels.title}
            activeId={folder}
            onChange={(id) => {
              setFolder(id as Folder);
              setMobileThread(false);
            }}
            items={[
              { id: "inbox", label: labels.tabInbox, icon: <Inbox className="h-4 w-4" aria-hidden /> },
              { id: "sent", label: labels.tabSent, icon: <Send className="h-4 w-4" aria-hidden /> },
            ]}
          />

          <label className="block max-w-md text-sm">
            <span className="sr-only">{labels.searchPlaceholder}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full rounded-xl border border-[#E8E4F2] bg-white px-3 py-2.5 text-sm text-[#1E293B]"
            />
          </label>

          <div className="grid gap-4 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)]">
            <AipifyCard
              padding="sm"
              className={`!p-0 overflow-hidden ${mobileThread ? "hidden lg:block" : ""}`}
            >
              <ul className="divide-y divide-[#E8E4F2]" role="listbox" aria-label={labels.tabInbox}>
                {filtered.length === 0 ? (
                  <li className="p-5 text-sm text-[#64748B]">{labels.emptyBody}</li>
                ) : (
                  filtered.map((m) => {
                    const unread = m.direction === "admin_to_partner" && !m.read_at;
                    const active = m.id === selectedId;
                    return (
                      <li key={`list-${m.id}`}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setSelectedId(m.id);
                            setMobileThread(true);
                          }}
                          className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition ${
                            active ? "bg-[#F3EDFF]" : "hover:bg-[#F8F7FC]"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                            <MessageSquare className="h-3.5 w-3.5 text-[#7C3AED]" aria-hidden />
                            <span>{m.direction === "admin_to_partner" ? labels.fromAdmin : labels.fromYou}</span>
                            {unread ? (
                              <span className="rounded-full bg-[#7C3AED]/15 px-2 py-0.5 text-[0.65rem] font-semibold text-[#7C3AED]">
                                {labels.unread}
                              </span>
                            ) : null}
                          </div>
                          <p className="truncate text-sm font-semibold text-[#1E293B]">
                            {m.subject || labels.fromAdmin}
                          </p>
                          <p className="line-clamp-2 text-xs text-[#64748B]">{m.body}</p>
                          <time className="text-[0.7rem] text-[#94A3B8]" dateTime={m.created_at}>
                            {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                          </time>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </AipifyCard>

            <AipifyCard className={!mobileThread ? "hidden lg:block" : undefined} padding="md">
              {selected ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        type="button"
                        className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#7C3AED] lg:hidden"
                        onClick={() => setMobileThread(false)}
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        {labels.backToList}
                      </button>
                      <h2 className="text-lg font-semibold text-[#1E293B]">
                        {selected.subject || labels.fromAdmin}
                      </h2>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {threadMessages.map((m) => (
                      <li
                        key={m.id}
                        className={`rounded-xl border px-4 py-3 ${
                          m.direction === "admin_to_partner"
                            ? "border-[#E8E4F2] bg-white"
                            : "border-[#7C3AED]/20 bg-[#F7F4FF]"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#64748B]">
                          <span>{m.direction === "admin_to_partner" ? labels.fromAdmin : labels.fromYou}</span>
                          <span aria-hidden>·</span>
                          <time dateTime={m.created_at}>
                            {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                          </time>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-[#1E293B]">{m.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <h2 className="text-base font-semibold text-[#1E293B]">{labels.noSelectionTitle}</h2>
                  <p className="mt-2 text-sm text-[#64748B]">{labels.noSelectionBody}</p>
                </div>
              )}
            </AipifyCard>
          </div>
        </div>
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
