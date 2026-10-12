import { Suspense } from "react";
import { DomainLicenseCenterPanel } from "@/components/app/domain-license";
import { WebsiteKompisConnectionCenterPanel } from "@/components/app/website-kompis/WebsiteKompisConnectionCenterPanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildDomainLicenseLabels } from "@/lib/domain-license/labels";
import { buildWebsiteKompisConnectionLabels } from "@/lib/website-kompis-connection/labels";
import { loadWebsiteKompisConnectionSummary } from "@/lib/website-kompis-connection/load-summary";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

/**
 * Kompis Web — connection / license / domain visibility hub (job 66).
 * Composes existing domain license writes; does not mutate frozen public runtime.
 */
export default async function WebsiteKompisConnectionPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, [
    "core",
    "portalStructure",
    "settings",
  ]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const connectionLabels = buildWebsiteKompisConnectionLabels(t);
  const domainLabels = buildDomainLicenseLabels(t);
  const supabase = await createClient();
  const { summary } = await loadWebsiteKompisConnectionSummary(supabase);

  const statusTone =
    summary.aggregate === "active"
      ? ("emerald" as const)
      : summary.aggregate === "error" || summary.aggregate === "suspended"
        ? ("purple" as const)
        : summary.aggregate === "pending" || summary.aggregate === "action_required"
          ? ("amber" as const)
          : ("slate" as const);

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.kompisWeb"),
          href: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
        },
        { label: t("customerApp.portalStructure.nav.kompisWebConnection") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
      title={t("customerApp.portalStructure.nav.kompisWebConnection")}
      description={connectionLabels.subtitle}
      contextLabel={formatHubContextLine(common, ctx)}
      status={{
        label: connectionLabels.aggregate[summary.aggregate],
        tone: statusTone,
      }}
      primaryAction={{
        label: connectionLabels.openSubscription,
        href: FOUNDATION_NAV_BINDINGS.accountSubscription,
      }}
    >
      <Suspense fallback={<AipifyLoadingState />}>
        <WebsiteKompisConnectionCenterPanel
          labels={connectionLabels}
          summary={summary}
          domainPanel={<DomainLicenseCenterPanel labels={domainLabels} embedded />}
        />
      </Suspense>
      <p className="text-sm leading-relaxed text-aipify-text-secondary">
        {connectionLabels.subscriptionNote}{" "}
        <Link
          href={FOUNDATION_NAV_BINDINGS.accountSubscription}
          className="rounded font-medium text-aipify-accent hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
        >
          {connectionLabels.openSubscription}
        </Link>
      </p>
    </AppHubShell>
  );
}
