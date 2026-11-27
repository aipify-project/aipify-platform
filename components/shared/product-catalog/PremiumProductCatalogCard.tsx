"use client";

/**
 * Premium catalog card — APP store and SALE partner share the same composition.
 * Variant + billing period selectors update price synchronously (no extra fetch).
 * Buy/Upgrade stay fail-closed until checkout readiness is Production-true.
 */

import { useMemo, useState } from "react";
import { Check, Info, Share2, X } from "lucide-react";
import Link from "next/link";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog";
import {
  formatVariantQuotaLabel,
  priceForInterval,
  type ProductVariantDefinition,
} from "@/lib/product-catalog/variants";
import { variantHasPaidCustomerPrice } from "@/lib/product-catalog/quota-labels";
import { resolveAppCheckoutCta } from "@/lib/product-catalog/checkout-readiness";

export type PremiumCatalogCardLabels = {
  mostPopular: string;
  monthly: string;
  yearly: string;
  fromPrice: string;
  plannedPriceNote: string;
  notReadyForPurchase: string;
  contactAipify: string;
  seeDetails: string;
  annualQuotaNote: string;
  commissionFixed: string;
  commissionPercentBlocked: string;
  commissionPending: string;
  /** Shown when the selected variant has no paid customer price (e.g. free 150). */
  commissionNone?: string;
  info: string;
  share: string;
  noBuy: string;
  featuresHeading: string;
  closeDetails: string;
  vatUnknown: string;
  /** Shown when the selected variant has no paid customer price. */
  freePrice?: string;
};

export type PremiumCatalogCardMode = "app" | "sale";

