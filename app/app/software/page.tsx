import { SoftwareProductShowcase } from "@/components/app/software/SoftwareProductShowcase";
import { CUSTOMER_CATALOG_ROUTE } from "@/lib/app-portal/customer-catalog/model";
import { buildCustomerCatalogLabels } from "@/lib/app-portal/customer-catalog/labels";
import { resolveStoreCategoryId, sortStoreCategoryIds } from "@/lib/app-portal/customer-catalog/categories";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import { buildSoftwareShowcaseLabels } from "@/lib/commercial-packages/modules-panel-labels";
import { buildPortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import type { ProductCatalogLocaleCode } from "@/lib/product-catalog";
import { loadAppSoftwareCatalog } from "@/lib/product-catalog/load-app-software-catalog";
import { parseSoftwareCatalogScope } from "@/lib/product-catalog/product-activation-journey";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOCALES = new Set<ProductCatalogLocaleCode>(["en", "no", "sv", "da", "pl", "uk", "es"]);

/** APP Store — APP-channel products only (not SALE-only partner catalogue). */
type SoftwareSearchParams = {
  category?: string | string[];
  scope?: string | string[];
};

function softwareListHref(input: { category: string; scope: "all" | "licensed" }): string {
  const params = new URLSearchParams();
  if (input.category && input.category !== "all") params.set("category", input.category);
  if (input.scope === "licensed") params.set("scope", "licensed");
  const q = params.toString();
  return q ? `/app/software?${q}` : "/app/software";
}

export default async function SoftwareCatalogPage({
  searchParams,
}: {
  searchParams?: Promise<SoftwareSearchParams>;
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
  const [ctx, catalog, params] = await Promise.all([
    resolveHubWorkspaceContext(),
    loadAppSoftwareCatalog(catalogLocale),
    searchParams ?? Promise.resolve({} as SoftwareSearchParams),
  ]);
  const portfolio = buildPortfolioLabels(t);
  const showcase = buildSoftwareShowcaseLabels(t);
  const catalogLabels = buildCustomerCatalogLabels(t);

  const allProducts = catalog.products;
  const scopeFilter = parseSoftwareCatalogScope(params.scope);

  const rawCategory = params.category;
  const categoryParam = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  const categoryFilter =
    typeof categoryParam === "string" && categoryParam.trim().toLowerCase() === "all"
      ? "all"
      : typeof categoryParam === "string" && categoryParam.trim() !== ""
        ? resolveStoreCategoryId({ productKey: null, category: categoryParam })
        : "all";

  const scopedProducts =
    scopeFilter === "licensed"
      ? allProducts.filter((p) => p.entitlementActive)
      : allProducts;

  const products =
    categoryFilter === "all"
      ? scopedProducts
      : scopedProducts.filter(
          (p) =>
            resolveStoreCategoryId({
              productKey: p.productKey,
              category: p.storeCategoryId || p.category,
            }) === categoryFilter,
        );

  const categories = sortStoreCategoryIds([
    "all",
    ...allProducts.map((p) =>
      resolveStoreCategoryId({
        productKey: p.productKey,
        category: p.storeCategoryId || p.category,
      }),
    ),
  ]);

  const corePendingNote = catalog.corePending ? showcase.coreChannelPending ?? null : null;

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: portfolio.myProducts },
      ]}
      eyebrow={portfolio.myProducts}
      title={showcase.heroTitle}
      description={showcase.heroBody}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <div className={`${AppLayoutClasses.pageWidth} space-y-6`}>
        {corePendingNote ? (
          <p
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
            role="status"
          >
            {corePendingNote}
          </p>
        ) : null}
        <div
          role="group"
          aria-label={showcase.scopeLabel}
          className="flex flex-wrap gap-2"
        >
          {(
            [
              { id: "all" as const, label: showcase.scopeAll },
              { id: "licensed" as const, label: showcase.scopeLicensed },
            ] as const
          ).map((scope) => {
            const active = scope.id === scopeFilter;
            return (
              <Link
                key={scope.id}
                href={softwareListHref({ category: categoryFilter, scope: scope.id })}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] ${
                  active
                    ? "bg-[color:var(--aipify-companion-purple)] text-white"
                    : "border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] hover:bg-[color:var(--aipify-accent-soft)]"
                }`}
              >
                {scope.label}
              </Link>
            );
          })}
        </div>
        <SoftwareProductShowcase
          embedded
          showcase={showcase}
          labels={portfolio}
          catalogLabels={catalogLabels}
          products={products}
          categories={categories}
          activeCategory={categoryFilter}
          accessScope={scopeFilter}
          emptyTitle={
            scopeFilter === "licensed" ? showcase.emptyLicensedTitle : showcase.emptyTitle
          }
          emptyBody={
            scopeFilter === "licensed" ? showcase.emptyLicensedBody : showcase.emptyBody
          }
          seeInformation={showcase.seeInformation}
          contactAipify={showcase.contactAipify}
          notForPurchase={showcase.notForPurchase}
          plannedPriceNote={showcase.plannedPriceNote}
          locale={catalogLocale}
        />
        <div className="flex flex-wrap gap-4">
          <Link
            href={CUSTOMER_CATALOG_ROUTE}
            className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {catalogLabels.exploreLink}
          </Link>
          <Link
            href="/app/account/subscription"
            className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {portfolio.viewSubscriptionDetails}
          </Link>
          <Link
            href={FOUNDATION_NAV_BINDINGS.supportTickets}
            className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {t("customerApp.portalStructure.nav.supportTickets")}
          </Link>
        </div>
      </div>
    </AppHubShell>
  );
}
