"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CSP_CATALOG_FILTERS,
  getLocalizedCspCatalogProducts,
  type CspCatalogFilter,
  type CspLocalizedCatalogProduct,
} from "@/lib/certified-sales-partner/product-catalog-display";

export type CspCatalogLabels = {
  title: string;
  intro: string;
  filterLabel: string;
  filterAll: string;
  filterKompis: string;
  filterVoice: string;
  sellable: string;
  future: string;
  futureNote: string;
  /** Template with {price}. */
  plannedPrice: string;
  plannedPriceNote: string;
  noPlannedPrice: string;
  commissionLabel: string;
  /** Template with {amount}. */
  commissionAmount: string;
  commissionPending: string;
  certificationLabel: string;
  certNotStarted: string;
  certInProgress: string;
  certPassed: string;
  certExpired: string;
  certRevoked: string;
  certUnknown: string;
  certNotApplicable: string;
  copyLink: string;
  copyingLink: string;
  linkCopied: string;
  /** Template with {path}. */
  linkCreated: string;
  linkGatesNotMet: string;
  linkUnavailable: string;
  error: string;
  takeTraining: string;
  trainingNotPublished: string;
  noBuy: string;
  empty: string;
};

type CoreProduct = {
  product_key?: string;
  fixed_commission_amount?: number | null;
  currency?: string | null;
  certification_status?: string | null;
};

type CoreState = { ready: false } | { ready: true; products: Record<string, CoreProduct> };

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

function formatMoney(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

type StatusTone = "ok" | "progress" | "muted" | "warn";

const TONE_CLASSES: Record<StatusTone, string> = {
  ok: "border-teal-300 bg-teal-50 text-teal-900",
  progress: "border-indigo-200 bg-[color:var(--aipify-accent-soft)] text-[color:var(--aipify-text-primary)]",
  muted: "border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] text-[color:var(--aipify-text-secondary)]",
  warn: "border-orange-300 bg-orange-50 text-orange-900",
};

function StatusIcon({ tone }: { tone: StatusTone }) {
  const common = {
    "aria-hidden": true as const,
    viewBox: "0 0 24 24",
    className: "h-4 w-4 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (tone === "ok") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="m8 12.5 2.8 2.8L16 9.5" />
      </svg>
    );
  }
  if (tone === "warn") {
    return (
      <svg {...common}>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 10v4.5M12 17.5v.01" />
      </svg>
    );
  }
  if (tone === "progress") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
    </svg>
  );
}

function certificationPresentation(
  product: CspLocalizedCatalogProduct,
  core: CoreState,
  labels: CspCatalogLabels,
): { text: string; tone: StatusTone } {
  if (product.future) return { text: labels.certNotApplicable, tone: "muted" };
  if (!core.ready) return { text: labels.certUnknown, tone: "muted" };
  switch (core.products[product.key]?.certification_status) {
    case "passed":
      return { text: labels.certPassed, tone: "ok" };
    case "in_progress":
      return { text: labels.certInProgress, tone: "progress" };
    case "not_started":
      return { text: labels.certNotStarted, tone: "muted" };
    case "expired":
      return { text: labels.certExpired, tone: "warn" };
    case "revoked":
      return { text: labels.certRevoked, tone: "warn" };
    default:
      return { text: labels.certUnknown, tone: "muted" };
  }
}

/**
 * Partner product catalog. Partners never purchase here: there is no buy action, only
 * "copy sales link" (Core-gated, may fail closed) and "take training".
 * Customer prices are planned reference values; commission comes from Core only.
 */
