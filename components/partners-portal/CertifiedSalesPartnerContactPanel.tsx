"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AipifyAlert, AipifyCard } from "./design";

export type CspContactLabels = {
  title: string;
  intro: string;
  category: string;
  subject: string;
  description: string;
  submit: string;
  submitting: string;
  blockedTitle: string;
  blockedBody: string;
  mailtoCta: string;
  messagesCta: string;
  success: string;
  error: string;
  categories: Record<string, string>;
};

/**
 * Partner contact form — uses Support Ticket Core when live; otherwise honest block + mailto/messages.
 * Never invents ticket numbers.
 */
export function CertifiedSalesPartnerContactPanel({
  labels,
  ticketLive,
}: {
  labels: CspContactLabels;
  ticketLive: boolean;
}) {
  const [category, setCategory] = useState("general");
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
          subject,
          description,
        }),
      });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        live?: boolean;
        ticket_id?: string;
        message?: string;
      } | null;
      if (!res.ok || !body?.ok || body.live === false) {
        setError(body?.message || labels.error);
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
        <AipifyAlert tone="warning" title={labels.blockedTitle}>
          <p>{labels.blockedBody}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={mailto}
              className="inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white"
            >
              {labels.mailtoCta}
            </a>
            <Link
              href="/partners/account/messages"
              className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-4 text-sm font-semibold text-[#7C3AED]"
            >
              {labels.messagesCta}
            </Link>
          </div>
        </AipifyAlert>
      ) : null}

      <form className="space-y-4 rounded-2xl border border-[#E8E4F2] bg-white p-5 shadow-sm" onSubmit={onSubmit}>
        <label className="block text-sm">
          <span className="font-medium">{labels.category}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#E8E4F2] px-3 py-2"
          >
            {Object.entries(labels.categories).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">{labels.subject}</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-[#E8E4F2] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">{labels.description}</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            className="mt-1 w-full rounded-xl border border-[#E8E4F2] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={!ticketLive || busy}
          className="inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? labels.submitting : labels.submit}
        </button>
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
