"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  filterCspMessageRecipients,
  isCspMessageRecipientEligible,
  type CspMessageRecipient,
} from "@/lib/certified-sales-partner/message-recipient-picker";
import {
  compareTimestampsDesc,
  formatPlatformDateTimeClock,
} from "@/lib/platform-presentation-quality/date-time";

type Labels = {
  newMessage: string;
  closeCompose: string;
  fromAdmin: string;
  fromPartner: string;
  allConversations: string;
  sentByAdmin: string;
  threadEmpty: string;
  archiveBlocked: string;
  folderArchive: string;
  deliveryStatus: Record<string, string>;
  unnamedRecipient: string;
  recipientSearchPlaceholder: string;
  recipientEmpty: string;
  recipientNotEligible: string;
  sendMessageSubject: string;
  sendMessageBody: string;
  sendMessageCta: string;
  sendMessageBlocked: string;
  loading: string;
  retry: string;
  forbiddenTitle: string;
  forbiddenBody: string;
  errorTitle: string;
  errorBody: string;
  emptyTitle: string;
  emptyBody: string;
  notReported: string;
  dateEmpty: string;
  dateInvalid: string;
  partnerStatusLabels: Record<string, string>;
  unread: string;
};

type Row = Record<string, unknown>;

function text(row: Row, key: string): string {
  const value = row[key];
  return typeof value === "string" ? value : "";
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const value = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  return value || "•";
}

function isUnreadFromPartner(row: Row): boolean {
  return text(row, "direction") === "partner_to_admin" && !text(row, "read_at");
}

