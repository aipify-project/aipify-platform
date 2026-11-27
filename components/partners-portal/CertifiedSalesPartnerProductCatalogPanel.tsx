"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  type ProductVariantDefinition,
} from "@/lib/product-catalog/variants";
import { variantHasPaidCustomerPrice } from "@/lib/product-catalog/quota-labels";
import { ensureCspSalesLink, useCspSalesLinks, writeClipboard } from "./csp-sales-links-client";
import { GuidedProductCard, SalesExperienceHero } from "./sales-experience";
import type { SalesHeroModel } from "./sales-experience";
import { useCspPortal } from "./CertifiedSalesPartnerWorkspacePanel";

export type CspProductExperience = {
  hero: SalesHeroModel;
  readMore: string;
  close: string;
  share: string;
  knowLabel: string;
  know: string;
  imageAlt: string;
};

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
  /** Free / unpaid variant — never show product-level fixed commission. */
  commissionNone?: string;
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
  viewCertificate?: string;
  shareMarketing: string;
  trainingNotPublished: string;
  noBuy: string;
  empty: string;
  audienceLabel: string;
  benefitsLabel: string;
  monthly?: string;
  yearly?: string;
  annualQuotaNote?: string;
  freePrice?: string;
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

function SaleVariantPriceBlock({
  productKey,
  locale,
  labels,
  fallbackMonthly,
  onVariantChange,
}: {
  productKey: string;
  locale: string;
  labels: CspCatalogLabels;
  fallbackMonthly: { amount: number; currency: string } | null;
  onVariantChange?: (variant: ProductVariantDefinition | null) => void;
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

  useEffect(() => {
    onVariantChange?.(variant ?? null);
  }, [onVariantChange, variant]);

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
                onClick={() => {
                  setVariantKey(item.variantKey);
                  onVariantChange?.(item);
                }}
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
          : variant && !variantHasPaidCustomerPrice(variant)
            ? labels.freePrice || labels.noPlannedPrice
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

function SaleCatalogProductCard({
  product,
  locale,
  labels,
  overview,
  note,
  pending,
  onCopyLink,
  portalOverview,
  experience,
}: {
  product: CspLocalizedCatalogProduct;
  locale: string;
  labels: CspCatalogLabels;
  overview:
    | { certificationStatus: string | null; commissionAmount: number | null; currency: string | null }
    | undefined;
  note: { text: string; tone: StatusTone } | undefined;
  pending: boolean;
  onCopyLink: () => void;
  portalOverview: Parameters<typeof evaluateCspCopyLinkEligibility>[0];
  experience?: CspProductExperience;
}) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDefinition | null>(null);
  const cert = certificationPresentation(product, overview?.certificationStatus, labels);
  const eligibility = evaluateCspCopyLinkEligibility(portalOverview, product.key);
  const amount = overview?.commissionAmount;
  const currency = overview?.currency;
  const selectedIsPaid = selectedVariant ? variantHasPaidCustomerPrice(selectedVariant) : true;
  const commissionText = product.future
    ? labels.future
    : !selectedIsPaid
      ? labels.commissionNone || labels.commissionPending
      : typeof amount === "number" && typeof currency === "string" && currency
        ? fill(labels.commissionAmount, { amount: formatMoney(amount, currency, locale) })
        : labels.commissionPending;
  const certPassed = overview?.certificationStatus === "passed";
  const canShare = !product.future && eligibility.allowed;
  const know = [experience?.know, product.future ? labels.futureNote : labels.plannedPriceNote].filter(Boolean).join(" ");

  return (
    <GuidedProductCard
      title={product.title}
      imageSrc={product.imagePath}
      imageAlt={experience?.imageAlt ?? product.title}
      statusLabel={product.future ? labels.future : labels.sellable}
      value={product.description}
      audienceLabel={labels.audienceLabel}
      audience={product.audience}
      knowLabel={experience?.knowLabel ?? labels.benefitsLabel}
      know={know}
      priceLabel={labels.plannedPriceNote}
      price={
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
          onVariantChange={setSelectedVariant}
        />
      }
      commissionLabel={labels.commissionLabel}
      commission={commissionText}
      readMoreLabel={experience?.readMore ?? labels.shareMarketing}
      closeLabel={experience?.close ?? labels.filterAll}
      shareLabel={experience?.share ?? labels.copyLink}
      sharePending={pending}
      shareDisabledReason={product.future ? labels.futureNote : labels.linkGatesNotMet}
      onShare={canShare ? onCopyLink : undefined}
      details={
        <div className="space-y-3">
          {product.benefits.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {product.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          ) : null}
          <p>
            <StatusIcon tone={cert.tone} /> {labels.certificationLabel}: {cert.text}
          </p>
          <p>{labels.noBuy}</p>
          {product.hasTraining ? (
            <Link href={certPassed ? "/partners/academy/certifications" : "/partners/academy/training"} className="font-semibold text-[#5538D3]">
              {certPassed ? labels.viewCertificate || labels.certPassed : labels.takeTraining}
            </Link>
          ) : (
            <p>{labels.trainingNotPublished}</p>
          )}
        </div>
      }
      footer={
        note ? (
          <p className={`mt-3 flex items-start gap-1.5 rounded-lg border p-2 text-xs ${TONE_CLASSES[note.tone]}`} role="status">
            <StatusIcon tone={note.tone} />
            <span className="break-all">{note.text}</span>
          </p>
        ) : null
      }
    />
  );
}

/**
 * Partner product catalog. Partners never purchase here: only gated "copy sales link" and training.
 * Commission amounts come from Core overview only — never invented.
 * Free variants never inherit the paid product-level fixed commission in the UI.
 */
export function CertifiedSalesPartnerProductCatalogPanel({
  labels,
  locale,
  experience,
}: {
  labels: CspCatalogLabels;
  locale: string;
  experience?: CspProductExperience;
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
    <section className="w-full space-y-5">
      {experience ? (
        <SalesExperienceHero hero={experience.hero} />
      ) : (
        <div>
          <h2 id="csp-catalog-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
            {labels.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
        </div>
      )}

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
            const note = notes[product.key];
            return (
              <SaleCatalogProductCard
                key={product.key}
                product={product}
                locale={locale}
                labels={labels}
                overview={overview}
                note={note}
                pending={pendingKey === product.key}
                onCopyLink={() => void copyLink(product)}
                portalOverview={portal.overview}
                experience={experience}
              />
            );
          })}
        </ul>
      )}

      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.noBuy}</p>
    </section>
  );
}
