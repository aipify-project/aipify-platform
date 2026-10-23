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
 * Bedrift settings hub — Integrations/Notifications as page cards, not sidebar rows.
 */
export default async function KompisBedriftSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  const cards = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftModules,
      title: t("customerApp.portalStructure.nav.kompisBedriftModules"),
      description: hubT(t, "bedrift.settingsModulesCard"),
      tone: "blue" as const,
      icon: "modules" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftFaq,
      title: t("customerApp.portalStructure.nav.kompisBedriftFaq"),
      description: hubT(t, "bedrift.settingsKnowledgeCard"),
      tone: "purple" as const,
      icon: "faq" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisBedriftEmployees,
      title: t("customerApp.portalStructure.nav.kompisBedriftEmployees"),
      description: hubT(t, "bedrift.settingsEmployeesCard"),
      tone: "lavender" as const,
      icon: "users" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountIntegrations,
      title: t("customerApp.portalStructure.nav.accountIntegrations"),
      description: hubT(t, "account.integrationsCard"),
      tone: "slate" as const,
      icon: "connection" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountNotifications,
      title: t("customerApp.portalStructure.nav.accountNotifications"),
      description: hubT(t, "account.notificationsCard"),
      tone: "emerald" as const,
      icon: "messages" as const,
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
        { label: t("customerApp.portalStructure.nav.kompisBedriftSettings") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisBedrift")}
      title={t("customerApp.portalStructure.nav.kompisBedriftSettings")}
      description={hubT(t, "bedrift.settingsDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
    </AppHubShell>
  );
}
