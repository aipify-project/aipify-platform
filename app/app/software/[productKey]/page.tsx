import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildSoftwareShowcaseLabels } from "@/lib/commercial-packages/modules-panel-labels";
import { buildPortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import {
  APP_BILLING_ROUTE,
  APP_SOFTWARE_STORE_ROUTE,
  APP_SUBSCRIPTION_ROUTE,
  appSoftwareDetailHref,
  isValidAppProductKeyParam,
  resolveAppProductAccessState,
  resolveAppProductPrimaryAction,
} from "@/lib/product-catalog/app-customer-journey";
import { loadAppSoftwareCatalog } from "@/lib/product-catalog/load-app-software-catalog";
import { formatVariantQuotaLabel, priceForInterval } from "@/lib/product-catalog/variants";
import type { ProductCatalogLocaleCode } from "@/lib/product-catalog";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOCALES = new Set<ProductCatalogLocaleCode>(["en", "no", "sv", "da", "pl", "uk", "es"]);

type PageParams = { productKey?: string };

export default async function AppSoftwareProductDetailPage({
  params,
}: {
  params?: Promise<PageParams>;
}) {
  const locale = await getLocale();
  const catalogLocale: ProductCatalogLocaleCode = LOCALES.has(locale as ProductCatalogLocaleCode)
    ? (locale as ProductCatalogLocaleCode)
    : "en";
  const dict = await getCustomerAppDictionaryForSplits(locale, [
    "portalStructure",
    "settings",
    "customerCatalog",
  ]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const portfolio = buildPortfolioLabels(t);
  const showcase = buildSoftwareShowcaseLabels(t);
  const detail = {
    backToStore: t("customerApp.commercialPackages.softwareShowcase.backToStore"),
    openProduct: t("customerApp.commercialPackages.portfolio.openProduct"),
    entitlementActive: t("customerApp.commercialPackages.softwareShowcase.entitlementActive"),
    entitlementInactive: t(
      "customerApp.commercialPackages.softwareShowcase.entitlementInactive",
    ),
    requiresProduct: t("customerApp.customerCatalog.requiresProduct"),
    dependencyBlocked: t(
      "customerApp.commercialPackages.softwareShowcase.dependencyBlocked",
    ),
    checkoutClosed: t("customerApp.commercialPackages.softwareShowcase.checkoutClosed"),
    viewSubscription: portfolio.viewSubscriptionDetails,
    viewBilling: portfolio.manageSubscription,
    openProduct: portfolio.openProduct,
    productNotFound: t("customerApp.commercialPackages.softwareShowcase.productNotFound"),
    variantsHeading: t("customerApp.commercialPackages.softwareShowcase.variantsHeading"),
  };

  const resolved = await (params ?? Promise.resolve({} as PageParams));
  const rawKey = typeof resolved.productKey === "string" ? resolved.productKey : "";
  if (!isValidAppProductKeyParam(rawKey)) notFound();
  const productKey = rawKey.trim().toLowerCase();

  const [ctx, catalog] = await Promise.all([
    resolveHubWorkspaceContext(),
    loadAppSoftwareCatalog(catalogLocale),
  ]);

  const product = catalog.products.find((p) => p.productKey === productKey);
  if (!product) {
    return (
      <AppHubShell
        breadcrumbLabel={common.breadcrumb}
        breadcrumb={[
          { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
          { label: portfolio.myProducts, href: APP_SOFTWARE_STORE_ROUTE },
          { label: productKey },
        ]}
        eyebrow={portfolio.myProducts}
        title={detail.productNotFound}
        description={showcase.emptyBody}
        contextLabel={formatHubContextLine(common, ctx)}
      >
        <div className={`${AppLayoutClasses.pageWidth} space-y-4`}>
          <p className="text-sm text-[var(--app-text-muted)]" role="status">
            {detail.productNotFound}
          </p>
          <Link
            href={APP_SOFTWARE_STORE_ROUTE}
            className="inline-flex min-h-11 items-center rounded-xl border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {detail.backToStore}
          </Link>
        </div>
      </AppHubShell>
    );
  }

  const accessState = resolveAppProductAccessState({
    product,
    activeProductKeys: catalog.activeProductKeys,
  });
  const recommended =
    product.variants.find((v) => v.recommended && v.active) ??
    product.variants.find((v) => v.active) ??
    null;
  const primary = resolveAppProductPrimaryAction({
    product,
    variant: recommended,
    interval: "month",
    accessState,
  });
  const monthPrice = recommended ? priceForInterval(recommended, "month") : null;
  const image = product.heroImagePath ?? product.logoSrc;

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: portfolio.myProducts, href: APP_SOFTWARE_STORE_ROUTE },
        { label: product.title },
      ]}
      eyebrow={portfolio.myProducts}
      title={product.title}
      description={product.tagline || product.description}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <div className={`${AppLayoutClasses.pageWidth} space-y-6`}>
        {catalog.corePending ? (
          <p
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            role="status"
          >
            {showcase.coreChannelPending}
          </p>
        ) : null}

        <article className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)]">
          <div className="relative aspect-[21/9] w-full bg-[color:var(--aipify-accent-soft)]">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element -- signed or public catalog asset
              <img src={image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-semibold text-[color:var(--aipify-companion-purple)]">
                  {product.letter}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-4 p-6">
            <p className="text-sm leading-relaxed text-[var(--app-text-muted)]">
              {product.description}
            </p>

            {Array.isArray(product.benefits) && product.benefits.length > 0 ? (
              <ul className="space-y-1.5">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="text-sm text-[var(--app-text)]">
                    • {benefit}
                  </li>
                ))}
              </ul>
            ) : null}

            <p
              className={`text-sm font-medium ${
                accessState === "active" ? "text-emerald-700" : "text-[var(--app-text-muted)]"
              }`}
              role="status"
            >
              {accessState === "active"
                ? detail.entitlementActive
                : accessState === "dependency_blocked"
                  ? detail.dependencyBlocked
                  : detail.entitlementInactive}
            </p>

            {product.dependsOnProductKeys.length > 0 ? (
              <p className="text-sm text-[var(--app-text-muted)]" role="note">
                {`${detail.requiresProduct}: ${product.dependsOnProductKeys
                  .map((key) => {
                    const dep = catalog.products.find((p) => p.productKey === key);
                    return dep ? dep.title : key;
                  })
                  .join(", ")}`}
              </p>
            ) : null}

            {product.variants.filter((v) => v.active).length > 0 ? (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                  {detail.variantsHeading}
                </h2>
                <ul className="divide-y divide-[var(--app-border)] rounded-xl border border-[var(--app-border)]">
                  {product.variants
                    .filter((v) => v.active)
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((variant) => {
                      const price = priceForInterval(variant, "month");
                      return (
                        <li
                          key={variant.variantKey}
                          className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                        >
                          <span className="font-medium text-[var(--app-text)]">
                            {formatVariantQuotaLabel(variant, catalogLocale)}
                          </span>
                          <span className="text-[var(--app-text-muted)]">
                            {price?.amountMajor != null
                              ? `${price.amountMajor} ${price.currency}`
                              : "—"}
                          </span>
                        </li>
                      );
                    })}
                </ul>
                {product.customerPrice.status === "planned_not_stripe_live" &&
                monthPrice?.amountMajor != null ? (
                  <p className="text-xs text-[var(--app-text-muted)]">
                    {showcase.plannedPriceNote.replace(
                      "{price}",
                      `${monthPrice.amountMajor} ${monthPrice.currency}`,
                    )}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-2">
              {primary.kind === "open" ? (
                <Link
                  href={primary.href}
                  className="inline-flex min-h-11 items-center rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                >
                  {detail.openProduct || portfolio.openProduct}
                </Link>
              ) : primary.kind === "subscription" || primary.kind === "contact" ? (
                <Link
                  href={APP_SUBSCRIPTION_ROUTE}
                  className="inline-flex min-h-11 items-center rounded-xl border border-[var(--app-border)] px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                >
                  {showcase.contactAipify}
                </Link>
              ) : (
                <span
                  className="inline-flex min-h-11 items-center rounded-xl border border-dashed border-[var(--app-border)] px-4 py-2 text-sm text-[var(--app-text-muted)]"
                  role="status"
                >
                  {detail.checkoutClosed}
                </span>
              )}
              <Link
                href={APP_SUBSCRIPTION_ROUTE}
                className="inline-flex min-h-11 items-center rounded-xl border border-[var(--app-border)] px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              >
                {detail.viewSubscription}
              </Link>
              <Link
                href={APP_BILLING_ROUTE}
                className="inline-flex min-h-11 items-center rounded-xl border border-[var(--app-border)] px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              >
                {detail.viewBilling}
              </Link>
              <Link
                href={APP_SOFTWARE_STORE_ROUTE}
                className="inline-flex min-h-11 items-center rounded-xl px-4 py-2 text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
              >
                {detail.backToStore}
              </Link>
            </div>
          </div>
        </article>

        {product.dependsOnProductKeys.length > 0 ? (
          <ul className="space-y-2">
            {product.dependsOnProductKeys.map((depKey) => {
              const dep = catalog.products.find((p) => p.productKey === depKey);
              if (!dep) return null;
              return (
                <li key={depKey}>
                  <Link
                    href={appSoftwareDetailHref(dep.productKey)}
                    className="text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
                  >
                    {dep.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </AppHubShell>
  );
}
