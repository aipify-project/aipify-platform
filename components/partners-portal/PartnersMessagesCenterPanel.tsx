"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Inbox, MessageSquare, PauseCircle, Send } from "lucide-react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type { PartnersPortalMessagesLabels } from "@/lib/partners-portal/shell-labels";
import {
  compareTimestampsDesc,
  formatPlatformDateTimeClock,
} from "@/lib/platform-presentation-quality/date-time";
import { invalidateCspUnreadBadges } from "@/lib/certified-sales-partner/unread-invalidate";
import { usePollingTask } from "@/lib/polling/use-polling-task";
import {
  CSP_MESSAGES_CLIENT_FETCH_TIMEOUT_MS,
  mapPartnersHrefToAppHost,
} from "@/lib/sales-partner-app-migration/phase-c-shared-surfaces";
import { AipifyAlert, AipifyCard, AipifyTabs } from "./design";

type Props = { labels: PartnersPortalMessagesLabels; locale: string };

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

type Conversation = {
  threadId: string;
  latest: MessageRow;
  rows: MessageRow[];
  unread: number;
};

function initialsFor(direction: string, labels: PartnersPortalMessagesLabels): string {
  const source = direction === "admin_to_partner" ? labels.fromAdmin : labels.fromYou;
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

/**
 * Partner inbox — Core RPC via /api/certified-sales-partner/messages.
 * Never renders sample or other sellers' messages.
 * Mark-read only when a thread is opened — never on mere list load.
 * Own sent messages are never counted as unread.
 */
export function PartnersMessagesCenterPanel({ labels, locale }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [folder, setFolder] = useState<Folder>("inbox");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [mobileThread, setMobileThread] = useState(false);
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sendNotice, setSendNotice] = useState<string | null>(null);
  /** Message IDs successfully marked read — never pre-claim before the API succeeds. */
  const markedIdsRef = useRef<Set<string>>(new Set());
  const loadSeqRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const pollPrimedRef = useRef(false);
  const dateOptions = { locale, emptyFallback: "—", invalidFallback: "—" };

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setPhase("loading");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const seq = ++loadSeqRef.current;
    const timeout = window.setTimeout(() => controller.abort(), CSP_MESSAGES_CLIENT_FETCH_TIMEOUT_MS);
    try {
      const res = await fetch("/api/certified-sales-partner/messages?limit=50", {
        cache: "no-store",
        signal: controller.signal,
      });
      const body = (await res.json().catch(() => null)) as {
        found?: boolean;
        backend_ready?: boolean;
        error?: string;
        messages?: MessageRow[];
      } | null;

      if (seq !== loadSeqRef.current) return false;

      if (res.status === 403 && body?.error === "partner_not_active") {
        setMessages([]);
        setPhase("gated");
        return false;
      }
      if (res.status === 503 || body?.backend_ready === false) {
        setMessages([]);
        setPhase("gated");
        return false;
      }
      if (!res.ok || !body || body.found === false) {
        if (!opts?.silent) {
          setMessages([]);
          setPhase("error");
        }
        return false;
      }

      const rows = Array.isArray(body.messages) ? body.messages : [];
      setMessages(rows);
      setPhase(rows.length === 0 ? "empty" : "ready");
      return true;
    } catch {
      if (controller.signal.aborted || seq !== loadSeqRef.current) {
        if (!opts?.silent && seq === loadSeqRef.current) {
          setMessages([]);
          setPhase("error");
        }
        return false;
      }
      if (!opts?.silent) {
        setMessages([]);
        setPhase("error");
      }
      return false;
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);

  const pollMessages = useCallback(async () => {
    const silent = pollPrimedRef.current;
    const ok = await load({ silent });
    pollPrimedRef.current = true;
    return ok;
  }, [load]);

  usePollingTask({
    taskKey: "csp-partner-messages",
    intervalMs: 45_000,
    hiddenIntervalMs: 120_000,
    enabled: true,
    runImmediately: true,
    execute: pollMessages,
  });

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      loadSeqRef.current += 1;
    };
  }, []);

  const conversations = useMemo(() => {
    const grouped = new Map<string, Conversation>();
    for (const row of messages) {
      const threadId = row.thread_id || row.id;
      const current = grouped.get(threadId);
      if (!current) {
        grouped.set(threadId, {
          threadId,
          latest: row,
          rows: [row],
          unread: row.direction === "admin_to_partner" && !row.read_at ? 1 : 0,
        });
      } else {
        current.rows.push(row);
        if (row.direction === "admin_to_partner" && !row.read_at) current.unread += 1;
        if (compareTimestampsDesc(current.latest.created_at, row.created_at) > 0) {
          current.latest = row;
        }
      }
    }
    return [...grouped.values()]
      .filter((conversation) =>
        folder === "inbox"
          ? conversation.rows.some((row) => row.direction === "admin_to_partner")
          : conversation.rows.some((row) => row.direction === "partner_to_admin"),
      )
      .filter((conversation) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return conversation.rows.some((row) =>
          `${row.subject ?? ""} ${row.body}`.toLowerCase().includes(q),
        );
      })
      .sort((a, b) => compareTimestampsDesc(a.latest.created_at, b.latest.created_at));
  }, [messages, folder, query]);

  useEffect(() => {
    if (conversations.length === 0) {
      setSelectedThreadId(null);
      return;
    }
    if (selectedThreadId && !conversations.some((c) => c.threadId === selectedThreadId)) {
      setSelectedThreadId(null);
      setMobileThread(false);
    }
  }, [conversations, selectedThreadId]);

  const selected = conversations.find((c) => c.threadId === selectedThreadId) ?? null;
  const threadMessages = useMemo(() => {
    if (!selected) return [];
    return [...selected.rows].sort((a, b) => compareTimestampsDesc(a.created_at, b.created_at));
  }, [selected]);

  const markThreadRead = useCallback(async (threadRows: MessageRow[]) => {
    const unread = threadRows.filter(
      (row) =>
        row.direction === "admin_to_partner" &&
        !row.read_at &&
        row.id &&
        !markedIdsRef.current.has(row.id),
    );
    if (unread.length === 0) return;
    const now = new Date().toISOString();
    let markedAny = false;
    await Promise.all(
      unread.map(async (row) => {
        try {
          const mark = await fetch("/api/certified-sales-partner/messages/read", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message_id: row.id }),
          });
          if (mark.ok) {
            markedAny = true;
            markedIdsRef.current.add(row.id);
            setMessages((prev) =>
              prev.map((m) => (m.id === row.id ? { ...m, read_at: m.read_at ?? now } : m)),
            );
          }
        } catch {
          // Keep unread locally; opening again retries mark-read.
        }
      }),
    );
    if (markedAny) invalidateCspUnreadBadges({ partner: true, platform: false });
  }, []);

  // Only mark messages in the thread the seller explicitly opened.
  // New arrivals in that open thread are marked; other threads stay unread.
  useEffect(() => {
    if (!selected) return;
    void markThreadRead(selected.rows);
  }, [selected, markThreadRead]);

  async function openThread(threadId: string) {
    setSelectedThreadId(threadId);
    setMobileThread(true);
  }

  async function sendReply() {
    const text = reply.trim();
    if (!text || sending) return;
    setSending(true);
    setSendNotice(null);
    try {
      const latestAdmin =
        threadMessages.find((m) => m.direction === "admin_to_partner") ??
        messages.find((m) => m.direction === "admin_to_partner");
      const res = await fetch("/api/certified-sales-partner/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: text,
          thread_id: selected?.threadId ?? latestAdmin?.thread_id ?? null,
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
      // Prefer Sent so the seller sees their own reply immediately without manual reload.
      setFolder("sent");
      await load({ silent: true });
      if (selected?.threadId) setSelectedThreadId(selected.threadId);
    } catch {
      setSendNotice(labels.sendError);
    } finally {
      setSending(false);
    }
  }

  // Always expose send when inbox is usable — do not hide composer behind thread selection.
  const showComposer = phase === "ready" || phase === "empty";
  const notificationsHref = mapPartnersHrefToAppHost("/partners/account/notifications");

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
                  href={notificationsHref}
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
                {conversations.length === 0 ? (
                  <li className="p-5 text-sm text-[#64748B]">{labels.emptyBody}</li>
                ) : (
                  conversations.map((conversation) => {
                    const m = conversation.latest;
                    const unread = conversation.unread > 0;
                    const active = conversation.threadId === selectedThreadId;
                    const initials = initialsFor(m.direction, labels);
                    return (
                      <li key={`list-${conversation.threadId}`}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => void openThread(conversation.threadId)}
                          className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                            active ? "bg-[#F3EDFF]" : "hover:bg-[#F8F7FC]"
                          }`}
                        >
                          <span
                            className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-xs font-semibold text-[#7C3AED]"
                            aria-hidden
                          >
                            {initials}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                              <MessageSquare className="h-3.5 w-3.5 text-[#7C3AED]" aria-hidden />
                              <span>
                                {m.direction === "admin_to_partner" ? labels.fromAdmin : labels.fromYou}
                              </span>
                              {unread ? (
                                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[0.65rem] font-semibold text-white">
                                  {labels.unread}
                                </span>
                              ) : null}
                            </span>
                            <p className="truncate text-sm font-semibold text-[#1E293B]">
                              {m.subject || labels.fromAdmin}
                            </p>
                            <p className="line-clamp-2 text-xs font-normal text-[#64748B]">{m.body}</p>
                            <time className="text-[0.7rem] font-normal text-[#94A3B8]" dateTime={m.created_at}>
                              {m.created_at
                                ? formatPlatformDateTimeClock(m.created_at, dateOptions)
                                : ""}
                            </time>
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </AipifyCard>

            <AipifyCard className={!mobileThread ? "hidden lg:block" : undefined} padding="md">
              {selected ? (
                <div className="flex h-full min-h-[22rem] flex-col gap-4">
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
                      {selected.latest.subject || labels.fromAdmin}
                    </h2>
                  </div>
                  <ul className="flex-1 space-y-3 overflow-y-auto">
                    {threadMessages.map((m) => {
                      const mine = m.direction === "partner_to_admin";
                      return (
                        <li key={m.id} className={`flex gap-3 ${mine ? "justify-end" : "justify-start"}`}>
                          {!mine ? (
                            <span
                              className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[0.65rem] font-semibold text-[#7C3AED]"
                              aria-hidden
                            >
                              {initialsFor(m.direction, labels)}
                            </span>
                          ) : null}
                          <div
                            className={`max-w-[min(100%,28rem)] rounded-2xl border px-4 py-3 ${
                              mine
                                ? "border-[#7C3AED]/20 bg-[#F7F4FF]"
                                : "border-[#E8E4F2] bg-white"
                            }`}
                          >
                            <p className="text-xs font-semibold text-[#64748B]">
                              {mine ? labels.fromYou : labels.fromAdmin}
                            </p>
                            <time
                              className="mt-0.5 block text-xs font-normal text-[#94A3B8]"
                              dateTime={m.created_at}
                            >
                              {m.created_at
                                ? formatPlatformDateTimeClock(m.created_at, dateOptions)
                                : ""}
                            </time>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-[#1E293B]">{m.body}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {showComposer ? (
                    <div className="space-y-3 border-t border-[#E8E4F2] pt-4">
                      <h3 className="text-sm font-semibold text-aipify-text">{labels.replyTitle}</h3>
                      <label className="block text-sm">
                        <span className="sr-only">{labels.replyPlaceholder}</span>
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          rows={3}
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
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" aria-hidden />
                          {sending ? labels.sending : labels.sendReply}
                        </button>
                        {sendNotice ? (
                          <p className="text-sm text-aipify-text-secondary">{sendNotice}</p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
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

      {showComposer && (phase === "empty" || !selected) ? (
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
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden />
              {sending ? labels.sending : labels.sendReply}
            </button>
            {sendNotice ? <p className="text-sm text-aipify-text-secondary">{sendNotice}</p> : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
