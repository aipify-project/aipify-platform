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
import { ShieldCheck } from "lucide-react";
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
      breadcrumbLabel={common.breadcrumb}
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
        <section className="overflow-hidden rounded-[var(--app-radius-lg)] border border-[var(--app-border-accent)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)]">
          <div className="flex items-start gap-3 bg-[image:var(--app-primary-soft-fill)] px-5 py-5 sm:px-6">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-[var(--app-primary)]" strokeWidth={2} />
            <div>
              <h2 className="text-sm font-medium text-[var(--app-text-muted)]">{labels.currentLicense}</h2>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--app-text)]">
                {productReads.license.planName ?? labels.detailsUnavailable}
              </p>
            </div>
          </div>
          <div className="space-y-2 px-5 py-5 sm:px-6">
            <p className="text-sm text-[var(--app-text-muted)]">{labels.noChange}</p>
            <p className="text-sm text-[var(--app-text-muted)]">{labels.contactForAccess}</p>
          </div>
        </section>
        <KompisProductPortfolio labels={labels} access={productReads.access} showCatalog />
        <Link
          href="/app/settings/billing/invoice-details"
          className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.invoiceDetails}
        </Link>
      </div>
    </AppHubShell>
  );
}
