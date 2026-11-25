"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CSP_CHANNEL_ORIGINS } from "@/lib/certified-sales-partner/constants";
import { getLocalizedCspCatalogProducts } from "@/lib/certified-sales-partner/product-catalog-display";
import { resolveCspProductDestination } from "@/lib/certified-sales-partner/attribution-policy";
import { useCspPortal } from "./CertifiedSalesPartnerWorkspacePanel";

export type CspLinkLabels = {
  title: string;
  product: string;
  productPlaceholder: string;
  certificationNeeded: string;
  noProducts: string;
  channel: string;
  /** channel id -> translated label (self-service channels only). */
  channels: Record<string, string>;
  submit: string;
  creating: string;
  howItWorks: string;
  failClosed: string;
  error: string;
  /** Template with {url}. */
  success: string;
  copy: string;
  copied: string;
  gatesHint: string;
  productNotYet: string;
};

/** Partners can self-issue every channel except Platform-only manual assignment. */
const SELF_SERVICE_CHANNELS = CSP_CHANNEL_ORIGINS.filter((c) => c !== "manual_platform_assignment");

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? values[key] : match));
}

/**
 * Sales link creator. Product choices come from Core's published products (via the shared portal
 * bundle); the server derives every gate itself — the client never sends approval flags.
 */
export function CertifiedSalesPartnerLinkPanel({ labels, locale }: { labels: CspLinkLabels; locale: string }) {
  const portal = useCspPortal();
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState(false);

  const options = useMemo(() => {
    if (!portal) return [];
    const names: Record<string, string> = {};
    for (const p of getLocalizedCspCatalogProducts(locale)) names[p.key] = p.title;
    return portal.overview.products
      .filter((p) => p.productKey !== null && resolveCspProductDestination(p.productKey) !== null)
      .map((p) => ({
        key: p.productKey as string,
        title: names[p.productKey as string] ?? (p.productKey as string),
        certified: p.certificationStatus === "passed",
      }));
  }, [portal, locale]);

  if (!portal) return null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setCreatedUrl(null);
    setCopied(false);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/certified-sales-partner/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: String(fd.get("product_id") ?? ""),
          channel: String(fd.get("channel") ?? "other"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; backend_ready?: boolean; path?: string | null };
      if (res.status === 503 || data.backend_ready === false) {
        setMessage({ text: labels.failClosed, ok: false });
        return;
      }
      if (res.status === 403) {
        setMessage({ text: labels.gatesHint, ok: false });
        return;
      }
      if (res.status === 409) {
        setMessage({ text: labels.productNotYet, ok: false });
        return;
      }
      if (!res.ok || typeof data.path !== "string") {
        setMessage({ text: labels.error, ok: false });
        return;
      }
      const url = `${window.location.origin}${data.path}`;
      setCreatedUrl(url);
      setMessage({ text: fill(labels.success, { url }), ok: true });
    } catch {
      setMessage({ text: labels.error, ok: false });
    } finally {
      setPending(false);
    }
  }

  async function copy() {
    if (!createdUrl) return;
    try {
      await navigator.clipboard.writeText(createdUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
      <h2 className="text-lg font-semibold">{labels.title}</h2>
      <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.howItWorks}</p>
      <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.gatesHint}</p>
      {options.length === 0 ? (
        <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]" role="status">
          {labels.noProducts}
        </p>
      ) : (
        <form className="mt-4 grid max-w-xl gap-3" onSubmit={onSubmit}>
          <label className="text-sm">
            <span className="font-medium">{labels.product}</span>
            <select
              name="product_id"
              required
              defaultValue=""
              className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border-strong)] bg-[color:var(--aipify-surface)] px-3 py-2"
            >
              <option value="" disabled>
                {labels.productPlaceholder}
              </option>
              {options.map((o) => (
                <option key={o.key} value={o.key} disabled={!o.certified}>
                  {o.certified ? o.title : `${o.title} — ${labels.certificationNeeded}`}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="font-medium">{labels.channel}</span>
            <select
              name="channel"
              defaultValue="other"
              className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border-strong)] bg-[color:var(--aipify-surface)] px-3 py-2"
            >
              {SELF_SERVICE_CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {labels.channels[c] ?? labels.channels.other}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-fit rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? labels.creating : labels.submit}
          </button>
        </form>
      )}
      {message ? (
        <div
          className={`mt-4 rounded-xl border p-3 text-sm ${
            message.ok ? "border-teal-300 bg-teal-50 text-teal-900" : "border-orange-300 bg-orange-50 text-orange-900"
          }`}
          role="status"
        >
          <p className="break-all">{message.text}</p>
          {createdUrl ? (
            <button type="button" onClick={() => void copy()} className="mt-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]">
              {copied ? labels.copied : labels.copy}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
