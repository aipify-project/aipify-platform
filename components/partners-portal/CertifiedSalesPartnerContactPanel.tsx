"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  SUPPORT_INTAKE_CSP_CATEGORIES,
  SUPPORT_INTAKE_PRIORITIES,
  type SupportIntakeCspCategory,
  type SupportIntakePriority,
} from "@/lib/support-intake/categories";
import { AipifyCard } from "./design";
import { useCspPortal } from "./CspPortalSessionProvider";

export type CspContactLabels = {
  title: string;
  intro: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  submit: string;
  submitting: string;
  blockedTitle: string;
  blockedBody: string;
  mailtoCta: string;
  messagesCta: string;
  /** Shared APP Kundeservice — dual-role; not CSP inbox. */
  appSupportCta: string;
  success: string;
  error: string;
  senderTitle: string;
  senderName: string;
  senderEmail: string;
  categories: Record<string, string>;
  priorities: Record<string, string>;
};

/**
 * Partner contact form — uses Support Ticket Core when live; otherwise honest block + mailto/messages.
 * Never invents ticket numbers. Never shows a ready-looking primary submit while Core is closed.
 */
export function CertifiedSalesPartnerContactPanel({
  labels,
  ticketLive,
  contactEmail = null,
}: {
  labels: CspContactLabels;
  ticketLive: boolean;
  /** Server-derived session email — display only; never trusted as tenant authority. */
  contactEmail?: string | null;
}) {
  const portal = useCspPortal();
  const displayName = portal?.overview.displayName?.trim() || null;

  const categoryOptions = useMemo(
    () =>
      SUPPORT_INTAKE_CSP_CATEGORIES.filter((id) => labels.categories[id]).map((id) => ({
        id,
        label: labels.categories[id],
      })),
    [labels.categories],
  );

  const [category, setCategory] = useState<SupportIntakeCspCategory>(
    () => (categoryOptions[0]?.id as SupportIntakeCspCategory) || "other",
  );
  const [priority, setPriority] = useState<SupportIntakePriority>("normal");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!ticketLive || busy) return;
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const res = await fetch("/api/certified-sales-partner/support-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "partner",
          category,
          priority,
          subject,
          description,
        }),
      });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        live?: boolean;
        ticket_id?: string;
        message?: string;
        code?: string;
      } | null;
      // Fail closed: 503 / not-live never looks like success and never invents an id.
      if (
        res.status === 503 ||
        body?.live === false ||
        body?.code === "core_not_applied" ||
        body?.code === "channel_not_activated" ||
        body?.code === "feature_gate_off"
      ) {
        setError(labels.error);
        return;
      }
      if (!res.ok || !body?.ok) {
        setError(labels.error);
        return;
      }
      setNotice(labels.success);
      setSubject("");
      setDescription("");
    } catch {
      setError(labels.error);
    } finally {
      setBusy(false);
    }
  }

  const mailto = `mailto:support@aipify.ai?subject=${encodeURIComponent(subject || labels.title)}`;

  return (
    <div className="space-y-5">
      <AipifyCard>
        <h1 className="text-2xl font-semibold text-[#1E293B]">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#64748B]">{labels.intro}</p>
      </AipifyCard>

      {!ticketLive ? (
        <section className="rounded-2xl border border-[#E8E4F2] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1E293B]">{labels.blockedTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{labels.blockedBody}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={mailto}
              className="inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white"
            >
              {labels.mailtoCta}
            </a>
            <Link
              href="/app/sales-partner/messages"
              className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-4 text-sm font-semibold text-[#7C3AED]"
            >
              {labels.messagesCta}
            </Link>
            <Link
              href="/app/support"
              className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-4 text-sm font-semibold text-[#1E293B]"
            >
              {labels.appSupportCta}
            </Link>
          </div>
        </section>
      ) : null}

      {(displayName || contactEmail) && (
        <section className="rounded-2xl border border-[#E8E4F2] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1E293B]">{labels.senderTitle}</h2>
          <dl className="mt-3 space-y-1 text-sm text-[#64748B]">
            {displayName ? (
              <div>
                <dt className="inline font-medium text-[#1E293B]">{labels.senderName}: </dt>
                <dd className="inline">{displayName}</dd>
              </div>
            ) : null}
            {contactEmail ? (
              <div>
                <dt className="inline font-medium text-[#1E293B]">{labels.senderEmail}: </dt>
                <dd className="inline">{contactEmail}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      )}

      {/* Draft fields stay visible so partners can prepare mailto; primary submit only when live. */}
      <form className="space-y-4 rounded-2xl border border-[#E8E4F2] bg-white p-5 shadow-sm" onSubmit={onSubmit}>
        <label className="block text-sm">
          <span className="font-medium">{labels.category}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SupportIntakeCspCategory)}
            className="mt-1 w-full rounded-xl border border-[#E8E4F2] px-3 py-2"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">{labels.priority}</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as SupportIntakePriority)}
            className="mt-1 w-full rounded-xl border border-[#E8E4F2] px-3 py-2"
          >
            {SUPPORT_INTAKE_PRIORITIES.map((id) => (
              <option key={id} value={id}>
                {labels.priorities[id] ?? id}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">{labels.subject}</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required={ticketLive}
            className="mt-1 w-full rounded-xl border border-[#E8E4F2] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">{labels.description}</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required={ticketLive}
            rows={6}
            className="mt-1 w-full rounded-xl border border-[#E8E4F2] px-3 py-2"
          />
        </label>
        {ticketLive ? (
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? labels.submitting : labels.submit}
          </button>
        ) : (
          <p className="text-sm text-[#64748B]">
            <a href={mailto} className="font-semibold text-[#7C3AED] underline">
              {labels.mailtoCta}
            </a>
          </p>
        )}
        {notice ? (
          <p className="text-sm text-teal-800" role="status">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-rose-700" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
