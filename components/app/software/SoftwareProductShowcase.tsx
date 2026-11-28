"use client";

import type { PortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import type { buildSoftwareShowcaseLabels } from "@/lib/commercial-packages/modules-panel-labels";
import type { CustomerCatalogLabels } from "@/lib/app-portal/customer-catalog/labels";
import { storeCategoryLabelKey } from "@/lib/app-portal/customer-catalog/categories";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog";
import { appSoftwareDetailHref } from "@/lib/product-catalog/app-customer-journey";
import { formatVariantQuotaLabel } from "@/lib/product-catalog/variants";
import {
  PremiumProductCatalogCard,
  type PremiumCatalogCardLabels,
} from "@/components/shared/product-catalog/PremiumProductCatalogCard";
import Link from "next/link";

type ShowcaseLabels = ReturnType<typeof buildSoftwareShowcaseLabels>;

function featureRows(
  product: UnifiedCatalogProduct,
  locale: string,
): Array<{ label: string; included: boolean }> {
  if (Array.isArray(product.benefits) && product.benefits.length > 0) {
    return product.benefits.slice(0, 6).map((label) => ({ label, included: true }));
  }
  if (product.productKey === "kompis_web") {
    return product.variants
      .filter((v) => v.active)
      .slice(0, 3)
      .map((v) => ({
        label: formatVariantQuotaLabel(v, locale),
        included: true,
      }));
  }
  return product.description
    ? [{ label: product.tagline || product.description.slice(0, 80), included: true }]
    : [];
}

function categoryDisplayLabel(
  id: string,
  catalog: CustomerCatalogLabels,
): string {
  const key = storeCategoryLabelKey(id);
  if (key === "all") return catalog.all;
  if (key === "kompis") return catalog.kompis;
  if (key === "salesGrowth") return catalog.salesGrowth;
  if (key === "voice") return catalog.voice;
  if (key === "addons") return catalog.addons;
  return catalog.otherCategory;
}

function softwareHref(category: string, scope: "all" | "licensed" = "all"): string {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (scope === "licensed") params.set("scope", "licensed");
  const q = params.toString();
  return q ? `/app/software?${q}` : "/app/software";
}

export function SoftwareProductShowcase({
  embedded = false,
  showcase,
  labels: portfolioLabels,
  catalogLabels,
  products,
  categories,
  activeCategory = "all",
  accessScope = "all",
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
  catalogLabels: CustomerCatalogLabels;
  products: UnifiedCatalogProduct[];
  categories: string[];
  activeCategory?: string;
  accessScope?: "all" | "licensed";
  emptyTitle: string;
  emptyBody: string;
  seeInformation: string;
  contactAipify: string;
  notForPurchase: string;
  plannedPriceNote: string;
  locale?: string;
}) {

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
    freePrice: showcase.freePrice,
    openProduct: portfolioLabels.openProduct,
  };

  return (
    <div className="space-y-5" data-embedded={embedded ? "true" : "false"} data-unified-catalog="app">
      {categories.length > 1 ? (
        <div
          role="group"
          aria-label={catalogLabels.categoriesLabel}
          className="flex flex-wrap gap-2"
        >
          {categories.map((id) => {
            const active = id === activeCategory;
            return (
              <Link
                key={id}
                href={softwareHref(id, accessScope)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] ${
                  active
                    ? "bg-[color:var(--aipify-companion-purple)] text-white"
                    : "border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] hover:bg-[color:var(--aipify-accent-soft)]"
                }`}
              >
                {categoryDisplayLabel(id, catalogLabels)}
              </Link>
            );
          })}
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-card)] p-6">
          <h3 className="text-lg font-semibold text-[var(--app-text)]">{emptyTitle}</h3>
          <p className="mt-2 text-sm text-[var(--app-text-muted)]">{emptyBody}</p>
        </div>
      ) : (
        <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.productKey} className="flex h-full flex-col gap-2">
              {product.app.source === "registry_fallback" || product.app.status === "blocked_needs_sql" ? (
                <p className="text-xs text-[var(--app-pending)]" role="status">
                  {showcase.coreChannelPending}
                </p>
              ) : null}
              {product.entitlementActive ? (
                <p className="text-xs font-medium text-emerald-700" role="status">
                  {catalogLabels.stateActive}
                </p>
              ) : null}
              {product.dependsOnProductKeys.length > 0 ? (
                <p className="text-xs text-[var(--app-text-muted)]" role="note">
                  {`${catalogLabels.requiresProduct}: ${product.dependsOnProductKeys.join(", ")}`}
                </p>
              ) : null}
              {product.productType ? (
                <p className="text-xs uppercase tracking-wide text-[var(--app-text-muted)]">
                  {product.productType}
                </p>
              ) : null}
              <PremiumProductCatalogCard
                product={{
                  ...product,
                  // APP customer surface: never leak partner commission into the card model.
                  commission: { kind: "unknown" },
                }}
                mode="app"
                locale={locale}
                labels={cardLabels}
                heroSrc={product.heroImagePath ?? product.logoSrc}
                features={featureRows(product, locale)}
                detailsHref={appSoftwareDetailHref(product.productKey)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
