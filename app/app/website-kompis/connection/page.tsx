import Link from "next/link";
import { AppIconActionCard } from "@/components/app/design";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { HubArrowIcon } from "@/components/app/hubs/HubArrowIcon";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Kompis Web — connection and license hub (separate from Subscription).
 * Read-only presentation of existing domain/install surfaces.
 */
export default async function WebsiteKompisConnectionPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  const cards = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebDomainsLegacy,
      title: hubT(t, "web.connectionDomainsTitle"),
      description: hubT(t, "web.connectionDomainsCard"),
      tone: "purple" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountSubscription,
      title: t("customerApp.portalStructure.nav.accountSubscription"),
      description: hubT(t, "web.connectionVsSubscription"),
      tone: "blue" as const,
    },
  ];

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
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <AppIconActionCard
            key={card.href}
            href={card.href}
            title={card.title}
            description={card.description}
            tone={card.tone}
            icon={<HubArrowIcon />}
          />
        ))}
      </div>
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
