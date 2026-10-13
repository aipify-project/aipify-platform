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

/** Kompis Bedrift product dashboard hub. */
export default async function KompisBedriftDashboardPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  const cards = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftEmployees,
      title: t("customerApp.portalStructure.nav.kompisBedriftEmployees"),
      description: hubT(t, "bedrift.employeesCard"),
      tone: "blue" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftDocuments,
      title: t("customerApp.portalStructure.nav.kompisBedriftDocuments"),
      description: hubT(t, "bedrift.documentsCard"),
      tone: "lavender" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftFaq,
      title: t("customerApp.portalStructure.nav.kompisBedriftFaq"),
      description: hubT(t, "bedrift.knowledgeCard"),
      tone: "purple" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftComms,
      title: t("customerApp.portalStructure.nav.kompisBedriftComms"),
      description: hubT(t, "bedrift.commsCard"),
      tone: "blue" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftMeetings,
      title: t("customerApp.portalStructure.nav.kompisBedriftMeetings"),
      description: hubT(t, "bedrift.meetingsCard"),
      tone: "lavender" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftModules,
      title: t("customerApp.portalStructure.nav.kompisBedriftModules"),
      description: hubT(t, "bedrift.modulesCard"),
      tone: "slate" as const,
    },
  ];

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: t("customerApp.portalStructure.navGroups.kompisBedrift") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisBedrift")}
      title={hubT(t, "bedrift.dashboardTitle")}
      description={hubT(t, "bedrift.dashboardDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
      status={{ label: common.statusReady, tone: "emerald" }}
      decorativeAccent
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
          href={FOUNDATION_NAV_BINDINGS.kompisBedriftSettings}
          className="font-medium text-aipify-accent hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus rounded"
        >
          {t("customerApp.portalStructure.nav.kompisBedriftSettings")}
        </Link>
        {" — "}
        {hubT(t, "bedrift.settingsHint")}
      </p>
    </AppHubShell>
  );
}