export function CertifiedSellersMessageDesk({
  rows,
  recipients,
  recipientsPhase,
  labels: l,
  locale,
  busy,
  notice,
  phase,
  onSend,
  onRetryRecipients,
  onMarkRead,
}: {
  rows: Row[];
  recipients: CspMessageRecipient[];
  recipientsPhase: "loading" | "ready" | "closed" | "forbidden" | "error";
  labels: Labels;
  locale: string;
  busy: boolean;
  notice: string | null;
  phase: "loading" | "ready" | "closed" | "forbidden" | "error";
  onSend: (partnerId: string, subject: string, body: string) => Promise<boolean>;
  onRetryRecipients: () => void;
  onMarkRead?: (messageIds: string[]) => Promise<void>;
}) {
  const [listFilter, setListFilter] = useState<"all" | "sent" | "archive">("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  /** True only after an explicit conversation click — never auto-mark the first list row. */
  const [openedByUser, setOpenedByUser] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const markedRef = useRef<Set<string>>(new Set());
  const dateOptions = { locale, emptyFallback: l.dateEmpty, invalidFallback: l.dateInvalid };

  const conversations = useMemo(() => {
    const grouped = new Map<
      string,
      { partnerId: string; latest: string; preview: string; unread: number; rows: Row[] }
    >();
    for (const row of rows) {
      const partnerId = text(row, "partner_id");
      if (!partnerId) continue;
      const created = text(row, "created_at");
      const current = grouped.get(partnerId);
      if (!current) {
        grouped.set(partnerId, {
          partnerId,
          latest: created,
          preview: text(row, "body"),
          unread: isUnreadFromPartner(row) ? 1 : 0,
          rows: [row],
        });
      } else {
        current.rows.push(row);
        if (isUnreadFromPartner(row)) current.unread += 1;
        if (compareTimestampsDesc(current.latest, created) > 0) {
          current.latest = created;
          current.preview = text(row, "body") || current.preview;
        }
      }
    }
    return [...grouped.values()].sort((a, b) => compareTimestampsDesc(a.latest, b.latest));
  }, [rows]);

  const visible = conversations.filter((conversation) => {
    if (listFilter === "sent" && !conversation.rows.some((row) => text(row, "direction") === "admin_to_partner")) {
      return false;
    }
    const partner = recipients.find((item) => item.id === conversation.partnerId);
    const name = partner?.displayName || "";
    const haystack = `${name} ${conversation.preview}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  const active =
    (activeId ? visible.find((item) => item.partnerId === activeId) : null) ??
    (!openedByUser ? visible[0] ?? null : null);
  const thread = [...(active?.rows ?? [])].sort((a, b) =>
    compareTimestampsDesc(text(a, "created_at"), text(b, "created_at")),
  );
  const selected = recipients.find((item) => item.id === recipientId) ?? null;
  const filteredRecipients = filterCspMessageRecipients(recipients, recipientQuery);

  useEffect(() => {
    // Mark-read only after the operator opens a conversation — never on list load /
    // default preview of the first row (that incorrectly cleared unread for others).
    if (!openedByUser || !active || !onMarkRead) return;
    const unreadIds = active.rows
      .filter(isUnreadFromPartner)
      .map((row) => text(row, "id"))
      .filter((id) => id && !markedRef.current.has(id));
    if (unreadIds.length === 0) return;
    for (const id of unreadIds) markedRef.current.add(id);
    void onMarkRead(unreadIds).catch(() => {
      for (const id of unreadIds) markedRef.current.delete(id);
    });
  }, [active, onMarkRead, openedByUser]);

  async function submit(partnerId: string) {
    const partner = recipients.find((item) => item.id === partnerId);
    if (partner && !isCspMessageRecipientEligible(partner.status)) return;
    const ok = await onSend(partnerId, subject, body);
    if (ok) {
      setBody("");
      setComposeOpen(false);
      setActiveId(partnerId);
      setOpenedByUser(true);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="tablist" aria-label={l.allConversations}>
          {(
            [
              ["all", l.allConversations],
              ["sent", l.sentByAdmin],
              ["archive", l.folderArchive],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={listFilter === id}
              onClick={() => setListFilter(id)}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${
                listFilter === id ? "bg-[color:var(--aipify-companion-purple)] text-white" : "border border-[color:var(--aipify-border)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setComposeOpen(true)}
          className="rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white"
        >
          {l.newMessage}
        </button>
      </div>
      {listFilter === "archive" ? (
        <p className="rounded-2xl border border-dashed border-[color:var(--aipify-border)] bg-white p-4 text-sm text-[color:var(--aipify-text-secondary)]">
          {l.archiveBlocked}
        </p>
      ) : (
        <div className="grid min-h-[28rem] overflow-hidden rounded-2xl border border-[color:var(--aipify-border)] bg-white lg:grid-cols-[minmax(16rem,34%)_1fr]">
          <div className="border-b border-[color:var(--aipify-border)] lg:border-b-0 lg:border-r">
            <label className="block p-3">
              <span className="sr-only">{l.recipientSearchPlaceholder}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={l.recipientSearchPlaceholder}
                className="w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
              />
            </label>
            {phase === "loading" ? <AipifyLoader centered size="sm" label={l.loading} /> : null}
            {phase === "ready" && visible.length === 0 ? (
              <p className="px-3 pb-4 text-sm text-[color:var(--aipify-text-secondary)]">{l.emptyBody}</p>
            ) : null}
            <ul className="max-h-[32rem] overflow-y-auto">
              {visible.map((conversation) => {
                const partner = recipients.find((item) => item.id === conversation.partnerId);
                const name = partner?.displayName || l.unnamedRecipient;
                const selectedRow = active?.partnerId === conversation.partnerId;
                return (
                  <li key={conversation.partnerId}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(conversation.partnerId);
                        setOpenedByUser(true);
                      }}
                      className={`flex w-full gap-3 px-3 py-3 text-left ${selectedRow ? "bg-violet-50" : "hover:bg-[color:var(--aipify-canvas)]"}`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-800">
                        {initials(name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="block truncate text-sm font-semibold text-[color:var(--aipify-text-primary)]">
                            {name}
                          </span>
                          {conversation.unread > 0 ? (
                            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[0.65rem] font-semibold text-white">
                              {l.unread}
                            </span>
                          ) : null}
                        </span>
                        <span className="block truncate text-xs font-normal text-[color:var(--aipify-text-secondary)]">
                          {conversation.preview || l.notReported}
                        </span>
                        <span className="block text-xs font-normal text-[color:var(--aipify-text-secondary)]">
                          {formatPlatformDateTimeClock(conversation.latest || null, dateOptions)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex min-h-[24rem] flex-col">
            {active ? (
              <>
                <div className="border-b border-[color:var(--aipify-border)] px-4 py-3">
                  <Link
                    href={`/platform/sellers/partners/${active.partnerId}`}
                    className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
                  >
                    {recipients.find((item) => item.id === active.partnerId)?.displayName || l.unnamedRecipient}
                  </Link>
                </div>
                <ol className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {thread.map((row) => {
                    const admin = text(row, "direction") === "admin_to_partner";
                    const delivery = text(row, "delivery_status");
                    const deliveryLabel = delivery
                      ? l.deliveryStatus[delivery] || l.deliveryStatus.unknown || l.notReported
                      : "";
                    return (
                      <li
                        key={text(row, "id") || text(row, "created_at")}
                        className={`flex ${admin ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[min(100%,28rem)] rounded-2xl border px-4 py-3 ${
                            admin
                              ? "border-[color:var(--aipify-companion-purple)]/20 bg-[#F7F4FF]"
                              : "border-[color:var(--aipify-border)] bg-white"
                          }`}
                        >
                          <p className="text-xs font-semibold text-[color:var(--aipify-text-secondary)]">
                            {admin ? l.fromAdmin : l.fromPartner}
                          </p>
                          <time
                            className="mt-0.5 block text-xs font-normal text-[color:var(--aipify-text-secondary)]"
                            dateTime={text(row, "created_at") || undefined}
                          >
                            {formatPlatformDateTimeClock(text(row, "created_at") || null, dateOptions)}
                            {deliveryLabel ? ` · ${deliveryLabel}` : ""}
                          </time>
                          {text(row, "subject") ? (
                            <p className="mt-2 text-sm font-semibold">{text(row, "subject")}</p>
                          ) : null}
                          <p className="mt-2 whitespace-pre-wrap text-sm text-[color:var(--aipify-text-primary)]">
                            {text(row, "body") || l.notReported}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <form
                  className="space-y-2 border-t border-[color:var(--aipify-border)] p-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void submit(active.partnerId);
                  }}
                >
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder={l.sendMessageBody}
                    rows={3}
                    className="w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={busy || !body.trim()}
                    className="rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {l.sendMessageCta}
                  </button>
                  {notice ? <p className="text-sm text-[color:var(--aipify-text-secondary)]">{notice}</p> : null}
                </form>
              </>
            ) : (
              <p className="p-4 text-sm text-[color:var(--aipify-text-secondary)]">{l.threadEmpty}</p>
            )}
          </div>
        </div>
      )}
      {composeOpen ? (
        <div
          className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4 shadow-sm"
          role="dialog"
          aria-label={l.newMessage}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">{l.newMessage}</h2>
            <button
              type="button"
              onClick={() => setComposeOpen(false)}
              className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
            >
              {l.closeCompose}
            </button>
          </div>
          <input
            value={recipientQuery}
            onChange={(event) => setRecipientQuery(event.target.value)}
            placeholder={l.recipientSearchPlaceholder}
            className="mt-3 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
          />
          {recipientsPhase === "loading" ? <AipifyLoader centered size="sm" label={l.loading} /> : null}
          {recipientsPhase === "error" || recipientsPhase === "forbidden" ? (
            <button
              type="button"
              onClick={onRetryRecipients}
              className="mt-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
            >
              {l.retry}
            </button>
          ) : null}
          <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-[color:var(--aipify-border)]">
            {filteredRecipients.slice(0, 20).map((recipient) => {
              const eligible = isCspMessageRecipientEligible(recipient.status);
              return (
                <li key={recipient.id}>
                  <button
                    type="button"
                    disabled={!eligible}
                    onClick={() => setRecipientId(recipient.id)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm disabled:opacity-50"
                  >
                    <span>{recipient.displayName || l.unnamedRecipient}</span>
                    <span className="text-xs text-[color:var(--aipify-text-secondary)]">
                      {l.partnerStatusLabels[recipient.status] ?? l.partnerStatusLabels.unknown}
                      {!eligible ? ` · ${l.recipientNotEligible}` : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {filteredRecipients.length === 0 ? (
            <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{l.recipientEmpty}</p>
          ) : null}
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder={l.sendMessageSubject}
            className="mt-3 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
          />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={l.sendMessageBody}
            rows={4}
            className="mt-2 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
          />
          {selected && !isCspMessageRecipientEligible(selected.status) ? (
            <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{l.sendMessageBlocked}</p>
          ) : null}
          <button
            type="button"
            disabled={
              busy ||
              !recipientId ||
              !body.trim() ||
              (selected != null && !isCspMessageRecipientEligible(selected.status))
            }
            onClick={() => void submit(recipientId)}
            className="mt-3 rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {l.sendMessageCta}
          </button>
          {notice ? <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{notice}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
