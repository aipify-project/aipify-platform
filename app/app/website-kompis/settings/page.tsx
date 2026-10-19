import { ArrowUpRight, Bell, Palette, PanelTop, Puzzle, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { WebsiteKompisSettingsIntro } from "@/components/app/website-kompis/WebsiteKompisSettingsIntro";
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

  const cards: Array<{
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
  }> = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebAppearance,
      title: t("customerApp.portalStructure.nav.kompisWebAppearance"),
      description: t("customerApp.portalStructure.webHub.appearanceDescription"),
      icon: Palette,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountIntegrations,
      title: t("customerApp.portalStructure.nav.accountIntegrations"),
      description: hubT(t, "account.integrationsCard"),
      icon: Puzzle,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountNotifications,
      title: t("customerApp.portalStructure.nav.accountNotifications"),
      description: hubT(t, "account.notificationsCard"),
      icon: Bell,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisOperatorPreserved,
      title: t("customerApp.portalStructure.webHub.operatorLink"),
      description: t("customerApp.portalStructure.webHub.settingsDescription"),
      icon: PanelTop,
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
      suppressPageHeader
    >
      <div className="space-y-6">
        <WebsiteKompisSettingsIntro
          eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
          title={t("customerApp.portalStructure.nav.kompisWebSettings")}
          description={t("customerApp.portalStructure.webHub.settingsDescription")}
          contextLabel={formatHubContextLine(common, ctx)}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group flex h-full min-h-36 flex-col justify-between rounded-[18px] border border-[#E4E6F2] bg-white p-5 text-[#20243E] shadow-[0_8px_22px_rgba(65,54,132,0.045)] transition-shadow hover:shadow-[0_12px_28px_rgba(65,54,132,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7357e8] motion-reduce:transition-none"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#F3EDFF] text-[#7055EE]">
                    <Icon aria-hidden className="size-5" strokeWidth={2} />
                  </span>
                  <ArrowUpRight aria-hidden className="size-4 text-[#7055EE]" />
                </span>
                <span className="mt-4 block text-base font-semibold">{card.title}</span>
                <span className="mt-1 block text-sm leading-snug text-[#65708A]">{card.description}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </AppHubShell>
  );
}
