import CustomerPortalGuard from "@/components/app/CustomerPortalGuard";
import TwoFactorSessionGate from "@/components/auth/TwoFactorSessionGate";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DashboardProfileProvider } from "@/components/dashboard/DashboardProfileProvider";
import { buildAppNavConfig, buildAppNavGroupConfig } from "@/lib/app/build-nav";
import {
  buildLayoutCommandBarLabels,
  buildLayoutCompanionPresenceLabels,
  buildLayoutLicensePanelLabels,
  buildLayoutVocWidgetLabels,
} from "@/lib/app/layout-shell-labels";
import { buildAppNavSearchIndex } from "@/lib/app/nav-search";
import { APP_MOBILE_NAV_IDS } from "@/lib/app/nav-config";
import { customerNavSourcesFromSearchIndex } from "@/lib/command-bar";
import { getAppLayoutDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getAppLayoutDictionary(locale);
  const t = createTranslator(dict);
  const navGroups = buildAppNavGroupConfig(t);
  const navConfig = buildAppNavConfig(t);
  const navSearchIndex = buildAppNavSearchIndex(navGroups, navConfig, t);

  return (
    <CustomerPortalGuard loadingLabel={t("common.loading")}>
      <TwoFactorSessionGate loadingLabel={t("common.loading")}>
      <DashboardProfileProvider>
        <DashboardShell
          appName={t("common.appName")}
          planName={t("shell.sidebar.plan")}
          shellLabel={t("shell.sidebar.workspaceControlCenter")}
          searchPlaceholder={t("shell.search")}
          companySelectorLabel={t("shell.topbar.companySelector")}
          notificationsLabel={t("shell.topbar.notifications")}
          profileFallbackName={t("shell.topbar.profileFallback")}
          companyFallbackName={t("shell.topbar.companyFallback")}
          signOutLabel={t("shell.signOut")}
          roleLabels={{
            owner: t("shell.roles.owner"),
            admin: t("shell.roles.admin"),
            support: t("shell.roles.support"),
            staff: t("shell.roles.staff"),
            read_only: t("shell.roles.read_only"),
            super_admin: t("shell.roles.super_admin"),
            platform_support: t("shell.roles.platform_support"),
            manager: t("shell.roles.manager"),
            growth_partner: t("shell.roles.growth_partner"),
            moderator: t("shell.roles.moderator"),
            member: t("shell.roles.member"),
          }}
          navConfig={navConfig}
          navGroups={navGroups}
          navSearchIndex={navSearchIndex}
          navSearchNoResultsLabel={t("shell.navSearch.noResults")}
          navSearchHint={t("shell.navSearch.hint")}
          navCompactToggleLabel={t("shell.navSearch.compactToggle")}
          navSearchResultsLabel={t("shell.navSearch.results")}
          shellVariant="customer"
          mobileNavIds={APP_MOBILE_NAV_IDS}
          licensePanelLabels={buildLayoutLicensePanelLabels(t)}
          companionPresenceLabels={buildLayoutCompanionPresenceLabels(t)}
          voiceOfCustomerLabels={buildLayoutVocWidgetLabels(t)}
          locale={locale}
          organizationSwitcherLabels={{
            label: t("shell.multiTenantArchitecture.organizationSwitcher"),
            switching: t("shell.multiTenantArchitecture.switchingOrganization"),
          }}
          twoFactorBadgeLabels={{
            enabled: t("shell.twoFactor.badge.enabled"),
            required: t("shell.twoFactor.badge.required"),
          }}
          commandBar={{
            portal: "customer",
            labels: buildLayoutCommandBarLabels(t),
            navSources: customerNavSourcesFromSearchIndex(navSearchIndex),
          }}
        >
          {children}
        </DashboardShell>
      </DashboardProfileProvider>
      </TwoFactorSessionGate>
    </CustomerPortalGuard>
  );
}
