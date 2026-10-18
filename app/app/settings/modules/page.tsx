import { KompisProductPortfolio } from "@/components/app/settings/billing/KompisProductPortfolio";
import { ModulesAdminPanel } from "@/components/app/settings/ModulesAdminPanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import { loadSubscriptionProductReads } from "@/lib/commercial-packages/load-kompis-product-access";
import { buildModulesAdminPanelLabels } from "@/lib/commercial-packages/modules-panel-labels";
import { buildPortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

/** Modules — licensed products for this workspace. The commercial catalog stays off this page. */
export default async function ModulesSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const labels = buildModulesAdminPanelLabels(t);
  const portfolio = buildPortfolioLabels(t);
  const productReads = await loadSubscriptionProductReads();

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: labels.title },
      ]}
      eyebrow={labels.title}
      title={labels.title}
      description={labels.productsIntro}
    >
      <div className={`${AppLayoutClasses.pageWidth} ${AppLayoutClasses.sectionGap}`}>
        <section className="overflow-hidden rounded-[var(--app-radius-lg)] border border-[var(--app-border-accent)] bg-[var(--app-card)] shadow-[var(--app-shadow-card)]">
          <div className="flex items-start gap-3 bg-[image:var(--app-primary-soft-fill)] px-5 py-5 sm:px-6">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-[var(--app-primary)]" strokeWidth={2} />
            <div>
              <h2 className="text-sm font-medium text-[var(--app-text-muted)]">{portfolio.currentLicense}</h2>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--app-text)]">
                {productReads.license.planName ?? portfolio.detailsUnavailable}
              </p>
            </div>
          </div>
        </section>
        <KompisProductPortfolio labels={portfolio} access={productReads.access} />
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href="/app/settings/billing/packages"
            className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {portfolio.packagesTitle}
          </Link>
          <Link
            href={FOUNDATION_NAV_BINDINGS.accountSubscription}
            className="inline-flex min-h-11 items-center rounded text-sm font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {labels.manageSubscription}
          </Link>
        </div>
        <ModulesAdminPanel embedded labels={labels} />
      </div>
    </AppHubShell>
  );
}
