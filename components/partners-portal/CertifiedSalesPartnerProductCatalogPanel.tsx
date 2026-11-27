"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { evaluateCspCopyLinkEligibility } from "@/lib/certified-sales-partner/copy-link-eligibility";
import {
  CSP_CATALOG_FILTERS,
  getLocalizedCspCatalogProducts,
  type CspCatalogFilter,
  type CspLocalizedCatalogProduct,
} from "@/lib/certified-sales-partner/product-catalog-display";
import {
  buildUnifiedCatalog,
  filterSalesCatalogProducts,
  variantsForProduct,
  type ProductCatalogLocaleCode,
} from "@/lib/product-catalog";
import {
  formatVariantQuotaLabel,
  priceForInterval,
} from "@/lib/product-catalog/variants";
import { ensureCspSalesLink, useCspSalesLinks, writeClipboard } from "./csp-sales-links-client";
import { useCspPortal } from "./CertifiedSalesPartnerWorkspacePanel";

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
  shareMarketing: string;
  trainingNotPublished: string;
  noBuy: string;
  empty: string;
  audienceLabel: string;
  benefitsLabel: string;
  monthly?: string;
  yearly?: string;
  annualQuotaNote?: string;
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

function SaleVariantPriceBlock({
  productKey,
  locale,
  labels,
  fallbackMonthly,
}: {
  productKey: string;
  locale: string;
  labels: CspCatalogLabels;
  fallbackMonthly: { amount: number; currency: string } | null;
}) {
  const variants = useMemo(
    () => variantsForProduct(productKey).filter((v) => v.active),
    [productKey],
  );
  const [variantKey, setVariantKey] = useState(
    () => variants.find((v) => v.recommended)?.variantKey ?? variants[0]?.variantKey ?? null,
  );
  const [interval, setInterval] = useState<"month" | "year">("month");
  const variant = variants.find((v) => v.variantKey === variantKey) ?? variants[0] ?? null;
  const price = variant ? priceForInterval(variant, interval) : null;
  const amount =
    price?.amountMajor ??
    (interval === "month" ? fallbackMonthly?.amount ?? null : null);
  const currency = price?.currency ?? fallbackMonthly?.currency ?? "NOK";

  if (variants.length === 0 && amount == null) {
    return (
      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.noPlannedPrice}</p>
    );
  }

  return (
    <div className="space-y-2">
      {variants.length > 0 ? (
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-[color:var(--aipify-border)] p-1">
          {variants.map((item) => {
            const selected = item.variantKey === variant?.variantKey;
            return (
              <button
                key={item.variantKey}
                type="button"
                aria-pressed={selected}
                onClick={() => setVariantKey(item.variantKey)}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  selected
                    ? "bg-[color:var(--aipify-companion-purple)] text-white"
                    : "text-[color:var(--aipify-text-primary)]"
                }`}
              >
                {formatVariantQuotaLabel(item, locale)}
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="inline-flex rounded-xl border border-[color:var(--aipify-border)] p-1">
        {(
          [
            ["month", labels.monthly ?? "Monthly"],
            ["year", labels.yearly ?? "Yearly"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={interval === value}
            onClick={() => setInterval(value)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
              interval === value
                ? "bg-[color:var(--aipify-companion-purple)] text-white"
                : "text-[color:var(--aipify-text-primary)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">
        {amount != null
          ? `${formatMoney(amount, currency, locale)} · ${
              interval === "month" ? labels.monthly ?? "Monthly" : labels.yearly ?? "Yearly"
            }`
          : labels.noPlannedPrice}
      </p>
      <p className="text-xs text-[color:var(--aipify-text-muted)]">{labels.plannedPriceNote}</p>
      {variant?.annualRenewsQuotaMonthly && interval === "year" && labels.annualQuotaNote ? (
        <p className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.annualQuotaNote}</p>
      ) : null}
    </div>
  );
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
  status: string | null | undefined,
  labels: CspCatalogLabels,
): { text: string; tone: StatusTone } {
  if (product.future) return { text: labels.certNotApplicable, tone: "muted" };
  switch (status) {
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
 * Partner product catalog. Partners never purchase here: only gated "copy sales link" and training.
 * Commission amounts come from Core overview only — never invented.
 */
export function CertifiedSalesPartnerProductCatalogPanel({
  labels,
  locale,
}: {
  labels: CspCatalogLabels;
  locale: string;
}) {
  const portal = useCspPortal();
  const { state: linksState, reload: reloadLinks } = useCspSalesLinks(portal !== null);
  const [filter, setFilter] = useState<CspCatalogFilter>("all");
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, { text: string; tone: StatusTone }>>({});

  const overviewByKey = useMemo(() => {
    const map = new Map<string, { certificationStatus: string | null; commissionAmount: number | null; currency: string | null }>();
    if (!portal) return map;
    for (const row of portal.overview.products) {
      if (!row.productKey) continue;
      map.set(row.productKey, {
        certificationStatus: row.certificationStatus,
        commissionAmount: row.fixedCommissionAmount ?? null,
        currency: row.currency ?? null,
      });
    }
    return map;
  }, [portal]);

  /** SALE channel only: Core-published sale products + future orientation cards. Never APP-only. */
  const products = useMemo(() => {
    const all = getLocalizedCspCatalogProducts(locale, filter);
    if (!portal) return all;
    const catalogLocale = (
      ["en", "no", "sv", "da", "pl", "uk", "es"].includes(locale) ? locale : "en"
    ) as ProductCatalogLocaleCode;
    const saleVisible = new Set(
      filterSalesCatalogProducts(
        buildUnifiedCatalog({
          locale: catalogLocale,
          coreProducts: portal.overview.products
            .filter((row) => row.productKey)
            .map((row) => ({
              id: row.id ?? row.productKey!,
              productKey: row.productKey!,
              title: null,
              currency: row.currency,
              fixedCommissionAmount: row.fixedCommissionAmount,
              published: true,
              publishSale: true,
              publishApp: null,
            })),
        }),
      ).map((product) => product.productKey),
    );
    return all.filter(
      (product) => product.future || (overviewByKey.has(product.key) && saleVisible.has(product.key)),
    );
  }, [locale, filter, portal, overviewByKey]);

  const filterLabels: Record<CspCatalogFilter, string> = {
    all: labels.filterAll,
    kompis: labels.filterKompis,
    voice: labels.filterVoice,
  };

  if (!portal) return null;

  async function copyLink(product: CspLocalizedCatalogProduct) {
    setPendingKey(product.key);
    setNotes((prev) => ({ ...prev, [product.key]: { text: labels.copyingLink, tone: "muted" } }));
    const setNote = (text: string, tone: StatusTone) => setNotes((prev) => ({ ...prev, [product.key]: { text, tone } }));
    try {
      const existing = linksState.phase === "ready" ? linksState.links : [];
      const outcome = await ensureCspSalesLink({
        productKey: product.key,
        channel: "referral_link",
        existing,
      });
      if (!outcome.ok) {
        setNote(
          outcome.reason === "unavailable"
            ? labels.linkUnavailable
            : outcome.reason === "gates"
              ? labels.linkGatesNotMet
              : outcome.reason === "not_sellable"
                ? labels.futureNote
                : labels.error,
          "warn",
        );
        return;
      }
      if (await writeClipboard(outcome.url)) setNote(labels.linkCopied, "ok");
      else setNote(fill(labels.linkCreated, { path: outcome.url }), "ok");
      reloadLinks();
    } catch {
      setNote(labels.error, "warn");
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <section className="w-full space-y-5" aria-labelledby="csp-catalog-title">
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
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const overview = overviewByKey.get(product.key);
            const cert = certificationPresentation(product, overview?.certificationStatus, labels);
            const eligibility = evaluateCspCopyLinkEligibility(portal.overview, product.key);
            const amount = overview?.commissionAmount;
            const currency = overview?.currency;
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

                {product.imagePath ? (
                  // eslint-disable-next-line @next/next/no-img-element -- static brand asset under /public
                  <img
                    src={product.imagePath}
                    alt=""
                    className="h-36 w-full rounded-xl border border-[color:var(--aipify-border)] object-cover object-center"
                  />
                ) : null}

                <p className="text-sm text-[color:var(--aipify-text-secondary)]">{product.description}</p>

                <div className="space-y-2 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-muted)]">
                    {labels.audienceLabel}
                  </p>
                  <p className="text-[color:var(--aipify-text-primary)]">{product.audience}</p>
                  {product.benefits.length > 0 ? (
                    <>
                      <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-muted)]">
                        {labels.benefitsLabel}
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-[color:var(--aipify-text-primary)]">
                        {product.benefits.map((benefit) => (
                          <li key={benefit}>{benefit}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>

                <SaleVariantPriceBlock
                  productKey={product.key}
                  locale={locale}
                  labels={labels}
                  fallbackMonthly={
                    product.plannedReferencePrice
                      ? {
                          amount: product.plannedReferencePrice.fromMonthly,
                          currency: product.plannedReferencePrice.currency,
                        }
                      : null
                  }
                />

                <dl className="space-y-2 text-sm">
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
                      {eligibility.allowed ? (
                        <button
                          type="button"
                          onClick={() => void copyLink(product)}
                          disabled={pendingKey === product.key}
                          className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-3 py-2 text-sm font-semibold text-white hover:bg-[color:var(--aipify-companion-purple-hover)] disabled:opacity-60"
                        >
                          {labels.copyLink}
                        </button>
                      ) : (
                        <p className="self-center text-xs text-[color:var(--aipify-text-secondary)]">{labels.linkGatesNotMet}</p>
                      )}
                      <Link
                        href="/partners/marketing/assets"
                        className="inline-flex rounded-xl border border-[color:var(--aipify-border-strong)] bg-[color:var(--aipify-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
                      >
                        {labels.shareMarketing}
                      </Link>
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
