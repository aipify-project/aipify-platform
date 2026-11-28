"use client";

/**
 * Partner SALE product catalog — Core-authoritative via csp_get_partner_overview.
 * Reuses PremiumProductCatalogCard mode="sale" (PARTNER_STOREFRONT_REUSE_CONTRACT).
 * Never APP-only. No buy/checkout. Variant commission from Core rates (null ≠ 0).
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { evaluateCspCopyLinkEligibility } from "@/lib/certified-sales-partner/copy-link-eligibility";
import { CSP_CATALOG_FILTERS, type CspCatalogFilter } from "@/lib/certified-sales-partner/product-catalog-display";
import {
  buildPartnerStorefrontViewModel,
  productLevelCommissionEstimate,
  type PartnerStorefrontFilter,
} from "@/lib/product-catalog/partner-storefront-view-model";
import {
  indexPartnerCommissionSlots,
  partnerCommissionLookupKey,
  resolvePartnerSaleCommissionText,
  type PartnerVariantCommissionSlot,
} from "@/lib/product-catalog/partner-variant-commission-read";
import {
  variantHasPaidCustomerPrice,
  type ProductCatalogLocaleCode,
  type UnifiedCatalogProduct,
} from "@/lib/product-catalog";
import type { ProductVariantDefinition } from "@/lib/product-catalog/variants";
import { PremiumProductCatalogCard, type PremiumCatalogCardLabels } from "@/components/shared/product-catalog/PremiumProductCatalogCard";
import { ensureCspSalesLink, useCspSalesLinks, writeClipboard } from "./csp-sales-links-client";
import { SalesExperienceHero } from "./sales-experience";
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
  /** Variant×period rate missing in Core (null ≠ 0). */
  commissionNotConfigured?: string;
  /** Explicit Core zero for variant×period. */
  commissionZero?: string;
  /** Template with {rate}. */
  commissionPercent?: string;
  /** Marked estimate only — never automatic variant rate. Template with {amount}. */
  commissionEstimate?: string;
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
  mostPopular?: string;
  seeDetails?: string;
  closeDetails?: string;
  featuresHeading?: string;
  vatUnknown?: string;
  catalogLoadError?: string;
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
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
  status: string | null | undefined,
  labels: CspCatalogLabels,
): { text: string; tone: StatusTone } {
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

function toPremiumLabels(labels: CspCatalogLabels): PremiumCatalogCardLabels {
  return {
    mostPopular: labels.mostPopular ?? labels.sellable,
    monthly: labels.monthly ?? "Monthly",
    yearly: labels.yearly ?? "Yearly",
    fromPrice: labels.plannedPrice,
    plannedPriceNote: labels.plannedPriceNote,
    notReadyForPurchase: labels.noBuy,
    contactAipify: labels.shareMarketing,
    seeDetails: labels.seeDetails ?? labels.shareMarketing,
    annualQuotaNote: labels.annualQuotaNote ?? "",
    commissionFixed: labels.commissionAmount,
    commissionPercentBlocked: labels.commissionPercent ?? labels.commissionPending,
    commissionPending: labels.commissionPending,
    commissionNone: labels.commissionNone,
    info: labels.seeDetails ?? labels.shareMarketing,
    share: labels.copyLink,
    noBuy: labels.noBuy,
    featuresHeading: labels.featuresHeading ?? labels.benefitsLabel,
    closeDetails: labels.closeDetails ?? labels.filterAll,
    vatUnknown: labels.vatUnknown ?? labels.plannedPriceNote,
    freePrice: labels.freePrice,
  };
}

type CatalogApiPayload = {
  found?: boolean;
  commissions?: PartnerVariantCommissionSlot[];
  variants_by_key?: Record<string, ProductVariantDefinition[]>;
  error?: string;
};

/**
 * Partner product catalog. Partners never purchase here: only gated "copy sales link" and training.
 * Commission amounts come from Core variant rates — never invented; never auto-use legacy product rate.
 * Free variants never inherit the paid product-level fixed commission in the UI.
 * Uses filterSalesCatalogProducts / buildUnifiedCatalog via buildPartnerStorefrontViewModel — Never APP-only.
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
  const [coreVariantsByKey, setCoreVariantsByKey] = useState<Record<string, ProductVariantDefinition[]> | null>(null);
  const [commissionSlots, setCommissionSlots] = useState<PartnerVariantCommissionSlot[]>([]);
  const [catalogFetchError, setCatalogFetchError] = useState(false);

  const catalogLocale = (
    ["en", "no", "sv", "da", "pl", "uk", "es"].includes(locale) ? locale : "en"
  ) as ProductCatalogLocaleCode;

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

  useEffect(() => {
    if (!portal) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/certified-sales-partner/catalog", { credentials: "same-origin" });
        if (!res.ok) {
          if (!cancelled) setCatalogFetchError(true);
          return;
        }
        const data = (await res.json()) as CatalogApiPayload;
        if (cancelled) return;
        if (data.found !== true) {
          setCatalogFetchError(true);
          return;
        }
        setCatalogFetchError(false);
        setCommissionSlots(Array.isArray(data.commissions) ? data.commissions : []);
        setCoreVariantsByKey(data.variants_by_key && typeof data.variants_by_key === "object" ? data.variants_by_key : {});
      } catch {
        if (!cancelled) setCatalogFetchError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [portal]);

  const commissionIndex = useMemo(() => indexPartnerCommissionSlots(commissionSlots), [commissionSlots]);

  /** SALE channel only: Core-published sale products. Never APP-only. No registry seed when Core empty. */
  const storefront = useMemo(() => {
    if (!portal) {
      return buildPartnerStorefrontViewModel({
        locale: catalogLocale,
        overviewProducts: [],
        coreReady: false,
      });
    }
    return buildPartnerStorefrontViewModel({
      locale: catalogLocale,
      overviewProducts: portal.overview.products,
      coreReady: true,
      categoryFilter: filter as PartnerStorefrontFilter,
      coreVariantsByKey,
      // Successful catalog fetch (even empty variants) clears planned fallback.
      coreVariantsResolved: !catalogFetchError && coreVariantsByKey !== null,
    });
  }, [portal, catalogLocale, filter, coreVariantsByKey, catalogFetchError]);

  const products = storefront.products;
  const premiumLabels = useMemo(() => toPremiumLabels(labels), [labels]);

  const filterLabels: Record<CspCatalogFilter, string> = {
    all: labels.filterAll,
    kompis: labels.filterKompis,
    voice: labels.filterVoice,
  };

  const resolveCommission = useCallback(
    (product: UnifiedCatalogProduct) =>
      (input: { variant: ProductVariantDefinition | null; interval: "month" | "year" }) => {
        const variant = input.variant;
        const slot =
          variant != null
            ? commissionIndex.get(
                partnerCommissionLookupKey(product.productKey, variant.variantKey, input.interval),
              )
            : undefined;
        // Touch helper so free-plan commission rules stay contract-tested.
        if (variant && !variantHasPaidCustomerPrice(variant)) {
          return labels.commissionNone || labels.commissionPending;
        }
        return resolvePartnerSaleCommissionText({
          variant,
          interval: input.interval,
          slot,
          productLevelEstimate: productLevelCommissionEstimate(product),
          locale,
          labels: {
            commissionNone: labels.commissionNone || labels.commissionPending,
            commissionNotConfigured: labels.commissionNotConfigured || labels.commissionPending,
            commissionZero: labels.commissionZero || "{amount}",
            commissionFixed: labels.commissionAmount,
            commissionPercent: labels.commissionPercent || labels.commissionPending,
            commissionEstimate: labels.commissionEstimate,
            commissionPending: labels.commissionPending,
          },
        });
      },
    [commissionIndex, labels, locale],
  );

  if (!portal) return null;

  async function copyLink(productKey: string) {
    setPendingKey(productKey);
    setNotes((prev) => ({ ...prev, [productKey]: { text: labels.copyingLink, tone: "muted" } }));
    const setNote = (text: string, tone: StatusTone) => setNotes((prev) => ({ ...prev, [productKey]: { text, tone } }));
    try {
      const existing = linksState.phase === "ready" ? linksState.links : [];
      const outcome = await ensureCspSalesLink({
        productKey,
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

      {catalogFetchError ? (
        <p className="rounded-xl border border-orange-300 bg-orange-50 p-4 text-sm text-orange-900" role="alert">
          {labels.catalogLoadError || labels.error}
        </p>
      ) : null}

      {products.length === 0 ? (
        <p className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4 text-sm text-[color:var(--aipify-text-secondary)]">
          {labels.empty}
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const overview = overviewByKey.get(product.productKey);
            const note = notes[product.productKey];
            const cert = certificationPresentation(overview?.certificationStatus, labels);
            const eligibility = evaluateCspCopyLinkEligibility(portal.overview, product.productKey);
            const certPassed = overview?.certificationStatus === "passed";
            const canShare = eligibility.allowed;
            const shareLabel = experience?.share ?? labels.copyLink;
            return (
              <li key={product.productKey} className="list-none">
                <PremiumProductCatalogCard
                  product={product}
                  mode="sale"
                  locale={locale}
                  labels={{ ...premiumLabels, share: shareLabel }}
                  heroSrc={product.heroImagePath ?? product.logoSrc}
                  features={
                    experience?.know
                      ? [{ label: experience.know, included: true }]
                      : undefined
                  }
                  shareDisabled={pendingKey === product.productKey || !canShare}
                  onShare={
                    canShare
                      ? ({ productKey }) => {
                          void copyLink(productKey);
                        }
                      : undefined
                  }
                  resolveSaleCommission={resolveCommission(product)}
                  detailsExtra={
                    <>
                      <p className="flex items-start gap-1.5">
                        <StatusIcon tone={cert.tone} />
                        <span>
                          {labels.certificationLabel}: {cert.text}
                        </span>
                      </p>
                      <p>{labels.noBuy}</p>
                      <Link
                        href={certPassed ? "/partners/academy/certifications" : "/partners/academy/training"}
                        className="font-semibold text-[#5538D3]"
                      >
                        {certPassed ? labels.viewCertificate || labels.certPassed : labels.takeTraining}
                      </Link>
                    </>
                  }
                  footerNote={
                    note ? (
                      <p className={`mt-1 flex items-start gap-1.5 rounded-lg border p-2 text-xs ${TONE_CLASSES[note.tone]}`} role="status">
                        <StatusIcon tone={note.tone} />
                        <span className="break-all">{note.text}</span>
                      </p>
                    ) : !canShare ? (
                      <p className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.linkGatesNotMet}</p>
                    ) : null
                  }
                />
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.noBuy}</p>
    </section>
  );
}
