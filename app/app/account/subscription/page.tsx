import { SubscriptionWorkspace } from "@/components/app/settings/billing/SubscriptionWorkspace";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildLicenseCenterLabels } from "@/lib/app/license-labels";
import {
  buildBillingPresentationMaps,
  buildBillingReferenceLabels,
} from "@/lib/commercial-packages";
import { loadSubscriptionProductReads } from "@/lib/commercial-packages/load-kompis-product-access";
import { buildModulesAdminPanelLabels } from "@/lib/commercial-packages/modules-panel-labels";
import { buildPortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import { parseSubscriptionTab } from "@/lib/commercial-packages/subscription-tabs";
import { buildEnterpriseInvoicingLabels } from "@/lib/enterprise-invoicing";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { Suspense } from "react";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/** Authoritative subscription workspace — internal tabs, single sidebar entry. */
export default async function AccountSubscriptionPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const params = (await searchParams) ?? {};
  const rawTab = typeof params.tab === "string" ? params.tab : Array.isArray(params.tab) ? params.tab[0] : null;
  const initialTab = parseSubscriptionTab(rawTab);

  const dict = await getCustomerAppDictionaryForSplits(locale, [
    "portalStructure",
    "settings",
    "dashboard",
    "core",
    "companion",
  ]);
  const licenseDict = {
    ...dict,
    ...(await getDictionary(locale, ["license"])),
  };
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const productReads = await loadSubscriptionProductReads();
  const portfolio = buildPortfolioLabels(t);

  const tabLabels = {
    overview: portfolio.tabOverview,
    products: portfolio.tabProducts,
    store: portfolio.tabStore,
    addons: portfolio.tabAddons,
    capacity: portfolio.tabCapacity,
    license: portfolio.tabLicense,
    invoices: portfolio.tabInvoices,
  };

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: t("customerApp.portalStructure.nav.accountSubscription") },
      ]}
      eyebrow={hubT(t, "account.subscriptionEyebrow")}
      title={t("customerApp.portalStructure.nav.accountSubscription")}
      description={hubT(t, "account.subscriptionDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <Suspense fallback={<AipifyLoader centered />}>
        <SubscriptionWorkspace
          labels={buildBillingReferenceLabels(t)}
          portfolio={portfolio}
          tabLabels={tabLabels}
          license={productReads.license}
          access={productReads.access}
          locale={locale}
          presentation={buildBillingPresentationMaps(dict)}
          initialTab={initialTab}
          modulesLabels={buildModulesAdminPanelLabels(t)}
          licenseLabels={buildLicenseCenterLabels(licenseDict)}
          invoiceLabels={buildEnterpriseInvoicingLabels(t, "customerApp")}
        />
      </Suspense>
    </AppHubShell>
  );
}
