"use client";

/**
 * Honest publication readiness + channel preview for Product Center.
 * Does not flip publish flags or invent Core locale/media success.
 */

import { useMemo, useState } from "react";
import {
  PremiumProductCatalogCard,
  type PremiumCatalogCardLabels,
} from "@/components/shared/product-catalog/PremiumProductCatalogCard";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog";
import {
  assessPublicationReadiness,
  type PublicationFieldStatus,
  type PublicationReadinessReport,
} from "@/lib/product-catalog/publication-readiness";

export type ProductPublicationReadinessLabels = {
  title: string;
  summaryIncomplete: string;
  summaryListingOnly: string;
  summaryComplete: string;
  channelFlagsSavable: string;
  channelFlagsBlocked: string;
  appListingYes: string;
  appListingNo: string;
  saleListingYes: string;
  saleListingNo: string;
  checkoutClosed: string;
  noCommissionApp: string;
  missingHeading: string;
  nextStepsHeading: string;
  previewHeading: string;
  previewApp: string;
  previewSale: string;
  previewNote: string;
  statusCoreReady: string;
  statusCoreMissing: string;
  statusRegistryOnly: string;
  statusPlanned: string;
  statusBlocked: string;
  statusNotApplicable: string;
  mostPopular: string;
  monthly: string;
  yearly: string;
  fromPrice: string;
  plannedPriceNote: string;
  notReadyForPurchase: string;
  contactAipify: string;
  seeDetails: string;
  annualQuotaNote: string;
  featuresHeading: string;
  closeDetails: string;
  vatUnknown: string;
  freePrice: string;
  share: string;
  noBuy: string;
  commissionFixed: string;
  commissionPercentBlocked: string;
  commissionPending: string;
};

function statusLabel(
  status: PublicationFieldStatus,
  labels: ProductPublicationReadinessLabels,
): string {
  switch (status) {
    case "core_ready":
      return labels.statusCoreReady;
    case "core_missing":
      return labels.statusCoreMissing;
    case "registry_only":
      return labels.statusRegistryOnly;
    case "planned_not_core":
      return labels.statusPlanned;
    case "blocked":
      return labels.statusBlocked;
    default:
      return labels.statusNotApplicable;
  }
}

export function ProductPublicationReadinessPanel({
  labels,
  report,
  catalogProduct,
  previewLocale = "en",
}: {
  labels: ProductPublicationReadinessLabels;
  report: PublicationReadinessReport;
  catalogProduct: UnifiedCatalogProduct | null;
  previewLocale?: string;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const summary = report.storefrontCoreComplete
    ? labels.summaryComplete
    : report.appListingFromCore || report.saleListingFromCore
      ? labels.summaryListingOnly
      : labels.summaryIncomplete;

  const cardLabels: PremiumCatalogCardLabels = useMemo(
    () => ({
      mostPopular: labels.mostPopular,
      monthly: labels.monthly,
      yearly: labels.yearly,
      fromPrice: labels.fromPrice,
      plannedPriceNote: labels.plannedPriceNote,
      notReadyForPurchase: labels.notReadyForPurchase,
      contactAipify: labels.contactAipify,
      seeDetails: labels.seeDetails,
      annualQuotaNote: labels.annualQuotaNote,
      commissionFixed: labels.commissionFixed,
      commissionPercentBlocked: labels.commissionPercentBlocked,
      commissionPending: labels.commissionPending,
      info: labels.seeDetails,
      share: labels.share,
      noBuy: labels.noBuy,
      featuresHeading: labels.featuresHeading,
      closeDetails: labels.closeDetails,
      vatUnknown: labels.vatUnknown,
      freePrice: labels.freePrice,
    }),
    [labels],
  );

  const appProduct = catalogProduct
    ? { ...catalogProduct, commission: { kind: "unknown" as const } }
    : null;

  return (
    <section
      className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4 shadow-sm sm:p-5"
      data-publication-readiness="true"
    >
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
        {labels.title}
      </h2>
      <p className="text-sm text-[color:var(--aipify-text-primary)]">{summary}</p>

      <ul className="mt-3 space-y-1.5 text-sm text-[color:var(--aipify-text-secondary)]">
        <li>
          {report.channelFlagsSavable ? labels.channelFlagsSavable : labels.channelFlagsBlocked}
        </li>
        <li>{report.appListingFromCore ? labels.appListingYes : labels.appListingNo}</li>
        <li>{report.saleListingFromCore ? labels.saleListingYes : labels.saleListingNo}</li>
        <li>{labels.checkoutClosed}</li>
        <li>{labels.noCommissionApp}</li>
      </ul>

      <div className="mt-4 space-y-2">
        {report.items.map((row) => (
          <div
            key={row.field}
            className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
            data-readiness-field={row.field}
            data-readiness-status={row.status}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-xs text-[color:var(--aipify-text-primary)]">
                {row.field}
              </span>
              <span className="text-xs font-semibold text-[color:var(--aipify-companion-purple)]">
                {statusLabel(row.status, labels)}
              </span>
            </div>
            <p className="mt-1 text-xs text-[color:var(--aipify-text-secondary)]">{row.detail}</p>
          </div>
        ))}
      </div>

      {report.missingForHonestPublication.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
            {labels.missingHeading}
          </p>
          <p className="mt-1 text-sm text-[color:var(--aipify-text-primary)]">
            {report.missingForHonestPublication.join(", ")}
          </p>
        </div>
      ) : null}

      {report.nextCoreCandidates.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
            {labels.nextStepsHeading}
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[color:var(--aipify-text-secondary)]">
            {report.nextCoreCandidates.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 border-t border-[color:var(--aipify-border)] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">
            {labels.previewHeading}
          </p>
          <button
            type="button"
            className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
            onClick={() => setPreviewOpen((open) => !open)}
            aria-expanded={previewOpen}
          >
            {previewOpen ? labels.closeDetails : labels.previewApp}
          </button>
        </div>
        <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">{labels.previewNote}</p>
        {previewOpen && appProduct ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
                {labels.previewApp}
              </p>
              <PremiumProductCatalogCard
                product={appProduct}
                mode="app"
                locale={previewLocale}
                labels={cardLabels}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
                {labels.previewSale}
              </p>
              <PremiumProductCatalogCard
                product={catalogProduct!}
                mode="sale"
                locale={previewLocale}
                labels={cardLabels}
              />
            </div>
          </div>
        ) : null}
        {previewOpen && !appProduct ? (
          <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">
            {labels.summaryIncomplete}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** Helper for editor: build report from live editor channel/taxonomy state + Core hints. */
export function buildEditorPublicationReport(input: {
  productKey: string;
  coreProductId: string | null;
  channelSchemaAvailable: boolean;
  publishApp: boolean;
  publishSale: boolean;
  masterActive: boolean | null;
  titleFromCore: string | null;
  productType: string | null;
  categoryId: string | null;
  dependsOnProductKeys: string[];
  registryLogoSrc: string | null;
  registryHeroSrc: string | null;
  variantsSource: "core" | "planned" | "empty";
  variants: Array<{
    variantKey: string;
    monthlyAmount: number | null;
    yearlyAmount: number | null;
    oneTimeAmount: number | null;
    hasPaidCustomerPrice: boolean;
  }>;
  fixedCommissionAmount: number | null;
  currency: string | null;
}): PublicationReadinessReport {
  return assessPublicationReadiness({
    ...input,
    productType: input.productType || null,
    categoryId: input.categoryId || null,
    localeCopyFromCore: false,
    mediaFromCore: false,
  });
}
