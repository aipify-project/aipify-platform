"use client";

import type { PortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import type { buildSoftwareShowcaseLabels } from "@/lib/commercial-packages/modules-panel-labels";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog";
import {
  PremiumProductCatalogCard,
  type PremiumCatalogCardLabels,
} from "@/components/shared/product-catalog/PremiumProductCatalogCard";

type ShowcaseLabels = ReturnType<typeof buildSoftwareShowcaseLabels>;

function featureRows(product: UnifiedCatalogProduct): Array<{ label: string; included: boolean }> {
  if (product.productKey === "kompis_web") {
    return product.variants
      .filter((v) => v.active)
      .slice(0, 3)
      .map((v) => ({
        label: v.customerLabel,
        included: true,
      }));
  }
  return product.description
    ? [{ label: product.tagline || product.description.slice(0, 80), included: true }]
    : [];
}

export function SoftwareProductShowcase({
  embedded = false,
  showcase,
  labels: _labels,
  products,
  emptyTitle,
  emptyBody,
  seeInformation,
  contactAipify,
  notForPurchase,
  plannedPriceNote,
  locale = "en",
}: {
  embedded?: boolean;
  showcase: ShowcaseLabels;
  labels: PortfolioLabels;
  products: UnifiedCatalogProduct[];
  emptyTitle: string;
  emptyBody: string;
  seeInformation: string;
  contactAipify: string;
  notForPurchase: string;
  plannedPriceNote: string;
  locale?: string;
}) {
  void _labels;

  if (products.length === 0) {
    return (
      <div
        className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-card)] p-6"
        data-embedded={embedded ? "true" : "false"}
      >
        <h3 className="text-lg font-semibold text-[var(--app-text)]">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">{emptyBody}</p>
      </div>
    );
  }

  const cardLabels: PremiumCatalogCardLabels = {
    mostPopular: showcase.mostPopular,
    monthly: showcase.monthly,
    yearly: showcase.yearly,
    fromPrice: showcase.fromPrice,
    plannedPriceNote,
    notReadyForPurchase: notForPurchase,
    contactAipify,
    seeDetails: seeInformation,
    annualQuotaNote: showcase.annualQuotaNote,
    commissionFixed: "",
    commissionPercentBlocked: "",
    commissionPending: "",
    info: seeInformation,
    share: "",
    noBuy: "",
    featuresHeading: showcase.featuresHeading,
    closeDetails: showcase.closeDetails,
    vatUnknown: showcase.vatUnknown,
  };

  return (
    <div
      className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3"
      data-embedded={embedded ? "true" : "false"}
      data-unified-catalog="app"
    >
      {products.map((product) => (
        <div key={product.productKey} className="flex h-full flex-col gap-2">
          {product.app.source === "registry_fallback" || product.app.status === "blocked_needs_sql" ? (
            <p className="text-xs text-[var(--app-pending)]" role="status">
              {showcase.coreChannelPending}
            </p>
          ) : null}
          <PremiumProductCatalogCard
            product={product}
            mode="app"
            locale={locale}
            labels={cardLabels}
            features={featureRows(product)}
          />
        </div>
      ))}
    </div>
  );
}
