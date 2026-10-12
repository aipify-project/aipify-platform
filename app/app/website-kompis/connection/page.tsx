import { DomainLicenseCenterPanel } from "@/components/app/domain-license";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildDomainLicenseLabels } from "@/lib/domain-license/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import Link from "next/link";

/**
 * Kompis Web — connection and license hub.
 * Embeds the authoritative domain/license panel (no license mutation changes).
 */
export default async function WebsiteKompisConnectionPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

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
      description={hubT(t, "web.connectionDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
      status={
        ctx.licenseStatusLabel
          ? { label: ctx.licenseStatusLabel, tone: "emerald" }
          : { label: common.statusReady, tone: "slate" }
      }
      primaryAction={{
        label: t("customerApp.portalStructure.nav.accountSubscription"),
        href: FOUNDATION_NAV_BINDINGS.accountSubscription,
      }}
    >
      <DomainLicenseCenterPanel labels={buildDomainLicenseLabels(t)} embedded />
      <p className="text-sm leading-relaxed text-aipify-text-secondary">
        {hubT(t, "web.connectionLicenseNote")}{" "}
        <Link
          href={FOUNDATION_NAV_BINDINGS.accountSubscription}
          className="rounded font-medium text-aipify-accent hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
        >
          {t("customerApp.portalStructure.nav.accountSubscription")}
        </Link>
      </p>
    </AppHubShell>
  );
}
