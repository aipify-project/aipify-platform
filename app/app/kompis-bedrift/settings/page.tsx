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
 * Product-specific Bedrift settings hub.
 * Account billing, invoices, integrations, and global notifications live under Account.
 */
export default async function KompisBedriftSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  const productCards = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftModules,
      title: t("customerApp.portalStructure.nav.kompisBedriftModules"),
      description: hubT(t, "bedrift.settingsModulesCard"),
      tone: "blue" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftFaq,
      title: t("customerApp.portalStructure.nav.kompisBedriftFaq"),
      description: hubT(t, "bedrift.settingsKnowledgeCard"),
      tone: "purple" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftEmployees,
      title: t("customerApp.portalStructure.nav.kompisBedriftEmployees"),
      description: hubT(t, "bedrift.settingsEmployeesCard"),
      tone: "lavender" as const,
    },
  ];

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.kompisBedrift"),
          href: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
        },
        { label: t("customerApp.portalStructure.nav.kompisBedriftSettings") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisBedrift")}
      title={t("customerApp.portalStructure.nav.kompisBedriftSettings")}
      description={hubT(t, "bedrift.settingsDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productCards.map((card) => (
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
        {hubT(t, "bedrift.settingsAccountSeparation")}{" "}
        <Link
          href={FOUNDATION_NAV_BINDINGS.accountHome}
          className="font-medium text-aipify-accent hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus rounded"
        >
          {hubT(t, "account.overviewTitle")}
        </Link>
      </p>
    </AppHubShell>
  );
}
