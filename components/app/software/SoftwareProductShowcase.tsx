import { ProductHeroTile } from "@/components/app/settings/billing/ProductHeroTile";
import { ProductStatusBadge } from "@/components/app/settings/billing/ProductStatusBadge";
import type { PortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import type { buildSoftwareShowcaseLabels } from "@/lib/commercial-packages/modules-panel-labels";
import type { WorkspaceProductHero } from "@/lib/commercial-packages/product-hero";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type ShowcaseLabels = ReturnType<typeof buildSoftwareShowcaseLabels>;

function heroFor(product: UnifiedCatalogProduct): WorkspaceProductHero {
  return {
    id: product.productKey === "kompis_bedrift" ? "kompis_bedrift" : "kompis_web",
    logoSrc: product.logoSrc,
    accent: product.accent,
    letter: product.letter,
  };
}

function statusFor(
  product: UnifiedCatalogProduct
): "active" | "not_licensed" | "available" | "planned" | "under_review" {
  if (product.purchaseReadiness === "active_open") return "active";
  if (product.purchaseReadiness === "info_only") return "planned";
  if (product.purchaseReadiness === "contact") return "not_licensed";
  return "available";
}

function primaryCta(
  product: UnifiedCatalogProduct,
  labels: PortfolioLabels,
  catalogLabels: { seeInformation: string; contactAipify: string; notForPurchase: string }
): { href: string | null; label: string } {
  if (product.purchaseReadiness === "active_open" && product.openHref) {
    return {
      href: product.openHref,
      label: product.productKey === "kompis_bedrift" ? labels.seeBedrift : labels.seeWeb,
    };
  }
  if (product.purchaseReadiness === "contact") {
    return { href: "/app/account/subscription", label: catalogLabels.contactAipify };
  }
  if (product.openHref) {
    return { href: product.openHref, label: catalogLabels.seeInformation };
  }
  return { href: null, label: catalogLabels.notForPurchase };
}

export function SoftwareProductShowcase({
  embedded = false,
  showcase,
  labels,
  products,
  emptyTitle,
  emptyBody,
  seeInformation,
  contactAipify,
  notForPurchase,
  plannedPriceNote,
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
}) {
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

  return (
    <div
      className="grid items-stretch gap-5 lg:grid-cols-2"
      data-embedded={embedded ? "true" : "false"}
      data-unified-catalog="app"
    >
      {products.map((product) => {
        const status = statusFor(product);
        const cta = primaryCta(product, labels, {
          seeInformation,
          contactAipify,
          notForPurchase,
        });
        const price =
          product.customerPrice.fromMonthly != null
            ? `${product.customerPrice.fromMonthly} ${product.customerPrice.currency}`
            : null;

        return (
          <article
            key={product.productKey}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--app-border-accent)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)] motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-reduce:transform-none"
          >
            <ProductHeroTile
              hero={heroFor(product)}
              title={product.title}
              descriptor={product.tagline || showcase.heroBody}
              alt={product.title}
            />
            <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
              <p className="text-sm font-medium text-[var(--app-text)]">{product.tagline}</p>
              <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">{product.description}</p>
              {!product.localeApproved ? (
                <p className="text-xs text-[var(--app-pending)]">{showcase.heroBody}</p>
              ) : null}
              <ProductStatusBadge
                status={status}
                labels={{
                  active: labels.active,
                  notActive: labels.notLicensed,
                  notLicensed: labels.notLicensed,
                  underReview: labels.detailsUnavailable,
                  planned: labels.detailsUnavailable,
                  available: labels.availableInWorkspace,
                  unknown: labels.detailsUnavailable,
                }}
              />
              {price && product.customerPrice.status === "planned_not_stripe_live" ? (
                <p className="text-xs text-[var(--app-text-muted)]">
                  {plannedPriceNote.replace("{price}", price)}
                </p>
              ) : null}
              {/* Never show Buy — checkout is not Production-ready for these offers. */}
              {cta.href ? (
                <Link
                  href={cta.href}
                  className={`mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[var(--app-primary)] hover:underline ${AppPremiumShell.focusRing}`}
                >
                  {cta.label}
                  <ArrowRight aria-hidden className="size-4" strokeWidth={2} />
                </Link>
              ) : (
                <p className="mt-auto text-sm text-[var(--app-text-muted)]">{cta.label}</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
