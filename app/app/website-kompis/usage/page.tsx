import Link from "next/link";
import { WebsiteKompisPlansPanel } from "@/components/app/website-kompis/WebsiteKompisPlansPanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildWebsiteKompisPlanLabels } from "@/lib/website-kompis-plans/labels";
import { loadWebsiteKompisLicenseQuotaRead } from "@/lib/website-kompis-plans/load-license-quota-read";

/**
 * Kompis Web usage & plan status — authoritative Core quota reads only.
 * No Stripe, no entitlement writes, no invented zero usage.
 */
export default async function WebsiteKompisUsagePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core", "portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const [ctx, quotaRead] = await Promise.all([
    resolveHubWorkspaceContext(),
    loadWebsiteKompisLicenseQuotaRead(),
  ]);
  const labels = buildWebsiteKompisPlanLabels(t);

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.kompisWeb"),
          href: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
        },
        { label: t("customerApp.portalStructure.nav.kompisWebUsage") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
      title={t("customerApp.portalStructure.nav.kompisWebUsage")}
      description={t("customerApp.portalStructure.webHub.usageDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
      primaryAction={{
        label: t("customerApp.portalStructure.nav.accountSubscription"),
        href: FOUNDATION_NAV_BINDINGS.accountSubscription,
      }}
    >
      <div className={`${AppLayoutClasses.pageWidth} space-y-6`}>
        <WebsiteKompisPlansPanel labels={labels} quotaRead={quotaRead} locale={locale} />
        <p className="text-sm text-[var(--app-text-muted)]">
          <Link
            href={FOUNDATION_NAV_BINDINGS.supportTickets}
            className="rounded font-medium text-[var(--app-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
          >
            {t("customerApp.portalStructure.nav.supportTickets")}
          </Link>
        </p>
      </div>
    </AppHubShell>
  );
}
