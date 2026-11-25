"use client";

import { useState, type FormEvent } from "react";

export type CspLinkLabels = {
  title: string;
  productId: string;
  channel: string;
  submit: string;
  howItWorks: string;
  failClosed: string;
  error: string;
  success: string;
  gatesHint: string;
};

const CHANNELS = [
  "facebook",
  "instagram",
  "x",
  "snapchat",
  "tiktok",
  "linkedin",
  "email",
  "qr",
  "other",
] as const;

export function CertifiedSalesPartnerLinkPanel({ labels }: { labels: CspLinkLabels }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/certified-sales-partner/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: String(fd.get("product_id") ?? ""),
          channel: String(fd.get("channel") ?? "other"),
          partner_approved: fd.get("partner_approved") === "on",
          product_published: fd.get("product_published") === "on",
          certification_passed: fd.get("certification_passed") === "on",
          agreement_accepted: fd.get("agreement_accepted") === "on",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        backend_ready?: boolean;
      };
      if (res.status === 503 || data.backend_ready === false) {
        setMessage(labels.failClosed);
        return;
      }
      if (!res.ok) {
        setMessage(data.error ?? labels.error);
        return;
      }
      setMessage(labels.success);
    } catch {
      setMessage(labels.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
      <h2 className="text-lg font-semibold">{labels.title}</h2>
      <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.howItWorks}</p>
      <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.gatesHint}</p>
      <form className="mt-4 grid max-w-xl gap-3" onSubmit={onSubmit}>
        <label className="text-sm">
          <span className="font-medium">{labels.productId}</span>
          <input name="product_id" required className="mt-1 w-full rounded-xl border px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="font-medium">{labels.channel}</span>
          <select name="channel" className="mt-1 w-full rounded-xl border px-3 py-2">
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        {(["partner_approved", "product_published", "certification_passed", "agreement_accepted"] as const).map(
          (name) => (
            <label key={name} className="flex items-center gap-2 text-sm">
              <input name={name} type="checkbox" />
              <span>{name}</span>
            </label>
          ),
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {labels.submit}
        </button>
      </form>
      {message ? (
        <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
