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
import Link from "next/link";

/** Kompis Web product hub — harmonized with Bedrift/Account hub pattern. */
export default async function WebsiteKompisHubPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  // High-signal owner overview — settings/appearance live under Settings, not duplicated here.
  const cards = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebQa,
      title: t("customerApp.portalStructure.nav.kompisWebQa"),
      description: t("customerApp.portalStructure.webHub.qaDescription"),
      tone: "purple" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebFaq,
      title: t("customerApp.portalStructure.nav.kompisWebFaq"),
      description: t("customerApp.portalStructure.webHub.faqDescription"),
      tone: "blue" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
      title: t("customerApp.portalStructure.nav.kompisWebConnection"),
      description: t("customerApp.portalStructure.webHub.connectionDescription"),
      tone: "lavender" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebModules,
      title: t("customerApp.portalStructure.nav.kompisWebModules"),
      description: hubT(t, "web.modulesCard"),
      tone: "slate" as const,
    },
  ];

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: t("customerApp.portalStructure.navGroups.kompisWeb") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
      title={t("customerApp.portalStructure.nav.kompisWebDashboard")}
      description={t("customerApp.portalStructure.webHub.description")}
      contextLabel={formatHubContextLine(common, ctx)}
      status={{ label: common.statusReady, tone: "emerald" }}
      decorativeAccent
      primaryAction={{
        label: t("customerApp.portalStructure.nav.kompisWebQa"),
        href: FOUNDATION_NAV_BINDINGS.kompisWebQa,
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
      <p className="text-sm text-aipify-text-secondary">
        <Link
          href={FOUNDATION_NAV_BINDINGS.kompisOperatorPreserved}
          className="font-medium text-aipify-accent hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus rounded"
        >
          {t("customerApp.portalStructure.webHub.operatorLink")}
        </Link>
      </p>
    </AppHubShell>
  );
}
