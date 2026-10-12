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

/** Web settings hub — large cards; Integrations/Notifications are not sidebar rows. */
export default async function WebsiteKompisSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  const cards = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebAppearance,
      title: t("customerApp.portalStructure.nav.kompisWebAppearance"),
      description: t("customerApp.portalStructure.webHub.appearanceDescription"),
      tone: "purple" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountIntegrations,
      title: t("customerApp.portalStructure.nav.accountIntegrations"),
      description: hubT(t, "account.integrationsCard"),
      tone: "blue" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountNotifications,
      title: t("customerApp.portalStructure.nav.accountNotifications"),
      description: hubT(t, "account.notificationsCard"),
      tone: "lavender" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisOperatorPreserved,
      title: t("customerApp.portalStructure.webHub.operatorLink"),
      description: t("customerApp.portalStructure.webHub.settingsDescription"),
      tone: "slate" as const,
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
        { label: t("customerApp.portalStructure.nav.kompisWebSettings") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
      title={t("customerApp.portalStructure.nav.kompisWebSettings")}
      description={t("customerApp.portalStructure.webHub.settingsDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
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
    </AppHubShell>
  );
}
