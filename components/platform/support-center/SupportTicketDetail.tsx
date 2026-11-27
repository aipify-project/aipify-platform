"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality";
import {
  nextStatusOptions,
  SUPPORT_STATUS_TRANSITIONS,
  ticketReference,
  type SupportTimelineEntry,
} from "@/lib/platform-portal/support-center";
import type { PlatformSupportTicketsListItem } from "@/lib/platform-portal/support-tickets-read-adapter";
import type { SupportCenterLabels } from "./support-center-labels";
import {
  assigneeLabelFor,
  FlashMessage,
  inputClass,
  labelFor,
  primaryButtonClass,
  priorityTone,
  secondaryButtonClass,
  StatusChip,
  statusTone,
  type SupportFlash,
} from "./support-center-ui";

export type SupportBusyScope = "reply" | "send" | "note" | "status" | "assign";
export type SupportFeedbackScope = SupportBusyScope | "template";

export type SupportDetailState = {
  status: "loading" | "ready" | "error";
  description: string;
  status_code: string | null;
  timeline: SupportTimelineEntry[];
};

type Props = {
  labels: SupportCenterLabels;
  locale: string;
  ticket: PlatformSupportTicketsListItem;
  detail: SupportDetailState;
  viewerUserId: string | null;
  templates: Array<{ id: string; name: string }>;
  selectedTemplateId: string;
  replyDraft: string;
  noteDraft: string;
  statusChoice: string;
  busy: SupportBusyScope | null;
  feedback: { scope: SupportFeedbackScope; flash: SupportFlash } | null;
  /** True right after a successful draft save and before further edits. */
  replySaved: boolean;
  signatureReady: boolean;
  onReplyChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onStatusChoice: (value: string) => void;
  onTemplatePick: (id: string) => void;
  onSaveDraft: () => void;
  onSendReply: () => void;
  onSaveNote: () => void;
  onUpdateStatus: () => void;
  onAssignToMe: () => void;
  onAttachSignature: () => void;
  onClose: () => void;
  /** Returns false when the user cancelled leaving a dirty draft. */
  onLeaveForCustomer: () => boolean;
};

function Section({
  title,
  children,
  tone = "plain",
}: {
  title: string;
  children: ReactNode;
  tone?: "plain" | "reply" | "note";
}) {
  const toneClass =
    tone === "reply"
      ? "border-violet-200 bg-violet-50/40"
      : tone === "note"
        ? "border-amber-200 bg-amber-50/50"
        : "border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)]";
  return (
    <section className={`rounded-xl border p-4 ${toneClass}`}>
      <h3 className="text-sm font-semibold text-[color:var(--aipify-text)]">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[color:var(--aipify-text)]">{children}</dd>
    </div>
  );
}

