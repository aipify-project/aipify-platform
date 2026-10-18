import { KompisProductPortfolio } from "@/components/app/settings/billing/KompisProductPortfolio";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import { loadSubscriptionProductReads } from "@/lib/commercial-packages/load-kompis-product-access";
import { buildPortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import Link from "next/link";

export const dynamic = "force-dynamic";

/** Packages and access — Kompis portfolio. Purchase stays closed. */
export default async function PackageAccessSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const labels = buildPortfolioLabels(t);
  const productReads = await loadSubscriptionProductReads();

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.nav.accountSubscription"),
          href: FOUNDATION_NAV_BINDINGS.accountSubscription,
        },
        { label: labels.packagesTitle },
      ]}
      eyebrow={labels.packagesTitle}
      title={labels.packagesTitle}
      description={labels.packagesIntro}
    >
      <div className={`${AppLayoutClasses.pageWidth} ${AppLayoutClasses.sectionGap}`}>
        <section className={AppLayoutClasses.card}>
          <h2 className="text-lg font-semibold text-[#22263B]">{labels.currentLicense}</h2>
          <p className="mt-2 text-sm text-[#667085]">
            {productReads.license.planName ?? labels.detailsUnavailable}
          </p>
          <p className="mt-3 text-sm text-[#667085]">{labels.noChange}</p>
          <p className="mt-2 text-sm text-[#667085]">{labels.contactForAccess}</p>
        </section>
        <KompisProductPortfolio labels={labels} access={productReads.access} showCatalog />
        <Link
          href="/app/settings/billing/invoice-details"
          className="inline-flex min-h-11 items-center text-sm font-medium text-[#7055EE] hover:underline"
        >
          {labels.invoiceDetails}
        </Link>
      </div>
    </AppHubShell>
  );
}