function formatMajor(
  amount: number | null | undefined,
  currency: string,
  locale: string,
): string | null {
  if (amount == null || !Number.isFinite(amount)) return null;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function activeVariants(product: UnifiedCatalogProduct): ProductVariantDefinition[] {
  return product.variants.filter((v) => v.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function PremiumProductCatalogCard({
  product,
  mode,
  locale,
  labels,
  heroSrc,
  features,
  onShare,
  shareDisabled,
}: {
  product: UnifiedCatalogProduct;
  mode: PremiumCatalogCardMode;
  locale: string;
  labels: PremiumCatalogCardLabels;
  heroSrc?: string | null;
  features?: Array<{ label: string; included: boolean }>;
  onShare?: (input: {
    productKey: string;
    variantKey: string | null;
    interval: "month" | "year";
  }) => void;
  shareDisabled?: boolean;
}) {
  const variants = useMemo(() => activeVariants(product), [product]);
  const recommended = variants.find((v) => v.recommended) ?? variants[0] ?? null;
  const [variantKey, setVariantKey] = useState<string | null>(recommended?.variantKey ?? null);
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [detailsOpen, setDetailsOpen] = useState(false);

  const variant = variants.find((v) => v.variantKey === variantKey) ?? recommended;
  const price = variant ? priceForInterval(variant, interval) : null;
  const priceText = formatMajor(price?.amountMajor ?? null, price?.currency ?? product.customerPrice.currency, locale);
  const quotaLabel = variant ? formatVariantQuotaLabel(variant, locale) : null;

  const cta = resolveAppCheckoutCta({ product, variant, interval });

  const selectedIsPaid = variant ? variantHasPaidCustomerPrice(variant) : false;
  const commissionText = !selectedIsPaid
    ? labels.commissionNone || labels.commissionPending
    : product.commission.kind === "fixed"
      ? labels.commissionFixed
          .replace("{amount}", String(product.commission.amount))
          .replace("{currency}", product.commission.currency)
      : product.commission.kind === "percent"
        ? labels.commissionPercentBlocked
        : labels.commissionPending;

  const image = heroSrc ?? product.heroImagePath ?? product.logoSrc;

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--aipify-border)] bg-white shadow-sm"
      data-catalog-mode={mode}
      data-product-key={product.productKey}
      data-variant-key={variant?.variantKey ?? ""}
      data-billing-interval={interval}
    >
      <div className="relative aspect-[16/9] w-full bg-[color:var(--aipify-accent-soft)]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- approved brand/product asset
          <img src={image} alt="" className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-semibold text-[color:var(--aipify-companion-purple)]">
              {product.letter}
            </span>
          </div>
        )}
        {variant?.recommended ? (
          <span className="absolute left-3 top-3 rounded-full bg-[color:var(--aipify-companion-purple)] px-2.5 py-1 text-xs font-semibold text-white">
            {labels.mostPopular}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-[color:var(--aipify-text-primary)]">
              {product.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-[color:var(--aipify-text-secondary)]">
              {product.tagline || product.description}
            </p>
          </div>
          <div className="shrink-0 text-right">
            {priceText ? (
              <p className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{priceText}</p>
            ) : variant && !selectedIsPaid ? (
              <p className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
                {labels.freePrice || "—"}
              </p>
            ) : (
              <p className="text-sm text-[color:var(--aipify-text-secondary)]">—</p>
            )}
            {priceText || (variant && selectedIsPaid) ? (
              <p className="text-xs text-[color:var(--aipify-text-muted)]">
                {interval === "month" ? labels.monthly : labels.yearly}
              </p>
            ) : null}
          </div>
        </div>

        <div className="h-px w-full bg-[color:var(--aipify-border)]" />

        {variants.length > 0 ? (
          <div
            role="group"
            aria-label="variant"
            className="flex gap-1 overflow-x-auto rounded-xl border border-[color:var(--aipify-border)] p-1"
          >
            {variants.map((item) => {
              const selected = item.variantKey === variant?.variantKey;
              const stopLabel = formatVariantQuotaLabel(item, locale);
              return (
                <button
                  key={item.variantKey}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setVariantKey(item.variantKey)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    selected
                      ? "bg-[color:var(--aipify-companion-purple)] text-white"
                      : "text-[color:var(--aipify-text-primary)] hover:bg-[color:var(--aipify-accent-soft)]"
                  }`}
                >
                  {stopLabel}
                </button>
              );
            })}
          </div>
        ) : null}

        <div
          role="group"
          aria-label="billing"
          className="inline-flex rounded-xl border border-[color:var(--aipify-border)] p-1"
        >
          {(
            [
              ["month", labels.monthly],
              ["year", labels.yearly],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={interval === value}
              onClick={() => setInterval(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                interval === value
                  ? "bg-[color:var(--aipify-companion-purple)] text-white"
                  : "text-[color:var(--aipify-text-primary)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {quotaLabel && variant?.annualRenewsQuotaMonthly && interval === "year" ? (
          <p className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.annualQuotaNote}</p>
        ) : null}

        {product.customerPrice.status === "planned_not_stripe_live" && priceText ? (
          <p className="text-xs text-[color:var(--aipify-text-muted)]">
            {labels.plannedPriceNote.replace("{price}", priceText)}
          </p>
        ) : null}

        {features && features.length > 0 ? (
          <ul className="space-y-1.5">
            {features.slice(0, 6).map((feature) => (
              <li key={feature.label} className="flex items-start gap-2 text-sm text-[color:var(--aipify-text-primary)]">
                {feature.included ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                ) : (
                  <X className="mt-0.5 size-4 shrink-0 text-[color:var(--aipify-text-muted)]" aria-hidden />
                )}
                <span>{feature.label}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {mode === "sale" ? (
          <p className="text-sm text-[color:var(--aipify-text-primary)]">{commissionText}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--aipify-border-strong)] px-3 py-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
          >
            <Info className="size-4" aria-hidden />
            {labels.seeDetails}
          </button>

          {mode === "app" ? (
            cta.kind === "open" ? (
              <Link
                href={cta.href}
                className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-3 py-2 text-sm font-semibold text-white"
              >
                {labels.seeDetails}
              </Link>
            ) : cta.kind === "contact" ? (
              <Link
                href="/app/account/subscription"
                className="inline-flex rounded-xl border border-[color:var(--aipify-border-strong)] px-3 py-2 text-sm font-semibold"
              >
                {labels.contactAipify}
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-xl border border-dashed border-[color:var(--aipify-border)] px-3 py-2 text-sm text-[color:var(--aipify-text-secondary)]">
                {labels.notReadyForPurchase}
              </span>
            )
          ) : (
            <>
              <button
                type="button"
                disabled={shareDisabled || !onShare}
                onClick={() =>
                  onShare?.({
                    productKey: product.productKey,
                    variantKey: variant?.variantKey ?? null,
                    interval,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--aipify-companion-purple)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Share2 className="size-4" aria-hidden />
                {labels.share}
              </button>
              <p className="w-full text-xs text-[color:var(--aipify-text-secondary)]">{labels.noBuy}</p>
            </>
          )}
        </div>
      </div>

      {detailsOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setDetailsOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setDetailsOpen(false);
          }}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{product.title}</h4>
              <button
                type="button"
                className="rounded-lg border border-[color:var(--aipify-border)] px-2 py-1 text-sm"
                onClick={() => setDetailsOpen(false)}
              >
                {labels.closeDetails}
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
              {product.description}
            </p>
            {features && features.length > 0 ? (
              <>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-muted)]">
                  {labels.featuresHeading}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {features.map((feature) => (
                    <li key={feature.label} className="flex gap-2 text-sm">
                      {feature.included ? (
                        <Check className="mt-0.5 size-4 text-emerald-600" aria-hidden />
                      ) : (
                        <X className="mt-0.5 size-4 text-[color:var(--aipify-text-muted)]" aria-hidden />
                      )}
                      {feature.label}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className="mt-4 text-xs text-[color:var(--aipify-text-muted)]">{labels.vatUnknown}</p>
          </div>
        </div>
      ) : null}
    </article>
  );
}
