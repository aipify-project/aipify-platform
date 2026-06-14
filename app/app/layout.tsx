import CustomerPortalGuard from "@/components/app/CustomerPortalGuard";
import TwoFactorSessionGate from "@/components/auth/TwoFactorSessionGate";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DashboardProfileProvider } from "@/components/dashboard/DashboardProfileProvider";
import { buildAppNavConfig, buildAppNavGroupConfig } from "@/lib/app/build-nav";
import { buildAppNavSearchIndex } from "@/lib/app/nav-search";
import { APP_MOBILE_NAV_IDS } from "@/lib/app/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildLicensePanelLabels } from "@/lib/app/license-labels";
import { buildCompanionPresenceLabels } from "@/lib/presence/companion-presence-labels";
import { buildPresenceLabels } from "@/lib/presence/labels";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, [
    "common",
    "auth",
    "dashboard",
    "branding",
    "presence",
    "license",
    "customerApp",
  ]);
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
          planName={t("dashboard.sidebar.plan")}
          shellLabel={t("dashboard.sidebar.workspaceControlCenter")}
          searchPlaceholder={t("dashboard.search")}
          companySelectorLabel={t("dashboard.topbar.companySelector")}
          notificationsLabel={t("dashboard.topbar.notifications")}
          profileFallbackName={t("dashboard.topbar.profileFallback")}
          companyFallbackName={t("dashboard.topbar.companyFallback")}
          signOutLabel={t("auth.logout.signOut")}
          roleLabels={{
            owner: t("dashboard.roles.owner"),
            admin: t("dashboard.roles.admin"),
            support: t("dashboard.roles.support"),
            staff: t("dashboard.roles.staff"),
            read_only: t("dashboard.roles.read_only"),
            super_admin: t("dashboard.roles.super_admin"),
            platform_support: t("dashboard.roles.platform_support"),
            manager: t("dashboard.roles.manager"),
            growth_partner: t("dashboard.roles.growth_partner"),
            moderator: t("dashboard.roles.moderator"),
            member: t("dashboard.roles.member"),
          }}
          navConfig={navConfig}
          navGroups={navGroups}
          navSearchIndex={navSearchIndex}
          navSearchNoResultsLabel={t("dashboard.navSearch.noResults")}
          navSearchHint={t("dashboard.navSearch.hint")}
          navCompactToggleLabel={t("dashboard.navSearch.compactToggle")}
          navSearchResultsLabel={t("dashboard.navSearch.results")}
          shellVariant="customer"
          mobileNavIds={APP_MOBILE_NAV_IDS}
          licensePanelLabels={buildLicensePanelLabels(t)}
          presenceLabels={buildPresenceLabels(t)}
          companionPresenceLabels={buildCompanionPresenceLabels(t)}
          locale={locale}
          organizationSwitcherLabels={{
            label: t("customerApp.multiTenantArchitecture.organizationSwitcher"),
            switching: t("customerApp.multiTenantArchitecture.switchingOrganization"),
          }}
          twoFactorBadgeLabels={{
            enabled: t("customerApp.twoFactor.badge.enabled"),
            required: t("customerApp.twoFactor.badge.required"),
          }}
        >
          {children}
        </DashboardShell>
      </DashboardProfileProvider>
      </TwoFactorSessionGate>
    </CustomerPortalGuard>
  );
}