export default function SupportTicketDetail(props: Props) {
  const {
    labels,
    locale,
    ticket,
    detail,
    viewerUserId,
    busy,
    feedback,
  } = props;

  const currentStatus = detail.status_code ?? ticket.status;
  const statusOptions = nextStatusOptions(currentStatus, SUPPORT_STATUS_TRANSITIONS);
  const assignedToMe = Boolean(
    viewerUserId && ticket.assigned_support_owner_id === viewerUserId,
  );
  const formatDate = (value: string | null) =>
    value
      ? formatPlatformDateTimeFull(value, {
          locale,
          emptyFallback: "—",
          invalidFallback: "—",
        })
      : "—";
  const scopedFlash = (scope: SupportFeedbackScope) =>
    feedback && feedback.scope === scope ? feedback.flash : null;

  return (
    <article className="space-y-4 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-xl font-semibold text-[color:var(--aipify-text)]">
            {ticket.title}
          </h2>
          <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
            {ticket.company_name || "—"} · {ticketReference(ticket.id)}
          </p>
          {ticket.company_id ? (
            <Link
              href={`/platform/customers/${ticket.company_id}`}
              onClick={(event) => {
                if (!props.onLeaveForCustomer()) event.preventDefault();
              }}
              className="mt-1 inline-flex text-sm font-medium text-[color:var(--aipify-companion-purple)] hover:underline"
            >
              {labels.viewCustomer}
            </Link>
          ) : null}
        </div>
        <button type="button" onClick={props.onClose} className={secondaryButtonClass}>
          {labels.detail.back}
        </button>
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Meta label={labels.status}>
          <StatusChip
            code={currentStatus}
            map={labels.statusLabels}
            tone={statusTone(currentStatus)}
          />
        </Meta>
        <Meta label={labels.priority}>
          <StatusChip
            code={ticket.priority}
            map={labels.priorityLabels}
            tone={priorityTone(ticket.priority)}
          />
        </Meta>
        <Meta label={labels.channel}>{labelFor(labels.channelLabels, ticket.channel)}</Meta>
        <Meta label={labels.assignee}>
          {assigneeLabelFor(ticket, viewerUserId, labels)}
        </Meta>
        <Meta label={labels.category}>
          {labelFor(labels.categoryLabels, ticket.category)}
        </Meta>
        <Meta label={labels.lastUpdated}>{formatDate(ticket.updated_at)}</Meta>
      </dl>

      <Section title={labels.detail.description}>
        {detail.status === "loading" ? (
          <AipifyLoader label={labels.detail.loadingDetail} size="sm" />
        ) : (
          <>
            {detail.status === "error" ? (
              <FlashMessage flash={{ tone: "info", text: labels.detail.detailError }} />
            ) : null}
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[color:var(--aipify-text)]">
              {detail.description || labels.detail.noDescription}
            </p>
          </>
        )}
      </Section>

      <Section title={labels.status}>
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[12rem] flex-1 text-sm">
            <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
              {labels.detail.statusLabel}
            </span>
            <select
              className={inputClass}
              value={props.statusChoice}
              onChange={(e) => props.onStatusChoice(e.target.value)}
            >
              {statusOptions.map((code) => (
                <option key={code} value={code}>
                  {labelFor(labels.statusLabels, code)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={busy !== null || props.statusChoice === currentStatus}
            onClick={props.onUpdateStatus}
          >
            {labels.detail.updateStatus}
          </button>
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={busy !== null || assignedToMe || !viewerUserId}
            onClick={props.onAssignToMe}
          >
            {labels.assignToMe}
          </button>
        </div>
        <FlashMessage flash={scopedFlash("status")} />
        <FlashMessage flash={scopedFlash("assign")} />
      </Section>

      <div className="grid gap-4 2xl:grid-cols-2">
        <Section title={labels.reply.draft} tone="reply">
          <p className="text-xs text-[color:var(--aipify-text-secondary)]">
            {labels.reply.customerReplyHint}
          </p>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
              {labels.reply.chooseTemplate}
            </span>
            <select
              className={inputClass}
              value={props.selectedTemplateId}
              onChange={(e) => props.onTemplatePick(e.target.value)}
            >
              <option value="">—</option>
              {props.templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </label>
          <textarea
            aria-label={labels.reply.draft}
            className={`${inputClass} min-h-[11rem] resize-y`}
            placeholder={labels.reply.replyPlaceholder}
            value={props.replyDraft}
            onChange={(e) => props.onReplyChange(e.target.value)}
          />
          <p className="text-xs text-amber-800">{labels.reply.emailOff}</p>
          <p className="text-xs text-[color:var(--aipify-text-secondary)]">
            {labels.reply.sendReplyCorePending}
          </p>
          <FlashMessage flash={scopedFlash("reply") ?? scopedFlash("send") ?? scopedFlash("template")} />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={busy !== null || !props.signatureReady || !props.replyDraft.trim()}
              onClick={props.onAttachSignature}
            >
              {labels.reply.attachSignature}
            </button>
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={busy !== null || !props.replyDraft.trim() || props.replySaved}
              onClick={props.onSaveDraft}
            >
              {props.replySaved ? labels.saved : labels.reply.saveDraft}
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              disabled={busy !== null || !props.replyDraft.trim()}
              onClick={props.onSendReply}
            >
              {labels.reply.sendReply}
            </button>
          </div>
        </Section>

        <Section title={labels.reply.internalNote} tone="note">
          <p className="text-xs text-[color:var(--aipify-text-secondary)]">
            {labels.reply.internalNoteHint}
          </p>
          <textarea
            aria-label={labels.reply.internalNote}
            className={`${inputClass} min-h-[11rem] resize-y`}
            placeholder={labels.reply.notePlaceholder}
            value={props.noteDraft}
            onChange={(e) => props.onNoteChange(e.target.value)}
          />
          <FlashMessage flash={scopedFlash("note")} />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={busy !== null || !props.noteDraft.trim()}
              onClick={props.onSaveNote}
            >
              {labels.reply.saveNote}
            </button>
          </div>
        </Section>
      </div>

      <Section title={labels.detail.activity}>
        {detail.status === "loading" ? (
          <AipifyLoader label={labels.detail.loadingDetail} size="sm" />
        ) : detail.timeline.length === 0 ? (
          <p className="text-sm text-[color:var(--aipify-text-secondary)]">
            {labels.detail.noHistory}
          </p>
        ) : (
          <ol className="space-y-3">
            {detail.timeline.map((entry) => {
              const delivery =
                entry.deliveryStatus && labels.detail.deliveryLabels[entry.deliveryStatus]
                  ? labels.detail.deliveryLabels[entry.deliveryStatus]
                  : null;
              return (
                <li
                  key={entry.id}
                  className="rounded-lg border border-[color:var(--aipify-border)] bg-white p-3"
                >
                  <p className="flex flex-wrap items-center gap-x-2 text-xs text-[color:var(--aipify-text-secondary)]">
                    <span className="font-semibold text-[color:var(--aipify-text)]">
                      {labels.detail.entryKinds[entry.kind]}
                    </span>
                    <span>{formatDate(entry.at)}</span>
                    {delivery ? <span>· {delivery}</span> : null}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[color:var(--aipify-text)]">
                    {entry.text}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
        <p className="text-xs text-[color:var(--aipify-text-secondary)]">
          {labels.detail.messagesBlocked}
        </p>
      </Section>
    </article>
  );
}
