import { CustomerProductCatalog } from "@/components/app/catalog/CustomerProductCatalog";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildCustomerCatalogLabels } from "@/lib/app-portal/customer-catalog/labels";
import {
  buildCustomerCatalog,
  catalogHasBothIntervals,
  selectCatalogProducts,
  type CatalogInterval,
} from "@/lib/app-portal/customer-catalog/model";
import { getCustomerBillingCenter } from "@/lib/commercial-packages/client";
import { loadSubscriptionProductReads } from "@/lib/commercial-packages/load-kompis-product-access";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ExplorePageProps = {
  searchParams: Promise<{ category?: string; interval?: string; features?: string }>;
};

export default async function ExploreProductsPage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "customerCatalog"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const labels = buildCustomerCatalogLabels(t);
  const [ctx, productReads] = await Promise.all([
    resolveHubWorkspaceContext(),
    loadSubscriptionProductReads(),
  ]);

  let billing: unknown = null;
  let billingUnavailable = false;
  try {
    const supabase = await createClient();
    billing = await getCustomerBillingCenter(supabase);
  } catch {
    billingUnavailable = true;
  }

  const catalog = buildCustomerCatalog({
    billing,
    access: productReads.access,
    billingUnavailable,
  });
  const activeCategory = catalog.categories.some((category) => category.id === params.category)
    ? params.category ?? "all"
    : "all";
  const products = selectCatalogProducts(catalog, activeCategory);
  const showIntervalToggle = catalogHasBothIntervals(products);
  const interval: CatalogInterval | null = showIntervalToggle
    ? params.interval === "year"
      ? "year"
      : "month"
    : null;

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: labels.title },
      ]}
      eyebrow={labels.eyebrow}
      title={labels.title}
      description={labels.description}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <div className={AppLayoutClasses.pageWidth}>
        <CustomerProductCatalog
          labels={labels}
          locale={locale}
          categories={catalog.categories}
          products={products}
          activeCategory={activeCategory}
          interval={interval}
          showIntervalToggle={showIntervalToggle}
          expandedProductId={params.features ?? null}
          billingUnavailable={catalog.billingUnavailable}
        />
      </div>
    </AppHubShell>
  );
}