export function CertifiedSalesPartnerProductCatalogPanel({
  labels,
  locale,
}: {
  labels: CspCatalogLabels;
  locale: string;
}) {
  const [filter, setFilter] = useState<CspCatalogFilter>("all");
  const [core, setCore] = useState<CoreState>({ ready: false });
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, { text: string; tone: StatusTone }>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/certified-sales-partner/catalog", { cache: "no-store" });
        const data = (await res.json().catch(() => ({}))) as {
          backend_ready?: boolean;
          found?: boolean;
          products?: CoreProduct[];
        };
        if (cancelled) return;
        if (!res.ok || data.backend_ready === false || data.found === false || !Array.isArray(data.products)) {
          setCore({ ready: false });
          return;
        }
        const byKey: Record<string, CoreProduct> = {};
        for (const product of data.products) {
          if (product && typeof product.product_key === "string") byKey[product.product_key] = product;
        }
        setCore({ ready: true, products: byKey });
      } catch {
        if (!cancelled) setCore({ ready: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const products = useMemo(() => getLocalizedCspCatalogProducts(locale, filter), [locale, filter]);

  const filterLabels: Record<CspCatalogFilter, string> = {
    all: labels.filterAll,
    kompis: labels.filterKompis,
    voice: labels.filterVoice,
  };

  async function copyLink(product: CspLocalizedCatalogProduct) {
    setPendingKey(product.key);
    setNotes((prev) => ({ ...prev, [product.key]: { text: labels.copyingLink, tone: "muted" } }));
    const setNote = (text: string, tone: StatusTone) => setNotes((prev) => ({ ...prev, [product.key]: { text, tone } }));
    try {
      const res = await fetch("/api/certified-sales-partner/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Gates are derived server-side from Core — no client-supplied approval flags.
        body: JSON.stringify({ product_id: product.key, channel: "referral_link" }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        path?: string;
        backend_ready?: boolean;
        error?: string;
      };
      if (res.status === 503 || data.backend_ready === false) {
        setNote(labels.linkUnavailable, "warn");
        return;
      }
      if (res.status === 403) {
        setNote(labels.linkGatesNotMet, "warn");
        return;
      }
      if (res.status === 409) {
        setNote(labels.futureNote, "warn");
        return;
      }
      if (!res.ok || typeof data.path !== "string") {
        setNote(labels.error, "warn");
        return;
      }
      const fullUrl = `${window.location.origin}${data.path}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        setNote(labels.linkCopied, "ok");
      } catch {
        setNote(fill(labels.linkCreated, { path: fullUrl }), "ok");
      }
    } catch {
      setNote(labels.error, "warn");
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <section className="space-y-5" aria-labelledby="csp-catalog-title">
      <div>
        <h2 id="csp-catalog-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
          {labels.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
      </div>

      <div role="group" aria-label={labels.filterLabel} className="flex flex-wrap gap-2">
        {CSP_CATALOG_FILTERS.map((value) => {
          const active = value === filter;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)] ${
                active
                  ? "border-[color:var(--aipify-companion-purple)] bg-[color:var(--aipify-companion-purple)] text-white"
                  : "border-[color:var(--aipify-border-strong)] bg-[color:var(--aipify-surface)] text-[color:var(--aipify-text-primary)]"
              }`}
            >
              {filterLabels[value]}
            </button>
          );
        })}
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4 text-sm text-[color:var(--aipify-text-secondary)]">
          {labels.empty}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const cert = certificationPresentation(product, core, labels);
            const coreProduct = core.ready ? core.products[product.key] : undefined;
            const amount = coreProduct?.fixed_commission_amount;
            const currency = coreProduct?.currency;
            // Commission amounts come from Core only — never invented. Future products stay "coming soon".
            const commissionText = product.future
              ? labels.future
              : typeof amount === "number" && typeof currency === "string" && currency
                ? fill(labels.commissionAmount, { amount: formatMoney(amount, currency, locale) })
                : labels.commissionPending;
            const note = notes[product.key];

            return (
              <li
                key={product.key}
                className="flex flex-col gap-3 rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-[color:var(--aipify-text-primary)]">{product.title}</h3>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                      product.future ? TONE_CLASSES.muted : TONE_CLASSES.progress
                    }`}
                  >
                    <StatusIcon tone={product.future ? "muted" : "progress"} />
                    {product.future ? labels.future : labels.sellable}
                  </span>
                </div>

                <p className="text-sm text-[color:var(--aipify-text-secondary)]">{product.description}</p>

                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-muted)]">
                      {labels.plannedPriceNote}
                    </dt>
                    <dd className="text-[color:var(--aipify-text-primary)]">
                      {product.plannedReferencePrice
                        ? fill(labels.plannedPrice, {
                            price: formatMoney(
                              product.plannedReferencePrice.fromMonthly,
                              product.plannedReferencePrice.currency,
                              locale,
                            ),
                          })
                        : labels.noPlannedPrice}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-muted)]">
                      {labels.commissionLabel}
                    </dt>
                    <dd className="text-[color:var(--aipify-text-primary)]">{commissionText}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-muted)]">
                      {labels.certificationLabel}
                    </dt>
                    <dd>
                      <span
                        className={`mt-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${TONE_CLASSES[cert.tone]}`}
                      >
                        <StatusIcon tone={cert.tone} />
                        {cert.text}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto space-y-2 pt-1">
                  {product.future ? (
                    <p className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.futureNote}</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void copyLink(product)}
                        disabled={pendingKey === product.key}
                        className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-3 py-2 text-sm font-semibold text-white hover:bg-[color:var(--aipify-companion-purple-hover)] disabled:opacity-60"
                      >
                        {labels.copyLink}
                      </button>
                      {product.hasTraining ? (
                        <Link
                          href="/partners/academy/training"
                          className="inline-flex rounded-xl border border-[color:var(--aipify-border-strong)] bg-[color:var(--aipify-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
                        >
                          {labels.takeTraining}
                        </Link>
                      ) : (
                        <span className="self-center text-xs text-[color:var(--aipify-text-secondary)]">
                          {labels.trainingNotPublished}
                        </span>
                      )}
                    </div>
                  )}
                  {note ? (
                    <p
                      className={`flex items-start gap-1.5 rounded-lg border p-2 text-xs ${TONE_CLASSES[note.tone]}`}
                      role="status"
                    >
                      <StatusIcon tone={note.tone} />
                      <span className="break-all">{note.text}</span>
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.noBuy}</p>
    </section>
  );
}
