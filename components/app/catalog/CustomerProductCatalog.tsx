import { CatalogPurchaseButton } from "@/components/app/catalog/CatalogPurchaseButton";
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

function stateTone(state: CatalogProductState): string {
  if (state === "active") return "bg-[#E8F7F0] text-[var(--app-positive)] ring-[#B7E4CF]";
  if (state === "coming_later") return "bg-[#FFF4E5] text-[var(--app-pending)] ring-[#F5D4A3]";
  if (state === "not_licensed") return "bg-[var(--app-soft-surface)] text-[var(--app-text-muted)] ring-[var(--app-border)]";
  return "bg-[#FFF4E5] text-[var(--app-pending)] ring-[#F5D4A3]";
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

function priceForInterval(product: CatalogProduct, interval: CatalogInterval): CatalogPrice | null {
  return product.prices.find((price) => price.interval === interval) ?? null;
}

function PriceCell({
  label,
  amount,
  period,
  emphasized,
}: {
  label: string;
  amount: string | null;
  period: string;
  emphasized: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col rounded-[var(--app-radius-md)] border px-3 py-3 ${
        emphasized
          ? "border-[var(--app-primary)] bg-[var(--app-soft-surface)]"
          : "border-[var(--app-border)] bg-[var(--app-card)]"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">{label}</p>
      {amount ? (
        <>
          <p className="mt-1 text-xl font-semibold tracking-tight text-[var(--app-text)]">{amount}</p>
          <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">{period}</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">—</p>
      )}
    </div>
  );
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
    <div className="space-y-5">
      {billingUnavailable ? (
        <p className="rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-soft-surface)] px-4 py-3 text-sm text-[var(--app-text)]">
          {labels.billingUnavailable}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label={labels.categoriesLabel} className="min-w-0">
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => {
              const active = category.id === activeCategory;
              return (
                <li key={category.id} className="shrink-0">
                  <Link
                    href={catalogHref({ category: category.id, interval, expanded: null })}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center rounded-full border px-3.5 text-sm font-medium ${AppPremiumShell.focusRing} ${
                      active
                        ? "border-[var(--app-primary)] bg-[var(--app-soft-surface)] text-[var(--app-text)]"
                        : "border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)]"
                    }`}
                  >
                    {categoryLabel(category, labels)}
                    <span className="ml-2 text-xs opacity-70">{category.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {showIntervalToggle && interval ? (
          <div
            className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] p-1"
            role="group"
            aria-label={labels.intervalLabel}
          >
            {(["month", "year"] as const).map((value) => (
              <Link
                key={value}
                href={catalogHref({ category: activeCategory, interval: value, expanded: expandedProductId })}
                aria-current={interval === value ? "page" : undefined}
                className={`inline-flex min-h-9 items-center rounded-[calc(var(--app-radius-md)-2px)] px-3.5 text-sm font-medium ${AppPremiumShell.focusRing} ${
                  interval === value
                    ? "bg-[var(--app-primary)] text-white"
                    : "text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                }`}
              >
                {value === "month" ? labels.monthly : labels.yearly}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {products.map((product) => {
          const monthPrice = priceForInterval(product, "month");
          const yearPrice = priceForInterval(product, "year");
          const monthFormatted = monthPrice ? formatPrice(monthPrice, locale) : null;
          const yearFormatted = yearPrice ? formatPrice(yearPrice, locale) : null;
          const hasAnyPrice = Boolean(monthFormatted || yearFormatted);
          const expanded = expandedProductId === product.id && product.features.length > 0;
          const description = productDescription(product, labels);
          const emphasizeMonth = !interval || interval === "month";
          const emphasizeYear = interval === "year";
          const purchasePrice =
            (interval === "year" ? yearPrice : monthPrice) ?? monthPrice ?? yearPrice ?? null;

          return (
            <article
              key={product.id}
              className="flex h-full flex-col overflow-hidden rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)]"
            >
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  {product.imagePath ? (
                    <Image
                      src={product.imagePath}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 shrink-0 object-contain"
                    />
                  ) : (
                    <div className="h-14 w-14 shrink-0 rounded-[var(--app-radius-md)] bg-[var(--app-soft-surface)]" aria-hidden />
                  )}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${stateTone(product.state)}`}
                  >
                    {stateLabel(product.state, labels)}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-semibold tracking-tight text-[var(--app-text)]">
                  {productTitle(product, labels)}
                </h2>
                {description ? (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]">{description}</p>
                ) : null}

                <div className="mt-5 space-y-2" aria-label={labels.intervalLabel}>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                    {labels.pricingHeading}
                  </p>
                  {hasAnyPrice ? (
                    <div className="flex gap-2">
                      <PriceCell
                        label={labels.monthly}
                        amount={monthFormatted}
                        period={labels.perMonth}
                        emphasized={emphasizeMonth && Boolean(monthFormatted)}
                      />
                      <PriceCell
                        label={labels.yearly}
                        amount={yearFormatted}
                        period={labels.perYear}
                        emphasized={emphasizeYear && Boolean(yearFormatted)}
                      />
                    </div>
                  ) : (
                    <p className="rounded-[var(--app-radius-md)] border border-dashed border-[var(--app-border)] bg-[var(--app-soft-surface)] px-3 py-3 text-sm text-[var(--app-text-muted)]">
                      {labels.priceUnavailable}
                    </p>
                  )}
                </div>

                {product.features.length > 0 ? (
                  <div className="mt-4 border-t border-[var(--app-border)] pt-4">
                    <Link
                      href={catalogHref({
                        category: activeCategory,
                        interval,
                        expanded: expanded ? null : product.id,
                      })}
                      className={`inline-flex min-h-10 items-center text-sm font-medium text-[var(--app-primary)] ${AppPremiumShell.focusRing}`}
                    >
                      {expanded ? labels.hideFeatures : labels.seeAllFeatures}
                    </Link>
                    {expanded ? (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-[var(--app-text)]">{labels.includedHeading}</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-[var(--app-text-muted)]">
                          {product.features.map((feature) => (
                            <li key={feature} className="flex gap-2">
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--app-primary)]" aria-hidden />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-auto pt-5">
                  {product.openHref ? (
                    <Link
                      href={product.openHref}
                      className={`inline-flex min-h-11 w-full items-center justify-center rounded-[var(--app-radius-md)] bg-[var(--app-primary)] px-4 text-sm font-medium text-white ${AppPremiumShell.focusRing}`}
                    >
                      {labels.openProduct}
                    </Link>
                  ) : product.checkoutEnabled && purchasePrice?.offerId ? (
                    <CatalogPurchaseButton
                      offerId={purchasePrice.offerId}
                      label={labels.startPurchase}
                      pendingLabel={labels.purchasePending}
                      errorLabel={labels.purchaseError}
                    />
                  ) : (
                    <p className="rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-soft-surface)] px-4 py-3 text-center text-sm text-[var(--app-text-muted)]">
                      {labels.purchaseClosed}
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
