import { CUSTOMER_CATALOG_ROUTE } from "@/lib/app-portal/customer-catalog/model";
import type { CustomerCatalogLabels } from "@/lib/app-portal/customer-catalog/labels";
import type {
  CatalogCategory,
  CatalogInterval,
  CatalogPrice,
  CatalogProduct,
  CatalogProductState,
} from "@/lib/app-portal/customer-catalog/model";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import Image from "next/image";
import Link from "next/link";

type CustomerProductCatalogProps = {
  labels: CustomerCatalogLabels;
  locale: string;
  categories: CatalogCategory[];
  products: CatalogProduct[];
  activeCategory: string;
  interval: CatalogInterval | null;
  showIntervalToggle: boolean;
  expandedProductId: string | null;
  billingUnavailable: boolean;
};

function catalogHref(input: {
  category: string;
  interval: CatalogInterval | null;
  expanded: string | null;
}): string {
  const params = new URLSearchParams();
  if (input.category && input.category !== "all") params.set("category", input.category);
  if (input.interval) params.set("interval", input.interval);
  if (input.expanded) params.set("features", input.expanded);
  const query = params.toString();
  return query ? `${CUSTOMER_CATALOG_ROUTE}?${query}` : CUSTOMER_CATALOG_ROUTE;
}

function categoryLabel(category: CatalogCategory, labels: CustomerCatalogLabels): string {
  if (category.labelKey === "all") return labels.all;
  if (category.labelKey === "kompis") return labels.kompis;
  if (category.labelKey === "voice") return labels.voice;
  return category.label ?? labels.otherCategory;
}

function productTitle(product: CatalogProduct, labels: CustomerCatalogLabels): string {
  if (product.titleKey === "kompisWeb") return labels.kompisWebTitle;
  if (product.titleKey === "kompisBedrift") return labels.kompisBedriftTitle;
  return product.title ?? labels.otherCategory;
}

function productDescription(product: CatalogProduct, labels: CustomerCatalogLabels): string | null {
  if (product.descriptionKey === "kompisWeb") return labels.kompisWebDescription;
  if (product.descriptionKey === "kompisBedrift") return labels.kompisBedriftDescription;
  return product.description;
}

function stateLabel(state: CatalogProductState, labels: CustomerCatalogLabels): string {
  if (state === "active") return labels.stateActive;
  if (state === "not_licensed") return labels.stateNotLicensed;
  if (state === "coming_later") return labels.stateComingLater;
  return labels.stateUnknown;
}

function formatPrice(price: CatalogPrice, locale: string): string | null {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: price.currency,
      maximumFractionDigits: Number.isInteger(price.amount) ? 0 : 2,
    }).format(price.amount);
  } catch {
    return null;
  }
}

function selectedPrice(product: CatalogProduct, interval: CatalogInterval | null): CatalogPrice | null {
  if (product.prices.length === 0) return null;
  if (interval) {
    const match = product.prices.find((price) => price.interval === interval);
    if (match) return match;
  }
  return product.prices[0] ?? null;
}

export function CustomerProductCatalog({
  labels,
  locale,
  categories,
  products,
  activeCategory,
  interval,
  showIntervalToggle,
  expandedProductId,
  billingUnavailable,
}: CustomerProductCatalogProps) {
  return (
    <div className="space-y-6">
      {billingUnavailable ? (
        <p className="rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-soft-surface)] px-4 py-3 text-sm text-[var(--app-text)]">
          {labels.billingUnavailable}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label={labels.categoriesLabel} className="min-w-0">
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => {
              const active = category.id === activeCategory;
              return (
                <li key={category.id} className="shrink-0">
                  <Link
                    href={catalogHref({ category: category.id, interval, expanded: null })}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium ${AppPremiumShell.focusRing} ${
                      active
                        ? "border-[var(--app-primary)] bg-[var(--app-soft-surface)] text-[var(--app-text)]"
                        : "border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)]"
                    }`}
                  >
                    {categoryLabel(category, labels)}
                    <span className="ml-2 text-xs">{category.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {showIntervalToggle && interval ? (
          <div className="flex gap-2" role="group" aria-label={labels.intervalLabel}>
            {(["month", "year"] as const).map((value) => (
              <Link
                key={value}
                href={catalogHref({ category: activeCategory, interval: value, expanded: expandedProductId })}
                aria-current={interval === value ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-[var(--app-radius-md)] border px-4 text-sm font-medium ${AppPremiumShell.focusRing} ${
                  interval === value
                    ? "border-[var(--app-primary)] text-[var(--app-text)]"
                    : "border-[var(--app-border)] text-[var(--app-text-muted)]"
                }`}
              >
                {value === "month" ? labels.monthly : labels.yearly}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {products.map((product) => {
          const price = selectedPrice(product, interval);
          const formatted = price ? formatPrice(price, locale) : null;
          const expanded = expandedProductId === product.id && product.features.length > 0;
          const description = productDescription(product, labels);
          return (
            <article
              key={product.id}
              className="flex h-full flex-col rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-[var(--app-shadow-card)]"
            >
              {product.imagePath ? (
                <Image src={product.imagePath} alt="" width={64} height={64} className="mb-4 h-16 w-16 object-contain" />
              ) : null}
              <h2 className="text-lg font-semibold text-[var(--app-text)]">{productTitle(product, labels)}</h2>
              {description ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">{description}</p>
              ) : null}
              <p className="mt-4 text-sm font-medium text-[var(--app-text)]">{stateLabel(product.state, labels)}</p>
              <p className="mt-2 text-base font-semibold text-[var(--app-text)]">
                {formatted ?? labels.priceUnavailable}
                {formatted && price ? (
                  <span className="ml-1 text-sm font-normal text-[var(--app-text-muted)]">
                    {price.interval === "year" ? labels.yearly : labels.monthly}
                  </span>
                ) : null}
              </p>
              <div className="mt-4 border-t border-[var(--app-border)] pt-4">
                {product.features.length > 0 ? (
                  <>
                    <Link
                      href={catalogHref({
                        category: activeCategory,
                        interval,
                        expanded: expanded ? null : product.id,
                      })}
                      className={`inline-flex min-h-11 items-center text-sm font-medium text-[var(--app-primary)] ${AppPremiumShell.focusRing}`}
                    >
                      {expanded ? labels.hideFeatures : labels.seeAllFeatures}
                    </Link>
                    {expanded ? (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-[var(--app-text)]">{labels.includedHeading}</p>
                        <ul className="mt-2 space-y-1 text-sm text-[var(--app-text-muted)]">
                          {product.features.map((feature) => (
                            <li key={feature}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>
              <div className="mt-auto pt-4">
                {product.openHref ? (
                  <Link
                    href={product.openHref}
                    className={`inline-flex min-h-11 items-center rounded-[var(--app-radius-md)] bg-[var(--app-primary)] px-4 text-sm font-medium text-white ${AppPremiumShell.focusRing}`}
                  >
                    {labels.openProduct}
                  </Link>
                ) : (
                  <p className="text-sm text-[var(--app-text-muted)]">{labels.purchaseClosed}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
