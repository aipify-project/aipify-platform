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
};

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

  const rawCategory = params.category;
  const categoryParam = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  const categoryFilter =
    typeof categoryParam === "string" && categoryParam.trim().toLowerCase() === "all"
      ? "all"
      : typeof categoryParam === "string" && categoryParam.trim() !== ""
        ? resolveStoreCategoryId({ productKey: null, category: categoryParam })
        : "all";

  const products =
    categoryFilter === "all"
      ? allProducts
      : allProducts.filter(
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
        <SoftwareProductShowcase
          embedded
          showcase={showcase}
          labels={portfolio}
          catalogLabels={catalogLabels}
          products={products}
          categories={categories}
          activeCategory={categoryFilter}
          emptyTitle={showcase.emptyTitle}
          emptyBody={showcase.emptyBody}
          seeInformation={showcase.seeInformation}
          contactAipify={showcase.contactAipify}
          notForPurchase={showcase.notForPurchase}
          plannedPriceNote={showcase.plannedPriceNote}
          locale={catalogLocale}
        />
        <Link
          href={CUSTOMER_CATALOG_ROUTE}
          className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {catalogLabels.exploreLink}
        </Link>
        <Link
          href="/app/settings/billing/packages"
          className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {portfolio.packagesTitle}
        </Link>
      </div>
    </AppHubShell>
  );
}
