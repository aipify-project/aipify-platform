import Link from "next/link";
import { AppIconActionCard } from "@/components/app/design";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { HubFeatureIcon } from "@/components/app/hubs/HubFeatureIcon";
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
 * Kompis Bedrift — connection and license hub (separate from Subscription).
 */
export default async function KompisBedriftConnectionPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  const cards = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftEmployees,
      title: t("customerApp.portalStructure.nav.kompisBedriftEmployees"),
      description: hubT(t, "bedrift.connectionAccessCard"),
      tone: "purple" as const,
      icon: "users" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountSubscription,
      title: t("customerApp.portalStructure.nav.accountSubscription"),
      description: hubT(t, "bedrift.connectionVsSubscription"),
      tone: "blue" as const,
      icon: "connection" as const,
    },
  ];

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.kompisBedrift"),
          href: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
        },
        { label: t("customerApp.portalStructure.nav.kompisBedriftConnection") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisBedrift")}
      title={t("customerApp.portalStructure.nav.kompisBedriftConnection")}
      description={hubT(t, "bedrift.connectionDescription")}
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
            icon={<HubFeatureIcon kind={card.icon} />}
          />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-aipify-text-secondary">
        {hubT(t, "bedrift.connectionLicenseNote")}{" "}
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
