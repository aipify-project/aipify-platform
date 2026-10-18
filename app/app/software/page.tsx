import { SoftwareProductShowcase } from "@/components/app/software/SoftwareProductShowcase";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import { loadSubscriptionProductReads } from "@/lib/commercial-packages/load-kompis-product-access";
import { buildSoftwareShowcaseLabels } from "@/lib/commercial-packages/modules-panel-labels";
import { buildPortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Main products. Add-on modules and planned prices live on their own routes. */
export default async function SoftwareCatalogPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const [ctx, productReads] = await Promise.all([
    resolveHubWorkspaceContext(),
    loadSubscriptionProductReads(),
  ]);
  const portfolio = buildPortfolioLabels(t);
  const showcase = buildSoftwareShowcaseLabels(t);

  return (
    <AppHubShell
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
        <SoftwareProductShowcase
          embedded
          showcase={showcase}
          labels={portfolio}
          access={productReads.access}
        />
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
